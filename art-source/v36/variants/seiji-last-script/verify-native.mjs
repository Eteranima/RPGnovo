// Read-only source/runtime verification, plus a local audit report.
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const kinds = ['walk', 'attack', 'cast', 'ultimate', 'vfx', 'icons', 'companion'];
const expected = [12, 6, 6, 8, 6, 6, 4];
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const readJson = async name => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const frozen = await readJson('review/frozen-files.json');
const report = { id: 'seiji-last-script', reviewDate: '2026-10-11', status: 'pass-native-source-and-metadata', frames: 0, nativeRgbaRowsVerified: 0, iconNativeRgbaRowsVerified: 0, visualCropsReviewedIndividually: 48, sheets: [], sourcePixelsChanged: false, runtimePixelsChanged: false, portraitReadOnly: true, visualLimit: 'Finite visual inspection of all 48 native crops. It does not prove every anatomical detail at every runtime scale or browser playback; those integration checks belong to the root task.' };
const cropIndex = await readJson('review/native-crops.json');
for (const [index, kind] of kinds.entries()) {
  const manifest = await readJson(`${kind}-manifest.json`);
  const sourceFile = await readFile(manifest.selected), runtimeFile = await readFile(manifest.runtime);
  const originalFile = await readFile(manifest.source.replace(/\\+/g, '/'));
  const sourceSha256 = hash(sourceFile);
  assert.equal(hash(originalFile), sourceSha256);
  assert.equal(sourceSha256, manifest.sourceSha256);
  assert.equal(hash(runtimeFile), sourceSha256);
  assert.equal(sourceSha256, frozen.find(record => record.kind === kind).sha256);
  const { data, info } = await sharp(sourceFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, manifest.width); assert.equal(info.height, manifest.height); assert.equal(info.channels, 4);
  assert.equal(manifest.frames.length, expected[index]);
  let alphaZero = 0, alphaLow = 0;
  for (let p = 3; p < data.length; p += 4) {
    if (data[p] === 0) alphaZero++;
    else if (data[p] <= 24) alphaLow++;
  }
  assert.equal(alphaZero, manifest.backgroundAlphaZero);
  assert.ok(alphaZero > info.width * info.height * .1);
  const cells = [];
  for (let i = 0; i < manifest.frames.length; i++) {
    const frame = manifest.frames[i], measurement = manifest.measurements[i], cell = measurement.cell;
    assert.ok(frame.x >= cell.x && frame.y >= cell.y && frame.x + frame.w <= cell.x + cell.w && frame.y + frame.h <= cell.y + cell.h);
    assert.ok(frame.anchorX >= frame.x && frame.anchorX < frame.x + frame.w && frame.anchorY >= frame.y && frame.anchorY < frame.y + frame.h);
    assert.deepEqual(measurement.crop, frame);
    const review = cropIndex.crops.find(record => record.kind === kind && record.i === i);
    for (const key of ['x', 'y', 'w', 'h']) assert.equal(frame[key], review.crop[key], `Crop geometry is unchanged: ${kind}/${i}/${key}`);
    const native = await sharp(new URL(review.path, import.meta.url).pathname.replace(/^\//, '')).ensureAlpha().raw().toBuffer();
    for (let y = 0; y < frame.h; y++) {
      const start = ((frame.y + y) * info.width + frame.x) * 4;
      assert.deepEqual(native.subarray(y * frame.w * 4, (y + 1) * frame.w * 4), data.subarray(start, start + frame.w * 4));
      report.nativeRgbaRowsVerified++;
    }
    // All visibly painted pixels remain within the measured crop, and no cell boundary is touched.
    let visibleEdge = 0, visibleOutsideCrop = 0, edgeZero = 0, edgeLow = 0;
    for (let y = cell.y; y < cell.y + cell.h; y++) for (let x = cell.x; x < cell.x + cell.w; x++) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      const edge = x === cell.x || x === cell.x + cell.w - 1 || y === cell.y || y === cell.y + cell.h - 1;
      if (edge && alpha === 0) edgeZero++;
      else if (edge && alpha <= 24) edgeLow++;
      if (alpha > 24) {
        if (edge) visibleEdge++;
        if (x < frame.x || x >= frame.x + frame.w || y < frame.y || y >= frame.y + frame.h) visibleOutsideCrop++;
      }
    }
    assert.equal(visibleEdge, 0); assert.equal(visibleOutsideCrop, 0);
    if (!['icons', 'vfx'].includes(kind)) {
      assert.ok(measurement.headOrHatTop < frame.anchorY);
      assert.equal(measurement.groundSole, frame.anchorY);
    }
    if (kind === 'icons') {
      const individual = await sharp(measurement.individual.path).ensureAlpha().raw().toBuffer();
      assert.deepEqual(individual, native);
      assert.equal(hash(await readFile(measurement.individual.path)), measurement.individual.sha256);
      report.iconNativeRgbaRowsVerified += frame.h;
    }
    cells.push({ i, crop: frame, visibleEdge, visibleOutsideCrop, boundaryAlphaZeroPixels: edgeZero, boundaryLowAlphaPixels1To24: edgeLow, bodyHeadTop: measurement.headOrHatTop, groundSole: measurement.groundSole, anchorMethod: measurement.anchorMethod, individualNativeCropPreserved: true });
    review.crop = frame;
  }
  report.frames += manifest.frames.length;
  report.sheets.push({ kind, width: info.width, height: info.height, sha256: sourceSha256, originalSourceSelectedRuntimeIdentical: true, alphaZeroPixels: alphaZero, lowAlphaPixels1To24: alphaLow, lowAlphaPixelsPreservedWithoutCleaning: true, cells });
}
assert.equal(report.frames, 48);
const portraitHash = hash(await readFile(new URL('portrait-source.png', import.meta.url)));
assert.equal(portraitHash, frozen.find(record => record.kind === 'portrait-source-read-only').sha256);
report.portraitSourceSha256 = portraitHash;
await writeFile(new URL('review/native-crops.json', import.meta.url), JSON.stringify(cropIndex, null, 2) + '\n');
await writeFile(new URL('verification.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, frames: report.frames, nativeRgbaRowsVerified: report.nativeRgbaRowsVerified, iconNativeRgbaRowsVerified: report.iconNativeRgbaRowsVerified, sevenRuntimeSheetsUnchanged: true, portraitUnchanged: true }));
