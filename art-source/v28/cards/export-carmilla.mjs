import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const source = 'C:/Users/Diego/.codex/generated_images/01a0fe9c-5a05-7ae0-b816-392e2a3c966b/exec-51b6a9e1-c38d-4512-85b4-79442733d918.png';
const selected = 'art-source/v28/cards/carmilla/source.png';
const output = 'public/assets/v28/cards/carmilla/card-frame.png';
copyFileSync(source, selected);
const { data, info } = await sharp(selected).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  if (data[(y * info.width + x) * 4 + 3] <= 16) continue;
  x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
}
const crop = { left: Math.max(0, x0 - 3), top: Math.max(0, y0 - 3), width: Math.min(info.width, x1 + 4) - Math.max(0, x0 - 3), height: Math.min(info.height, y1 + 4) - Math.max(0, y0 - 3) };
await sharp(selected).extract(crop).png().toFile(output);
const pixels = await sharp(output).ensureAlpha().raw().toBuffer();
for (let y = 0; y < crop.height; y++) assert.ok(pixels.subarray(y * crop.width * 4, (y + 1) * crop.width * 4).equals(data.subarray(((crop.top + y) * info.width + crop.left) * 4, ((crop.top + y) * info.width + crop.left + crop.width) * 4)));
// Sample well inside the regenerated crimson portrait backing and text panel.
const patches = [{ x: .145, y: .48, rx: .055, ry: .21 }, { x: .63, y: .48, rx: .28, ry: .19 }];
const coverage = patches.map(p => {
  let samples = 0, clear = 0, minimumAlpha = 255; const histogram = {};
  for (let y = Math.ceil((p.y - p.ry) * crop.height); y <= (p.y + p.ry) * crop.height; y++) for (let x = Math.ceil((p.x - p.rx) * crop.width); x <= (p.x + p.rx) * crop.width; x++) {
    if (Math.pow((x / crop.width - p.x) / p.rx, 2) + Math.pow((y / crop.height - p.y) / p.ry, 2) > 1) continue;
    const a = pixels[(y * crop.width + x) * 4 + 3]; samples++; minimumAlpha = Math.min(minimumAlpha, a); if (a < 255) clear++; histogram[a] = (histogram[a] || 0) + 1;
  }
  assert.ok(minimumAlpha >= 250, 'No clear holes are allowed inside the generated backing');
  return { ...p, samples, below255: clear, minimumAlpha, histogram };
});
const seen = new Uint8Array(crop.width * crop.height), queue = [Math.round(crop.height * .48) * crop.width + Math.round(crop.width * .145)];
let cursor = 0, left = crop.width, top = crop.height, right = 0, bottom = 0;
const red = p => pixels[p * 4 + 3] >= 250 && pixels[p * 4] > 35 && pixels[p * 4 + 1] < 70 && pixels[p * 4] > pixels[p * 4 + 1] * 2 && pixels[p * 4 + 2] < pixels[p * 4] * .9;
seen[queue[0]] = 1;
while (cursor < queue.length) {
  const p = queue[cursor++], x = p % crop.width, y = Math.floor(p / crop.width);
  left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const nx = x + dx, ny = y + dy, n = ny * crop.width + nx;
    if (nx < 0 || nx >= crop.width * .26 || ny < 0 || ny >= crop.height || seen[n] || !red(n)) continue;
    seen[n] = 1; queue.push(n);
  }
}
const portraitBacking = { left, top, width: right - left + 1, height: bottom - top + 1, center: { left: (left + right) / 2 / crop.width * 100, top: (top + bottom) / 2 / crop.height * 100 }, method: 'Native contiguous crimson inside the gold portrait rim' };
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const manifest = { tool: 'built-in image_gen', source, selected, output, sourceCanvas: { width: info.width, height: info.height }, crop, nativePixelsPreserved: true, sourceSha256: hash(selected), outputSha256: hash(output), interiorCoverage: coverage, portraitBacking, exteriorAlphaPreserved: true, visualReview: 'Left portrait opening now has a painted crimson backing with alpha at least252; no clear holes. Original motifs and clear exterior retained.' };
writeFileSync('art-source/v28/cards/carmilla/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
