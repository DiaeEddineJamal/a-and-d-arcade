// Builds src/app/offline-files.json: every file a ported game loads, so it can be downloaded to the
// player's device ahead of time. Sources are pinned commits, so run again only after changing a port.
//   node tools/offline-manifests.mjs
import { readFileSync, writeFileSync } from "node:fs";

const port = id => readFileSync(new URL(`../public/ports/${id}/index.html`, import.meta.url), "utf8");
const json = async url => { const response = await fetch(url); if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`); return response.json(); };
const skip = /(^|\/)(\.|index\.html$|README|ServiceWorker\.js$)|\.map$/;

// a GitHub repo folder at a commit, served from `base`
async function repo(name, sha, folder, base) {
  const { tree, truncated } = await json(`https://api.github.com/repos/${name}/git/trees/${sha}?recursive=1`);
  if (truncated) throw new Error(`${name}: file list truncated`);
  return Promise.all(tree.filter(item => item.type === "blob" && item.path.startsWith(folder) && !skip.test(item.path.slice(folder.length)))
    .map(item => [base + item.path.slice(folder.length).split("/").map(encodeURIComponent).join("/"), item.size])
    // Git LFS files show their tiny pointer's size in the tree; ask the host for the real one
    .map(async ([url, bytes]) => [url, bytes < 200 ? await size(url) || bytes : bytes]));
}

// the <base href="https://cdn.jsdelivr.net/gh/owner/repo@sha/folder/"> each jsDelivr port loads from
function jsdelivr(id) {
  const [, name, sha, folder] = /<base href="https:\/\/cdn\.jsdelivr\.net\/gh\/([^@]+)@([0-9a-f]+)\/([^"]*)"/.exec(port(id));
  return repo(name, sha, folder, `https://cdn.jsdelivr.net/gh/${name}@${sha}/${folder}`);
}

async function size(url) {
  const response = await fetch(url.startsWith("/") ? `https://archive.org/download/suma-the-lost-treasure_flash/Suma-The-Lost-Treasure.swf` : url, { method: "HEAD" });
  return Number(response.headers.get("content-length")) || 0;
}

const files = {};
for (const id of ["cuphead", "20-minutes-till-dawn", "hollow-knight", "helltaker", "hill-climb-racing"]) files[id] = await jsdelivr(id);
files["angry-birds-epic"] = await repo("darkterrayt/EpicWeb", "HEAD", "", "https://darkterrayt.github.io/EpicWeb/");

// Flash: the Ruffle player (both wasm builds, the browser picks one) plus the game's SWF
const ruffle = (await json("https://data.jsdelivr.com/v1/packages/npm/@ruffle-rs/ruffle@0.6.0?structure=flat")).files
  .filter(file => !file.name.endsWith(".map") && /^\/(ruffle\.js|core\.ruffle\.[0-9a-f]+\.js|[0-9a-f]+\.wasm)$/.test(file.name))
  .map(file => [`https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@0.6.0${file.name}`, file.size]);
const flash = port("flash");
const bases = Object.fromEntries([...flash.matchAll(/const (SWF_BASE|SWFS) = "([^"]+)"/g)].map(m => [m[1], m[2]]));
for (const [, id, expression] of flash.matchAll(/^\s*"([a-z0-9-]+)": \["[^"]+", (.+)\],$/gm)) {
  const [, constant, file] = /^(?:(\w+) \+ )?"([^"]+)"$/.exec(expression);
  const url = constant ? bases[constant] + file : file;
  files[id] = [...ruffle, [url, await size(url)]];
}

// HTML5 wrapper: each game's whole pinned repo folder, plus the index.html the wrapper fetches and runs
// (jsDelivr refuses files over 20 MiB: the wrapper sends those to GitHub's raw host, so they are saved under that address)
for (const [, id, name, sha, folder, big] of port("html5").matchAll(/^\s*"([a-z0-9-]+)": \["[^"]+", "([^@"]+)@([0-9a-f]+)\/([^"]*)"(?:, (\[.*\]))?\],$/gm)) {
  const base = `https://cdn.jsdelivr.net/gh/${name}@${sha}/${folder}`, raw = `https://raw.githubusercontent.com/${name}/${sha}/${folder}`;
  const moved = new Set(JSON.parse(big ?? "[]").map(file => base + file));
  files[id] = [[`${base}index.html`, await size(`${base}index.html`)], ...await repo(name, sha, folder, base)].map(([url, bytes]) => {
    if (bytes > 20 * 2 ** 20 && !moved.has(url)) throw new Error(`${id}: ${url} is over 20 MiB; add it to its entry in public/ports/html5/index.html`);
    return [moved.has(url) ? url.replace(base, raw) : url, bytes];
  });
}
// the Temple Run 2 editions' Draco decoder, redirected by the wrapper to the base game's pinned copy
const draco = files["temple-run-2"].filter(([url]) => /\/draco_(decoder_gltf\.wasm|wasm_wrapper_gltf\.js)$/.test(url));
for (const id of Object.keys(files).filter(id => id.startsWith("temple-run-2-"))) files[id].push(...draco);

writeFileSync(new URL("../src/app/offline-files.json", import.meta.url), JSON.stringify(files, null, 0).replace(/\],"/g, '],\n"'));
for (const [id, list] of Object.entries(files)) console.log(id.padEnd(28), String(list.length).padStart(4), "files", (list.reduce((sum, [, bytes]) => sum + bytes, 0) / 1e6).toFixed(0).padStart(6), "MB");
