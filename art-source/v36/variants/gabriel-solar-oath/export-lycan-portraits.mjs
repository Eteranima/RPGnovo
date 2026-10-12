import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(sourceDir, '../../../..');
const atlasPath = path.join(repo, 'public/assets/v36/variants/gabriel-solar-oath/lycan-attack.png');
const approved = JSON.parse(await fs.readFile(path.join(sourceDir, 'lycan-attack-manifest.json'), 'utf8'));
const sourceBytes = await fs.readFile(atlasPath);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (sha(sourceBytes) !== approved.runtimeSha256) throw new Error('Approved atlas hash changed.');
const decoded = await sharp(sourceBytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const crops = [
  { kind: 'portrait-lycan', rect: { left: 43, top: 26, width: 369, height: 476 }, purpose: 'Complete approved idle pose0, including both feet, tail, cloak and worn ornaments; no attack VFX.' },
  { kind: 'face-lycan', rect: { left: 119, top: 26, width: 221, height: 198 }, purpose: 'Complete lupine head, both ear tips, muzzle, worn crown, mane and neck/collar. Rectangular native crop includes shoulder ornaments and does not mask or redraw.' },
];
const entries = [];
for (const crop of crops) {
  const { left, top, width, height } = crop.rect;
  const frame = approved.frames[0];
  if (left < frame.x || top < frame.y || left + width > frame.x + frame.w || top + height > frame.y + frame.h) throw new Error('Crop must remain wholly inside pose0.');
  const png = await sharp(sourceBytes).extract(crop.rect).png().toBuffer();
  const exported = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (exported.info.width !== width || exported.info.height !== height || exported.info.channels !== 4) throw new Error('Unexpected crop dimensions/channels.');
  let alphaZeroPixels = 0, lowAlphaPixels = 0;
  for (let y = 0; y < height; y++) {
    const original = decoded.data.subarray(((top + y) * decoded.info.width + left) * 4, ((top + y) * decoded.info.width + left + width) * 4);
    const actual = exported.data.subarray(y * width * 4, (y + 1) * width * 4);
    if (!original.equals(actual)) throw new Error(`Native RGBA row mismatch ${crop.kind}:${y}`);
  }
  for (let i = 3; i < exported.data.length; i += 4) {
    if (exported.data[i] === 0) alphaZeroPixels++;
    else if (exported.data[i] <= 24) lowAlphaPixels++;
  }
  const runtime = `public/assets/v36/variants/gabriel-solar-oath/${crop.kind}.png`;
  await fs.writeFile(path.join(repo, runtime), png);
  entries.push({ ...crop, runtime, width, height, pngSha256: sha(png), rawRgbaSha256: sha(exported.data), alphaZeroPixels, lowAlphaPixels1To24: lowAlphaPixels, originalRgbaRowsCompared: height, originalRgbaIdentical: true });
}
const manifest = {
  id: 'gabriel-solar-oath', source: 'public/assets/v36/variants/gabriel-solar-oath/lycan-attack.png', sourceSha256: sha(sourceBytes),
  sourceWidth: decoded.info.width, sourceHeight: decoded.info.height, sourcePoseIndex: 0, sourcePoseCrop: approved.frames[0],
  extraction: 'Sharp native rectangular PNG crop only; no resize, repaint, masking, filtering, alpha cleaning, atlas or anchor changes.',
  visualReview: { date: '2026-10-11', status: 'reviewed-native-crops', note: 'Both exported PNGs were visually inspected at native size. Portrait retains the complete approved idle silhouette and both boots without attack particles. Face retains the lupine muzzle, eyes, both ear tips and worn crown; lower neck/shoulder ornaments are naturally included by the rectangular crop. No neighboring pose is included.' },
  sourceAtlasUnchanged: true,
  sourcePixelsChanged: false,
  sourceCropAndAnchorsChanged: false,
  entries,
};
await fs.writeFile(path.join(sourceDir, 'lycan-portrait-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ sourceAtlasUnchanged: sha(await fs.readFile(atlasPath)) === manifest.sourceSha256, crops: entries.map(x => ({ kind: x.kind, rect: x.rect, sha256: x.pngSha256, rgbaRows: x.originalRgbaRowsCompared })) }));
