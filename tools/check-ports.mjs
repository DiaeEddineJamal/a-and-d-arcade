import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

for (const id of ["cuphead", "20-minutes-till-dawn", "hollow-knight", "helltaker"]) {
  const html = readFileSync(new URL(`../public/ports/${id}/index.html`, import.meta.url), "utf8");
  // the loader script, not the small style-injection script that now comes first
  const script = [...html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g)].map(match => match[1]).find(code => code.includes("getParts")).split("    (async () => {")[0];
  const context = vm.createContext({
    document: { querySelector: () => ({}) }, URL, Blob, Response,
    fetch: async () => new Response("missing", { status: 404 }),
    caches: { open: async () => { throw new Error("Storage disabled"); }, has: async () => false },
  });
  vm.runInContext(script, context);
  assert.deepEqual(Array.from(context.getParts("build", 1, 2)), ["build.part1", "build.part2"]);
  await assert.rejects(context.fetchWithProgress("missing"), /HTTP 404/);
  context.fetch = async () => new Response(new Uint8Array([1, 2, 3]));
  let url = await context.mergeFiles(["part1", "part2"], "build");
  assert.deepEqual([...new Uint8Array(await (await fetch(url)).arrayBuffer())], [1, 2, 3, 1, 2, 3]);
  URL.revokeObjectURL(url);
  url = await context.mergeFiles(["part1"], "build.wasm");
  assert.equal((await fetch(url)).headers.get("content-type"), "application/wasm");
  URL.revokeObjectURL(url);
  context.caches.open = async () => ({ match: async () => null, put: async () => { throw new Error("Quota exceeded"); } });
  url = await context.mergeFiles(["part1"], "build");
  assert.equal((await (await fetch(url)).arrayBuffer()).byteLength, 3);
  URL.revokeObjectURL(url);
  assert(!html.includes("googletagmanager"));
  console.log(`${id}: download errors, multipart merge, unavailable storage and cache quota checked`);
}

// Hill Climb Racing: the upstream commit only has .partN chunks, the launcher stitches them back on fetch
{
  const html = readFileSync(new URL("../public/ports/hill-climb-racing/index.html", import.meta.url), "utf8");
  const shim = [...html.matchAll(/<script>\s*([\s\S]*?)<\/script>/g)].map(match => match[1]).find(code => code.includes("SPLIT"));
  const PART = 15221492, requested = [];
  let ignoreRange = false;
  // every byte of the virtual hcr.wasm is (its offset % 251), so any stitched range can be verified
  const fakeFetch = async (url, init = {}) => {
    requested.push(url);
    if (!/\.part\d$/.test(url)) return new Response("ok");
    const part = Number(/\.part(\d)$/.exec(url)[1]) - 1, size = part === 3 ? 15221489 : PART;
    const range = !ignoreRange && /bytes=(\d+)-(\d+)/.exec(new Headers(init.headers).get("Range") || "");
    const from = range ? +range[1] : 0, to = range ? +range[2] : size - 1;
    return new Response(Uint8Array.from({ length: to - from + 1 }, (_, i) => (part * PART + from + i) % 251), { status: range ? 206 : 200 });
  };
  const window = { fetch: fakeFetch };
  const context = vm.createContext({ window, document: { baseURI: "https://cdn.example/" }, URL, Headers, Response, ReadableStream, Promise, setTimeout });
  vm.runInContext(shim, context);
  const start = PART - 3, end = PART + 2;   // straddles the part1 / part2 boundary
  const response = await window.fetch("hcr.wasm", { headers: { Range: `bytes=${start}-${end}` } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), `bytes ${start}-${end}/${PART * 3 + 15221489}`);
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], Array.from({ length: 6 }, (_, i) => (start + i) % 251));
  assert.deepEqual(requested.slice(0, 2), ["https://cdn.example/hcr.wasm.part1", "https://cdn.example/hcr.wasm.part2"]);
  assert.equal((await window.fetch("hcr.js")).status, 200, "other files pass straight through");
  ignoreRange = true;   // a cold CDN edge answering 200 with the whole chunk
  const whole = await window.fetch("hcr.wasm", { headers: { Range: `bytes=${start}-${end}` } });
  assert.deepEqual([...new Uint8Array(await whole.arrayBuffer())], Array.from({ length: 6 }, (_, i) => (start + i) % 251));
  console.log("hill-climb-racing: split wasm/data stitched across part boundaries with byte ranges");
}
