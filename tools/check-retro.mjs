import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { gameSupport } from '../src/app/game-support.mjs';

assert.equal(gameSupport({ specs: [{ label: 'Controls', value: 'WASD / arrows · touch' }] }).devices, 'both');
assert.equal(gameSupport({ specs: [{ label: 'Controls', value: 'Mouse or touch · drag to aim' }] }).devices, 'both');
assert.equal(gameSupport({ specs: [{ label: 'Controls', value: 'Arrow keys + A / S / D' }] }).devices, 'desktop');
assert.equal(gameSupport({ specs: [{ label: 'Controls', value: 'Mouse · aim and click' }] }).devices, 'desktop');
assert.equal(gameSupport({ specs: [] }).devices, 'desktop');

const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.env.ARCADE_TEST_URL || 'http://localhost:3010';
const ports = await readFile(join(root, 'src/app/ported-games.ts'), 'utf8');
const originals = ['pong', 'kart', 'puck', 'chefs'].map(id => `${id}-cover-box-art.png`);
const covers = [...originals, ...[...ports.matchAll(/cover: "\/([^\"]+)"/g)].map(match => match[1])];
assert.equal(covers.length, 28, 'Every game needs its own cover');
assert.equal(new Set(covers).size, 28, 'Cover paths must be distinct');
assert.ok((await readFile(join(root, 'public/ad-ascii-hands.txt'), 'utf8')).split('\n').length >= 35);
for (const file of covers) {
  const buffer = await readFile(join(root, 'public', file));
  assert.equal(buffer.subarray(1, 4).toString(), 'PNG', `${file} must be a PNG`);
}
const wrapperDirs = ['flash', 'cuphead', '20-minutes-till-dawn', 'hollow-knight', 'angry-birds-chrome', 'angry-birds-epic', 'angry-birds-hatchery-island', 'cut-the-rope', 'helltaker', 'hill-climb-racing', 'sonic-4-episode-1', 'escape-road', 'escape-road-2', 'escape-road-3'];
for (const dir of wrapperDirs) {
  const html = await readFile(join(root, 'public/ports', dir, 'index.html'), 'utf8');
  assert.ok(html.includes('A&D ARCADE'), `${dir} loader must use A&D branding`);
  assert.ok(html.includes('/retro-player.css'), `${dir} must use the shared retro loader`);
  assert.ok(!html.includes('LMONGOLYAN ARCADE'), `${dir} must not use the old portal identity`);
}
const routes = ['/', '/about', '/collection', '/files', '/terminal', '/settings', ...[...ports.matchAll(/href: "([^\"]+)"/g)].map(match => match[1])];
for (const path of routes) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} must render`);
  const html = await response.text();
  assert.ok(html.includes('A&amp;D') || html.includes('A&D'), `${path} must have A&D identity`);
  assert.ok(!html.includes('LMONGOLYAN ARCADE'), `${path} must not use the old portal identity`);
}
assert.equal((await fetch(new URL('/play/not-a-game', base))).status, 404);
console.log(`PASS: ${covers.length} distinct covers, ${routes.length} routes, A&D identity and unknown-game 404`);
