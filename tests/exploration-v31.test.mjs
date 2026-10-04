import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = resolve('.'), out = mkdtempSync(join(tmpdir(), 'eter-exploration-v31-')), compiled = new Set();
// Follow the complete relative import graph so new art modules cannot be omitted.
function compileGraph(path) {
  path = resolve(path);
  if (compiled.has(path)) return;
  compiled.add(path);
  const source = readFileSync(path, 'utf8');
  for (const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) compileGraph(resolve(dirname(path), `${match[1]}.ts`));
  const target = join(out, relative(join(root, 'lib'), path).replace(/\.ts$/, '.js'));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, ts.transpileModule(source.replace(/from\s+(['"])(\.[^'"]+)\1/g, "from '$2.js'"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText);
}
for (const module of ['lib/game/renderer.ts', 'lib/game/explorationArtV31.ts', 'lib/art/companionsV31.ts']) compileGraph(module);
const imported = path => import(pathToFileURL(join(out, path)).href);
const { EXPLORATION_ASSETS_V31: assets, EXPLORATION_FRAMES_V31: frames, EXPLORATION_DIRECTIONS_V31: dirs, EXPLORATION_FRAME_MS_V31: frameMs, EXPLORATION_IDLE_FRAME_V31: idle, explorationWalkFrame } = await imported('game/explorationArtV31.js');
const { WorldRenderer } = await imported('game/renderer.js');
const { SPRITE_FRAMES } = await imported('game/sprites.js');
const { ASSETS } = await imported('game/data.js');
const { COMPANION_ART_V31, HERO_COMPANION_V31, companionForHero } = await imported('art/companionsV31.js');
const require = createRequire(import.meta.url), wranglerRequire = createRequire(require.resolve('wrangler'));
const sharp = createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };
const measured = JSON.parse(readFileSync('art-source/v31/exploration/manifest.json', 'utf8'));
const images = {};
for (const sheet of measured.sheets) {
  const key = `walk_${sheet.hero}_${sheet.direction}`, bytes = readFileSync(`public${assets[key]}`);
  equal(sha(bytes), sheet.sourceSha256, `${key}: runtime bytes equal native generated source`);
  equal([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], sheet.size, `${key}: native dimensions`);
  equal(frames[key].length, 8, `${key}: eight real poses`);
  equal(SPRITE_FRAMES[key], frames[key], `${key}: renderer registry uses measured crops`);
  const rgba = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  images[key] = { width: rgba.info.width, height: rgba.info.height, key };
  const poseHashes = new Set();
  for (let i = 0; i < 8; i++) {
    const crop = frames[key][i], { width, height, channels } = rgba.info;
    check(crop.x >= 0 && crop.y >= 0 && crop.x + crop.w <= width && crop.y + crop.h <= height, `${key}[${i}]: whole pose is enclosed by source`);
    check(crop.anchorX > crop.x && crop.anchorX < crop.x + crop.w && crop.anchorY > crop.y && crop.anchorY < crop.y + crop.h, `${key}[${i}]: feet anchor is inside own pose`);
    const rows = [];
    let visible = 0, transparent = 0, edge = 0;
    for (let y = 0; y < crop.h; y++) {
      const start = ((crop.y + y) * width + crop.x) * channels;
      rows.push(rgba.data.subarray(start, start + crop.w * channels));
      for (let x = 0; x < crop.w; x++) {
        const a = rgba.data[start + x * channels + 3];
        if (a === 0) transparent++;
        if (a > 24) { visible++; if (x === 0 || y === 0 || x === crop.w - 1 || y === crop.h - 1) edge++; }
      }
    }
    const digest = sha(Buffer.concat(rows));
    poseHashes.add(digest);
    equal(digest, sheet.frames[i].rgbaSha256, `${key}[${i}]: RGBA matches measured native crop`);
    check(visible > 10000 && transparent > 1000, `${key}[${i}]: isolated visible body with actual transparent gutter`);
    equal(edge, 0, `${key}[${i}]: no visible body crosses crop edge`);
    const choice = explorationWalkFrame(sheet.hero, dirs.indexOf(sheet.direction), i * frameMs + 10, true);
    equal([choice.key, choice.index, choice.crop], [key, i, crop], `${key}[${i}]: direction/time selects own unique pose`);
    let drawn;
    const ctx = { save() {}, restore() {}, beginPath() {}, ellipse() {}, fill() {}, drawImage(...args) { drawn = args; } };
    const fixture = { ctx, images, frame: i * frameMs + 10 };
    WorldRenderer.prototype.actor.call(fixture, sheet.hero, 280, 350, dirs.indexOf(sheet.direction), true);
    check(!!drawn, `${key}[${i}]: actual actor consumer draws pose (includes NPC Abel)`);
    equal(drawn.slice(0, 5), [images[key], crop.x, crop.y, crop.w, crop.h], `${key}[${i}]: actor uses correct directional sheet/cell without mirroring`);
    const scale = 107 / (crop.anchorY - crop.y);
    check(Math.abs(drawn[7] - crop.w * scale) < 1e-8 && Math.abs(drawn[8] - crop.h * scale) < 1e-8, `${key}[${i}]: consistent adult scale from foot anchor`);
  }
  equal(poseHashes.size, 8, `${key}: eight distinct native frames`);
  equal(explorationWalkFrame(sheet.hero, dirs.indexOf(sheet.direction), 123456, false).index, idle, `${key}: stationary actor keeps idle pose`);
}
equal(dirs, ['south', 'west', 'east', 'north'], 'Facing order preserves S/W/E/N');
equal(explorationWalkFrame('ava', 2, 900, true), undefined, 'Other approved walk art keeps existing consumer');
equal(explorationWalkFrame('abel', 999, -1, true).key, 'walk_abel_north', 'Direction clamps to valid sheet');
equal(explorationWalkFrame('orfeu', NaN, NaN, true).index, 0, 'Invalid timing does not select missing pose');
equal(Object.values(ASSETS).filter(path => path.includes('/v31/companions/')), [], 'Menu companion cutouts are not preloaded by WorldRenderer');
equal(HERO_COMPANION_V31, { seiji: 'shin', ophelia: 'mika', marin: 'umbra', gabriel: 'dante', max: 'vajra' }, 'Lore companion identities preserved');
for (const hero of ['ava', 'orfeu', 'carmilla', 'beatriz']) equal(companionForHero(hero), undefined, `${hero}: no invented companion`);
const companions = JSON.parse(readFileSync('art-source/v31/companions/manifest.json', 'utf8'));
for (const item of companions.entries) {
  const art = COMPANION_ART_V31[item.id];
  check(existsSync(`public${art.face}`) && existsSync(`public${art.fullbody}`), `${item.id}: fullbody and native face are concrete assets`);
  equal(sha(readFileSync(`public${art.fullbody}`)), item.sourceSha256, `${item.id}: fullbody is byte-identical RGBA`);
  const face = await sharp(`public${art.face}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const native = await sharp(`public${art.fullbody}`).extract({ left: item.faceCrop.x, top: item.faceCrop.y, width: item.faceCrop.w, height: item.faceCrop.h }).ensureAlpha().raw().toBuffer();
  equal(face.data, native, `${item.id}: face crop pixels exactly match native portrait`);
  equal(item.visibleCanvasEdgePixels, 0, `${item.id}: fullbody stays contained`);
}
console.log(`exploration-v31: ${checks} checks passed / 64 poses + 5 canonical companions`);
