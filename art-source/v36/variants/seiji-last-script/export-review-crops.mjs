import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const kinds = ['walk', 'attack', 'cast', 'ultimate', 'vfx', 'icons', 'companion'];
const records = [], frozen = [];
let nativeRowsVerified = 0;
for (const kind of kinds) {
  const manifest = JSON.parse(await readFile(new URL(`${kind}-manifest.json`, import.meta.url), 'utf8'));
  await mkdir(new URL(`review/${kind}/`, import.meta.url), { recursive: true });
  const source = await readFile(manifest.selected);
  const runtime = await readFile(manifest.runtime);
  const hash = buffer => createHash('sha256').update(buffer).digest('hex');
  assert.equal(hash(source), manifest.selectedSha256);
  assert.equal(hash(runtime), manifest.runtimeSha256);
  assert.deepEqual(source, runtime);
  frozen.push({ kind, source: manifest.selected, runtime: manifest.runtime, sha256: hash(runtime) });
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < manifest.frames.length; i++) {
    const frame = manifest.frames[i];
    const rect = { left: frame.x, top: frame.y, width: frame.w, height: frame.h };
    const cropPath = new URL(`review/${kind}/${String(i).padStart(2, '0')}.png`, import.meta.url);
    await sharp(source).extract(rect).png().toFile(fileURLToPath(cropPath));
    const raw = await sharp(fileURLToPath(cropPath)).ensureAlpha().raw().toBuffer();
    for (let y = 0; y < frame.h; y++) {
      const start = ((frame.y + y) * info.width + frame.x) * 4;
      assert.deepEqual(raw.subarray(y * frame.w * 4, (y + 1) * frame.w * 4), data.subarray(start, start + frame.w * 4));
      nativeRowsVerified++;
    }
    records.push({ kind, i, path: `review/${kind}/${String(i).padStart(2, '0')}.png`, crop: frame, nativeRgbaPreserved: true });
  }
}
const portrait = await readFile(new URL('portrait-source.png', import.meta.url));
frozen.push({ kind: 'portrait-source-read-only', sha256: createHash('sha256').update(portrait).digest('hex') });
await writeFile(new URL('review/native-crops.json', import.meta.url), JSON.stringify({ nativeRowsVerified, crops: records }, null, 2) + '\n');
await writeFile(new URL('review/frozen-files.json', import.meta.url), JSON.stringify(frozen, null, 2) + '\n');
console.log(JSON.stringify({ crops: records.length, nativeRowsVerified, runtimeUnmodified: true }));
