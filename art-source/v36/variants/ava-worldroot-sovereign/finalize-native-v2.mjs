// Native review, manual actor metadata, and provenance only; never edits image pixels.
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const kinds = ['walk', 'attack', 'cast', 'ultimate', 'vfx', 'icons'];
const counts = [12, 6, 6, 8, 6, 6];
const id = 'ava-worldroot-sovereign';
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const json = async name => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const write = (name, value) => writeFile(new URL(name, import.meta.url), JSON.stringify(value, null, 2) + '\n');
const runtimeDirectory = `public/assets/v36/variants/${id}`;
const portrait = await json('portrait-manifest.json');
assert.equal(hash(await readFile(portrait.source)), '44ffffc05265055eb3a513849af37f896aa1231fa4756aff73724ff4777f8f3a');
assert.equal(hash(await readFile(portrait.runtime)), portrait.sourceSha256);
assert.equal(hash(await readFile(portrait.face.runtime)), portrait.face.sha256);
const records = await json('generation-v2-records.json');
const nativeCrops = await json('review/native-crops.json');
const frozen = await json('review/frozen-files.json');
let previousReview;
try { previousReview = await json('anchor-review.json'); } catch {}
// Original atlas coordinates, measured between the centres of the two visible boots.
const manualX = {
  walk: [189, 548, 893, 185, 529, 887, 204, 567, 922, 183, 543, 896],
  attack: [241, 742, 1245, 270, 775, 1284],
  cast: [284, 798, 1307, 258, 759, 1325],
  ultimate: [257, 681, 1094, 1544, 240, 674, 1115, 1555],
};
const entries = [], metrics = [], anchors = [], prompts = [];
const report = { id, selectedIdentity: 'final-fair-peach-redhair-emerald-ivory', reviewDate: '2026-10-11', status: 'pass-native-art-and-metadata', cellsIndividuallyViewed: 44, nativeRgbaRowsVerified: 0, iconRgbaRowsVerified: 0, sourcePixelsChanged: false, cropRectanglesChanged: false, sheets: [], bodyMetrics: [], notes: ['All 44 native cells reviewed individually, plus full source atlases for continuity.', 'Final selected portrait and face hashes preserved.', 'Finite visual review; browser choreography and gameplay integration belong to the root task.', 'Former copper-skin/grey-braid concept is rejected historical material and is not part of this kit.'] };
for (const [index, kind] of kinds.entries()) {
  const manifest = await json(`${kind}-manifest.json`);
  const source = await readFile(manifest.selected), original = await readFile(manifest.source.replace(/\\+/g, '/')), runtime = await readFile(manifest.runtime);
  assert.deepEqual(source, original); assert.deepEqual(source, runtime);
  assert.equal(hash(source), manifest.sourceSha256);
  assert.equal(hash(runtime), frozen.find(record => record.kind === kind).sha256);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, manifest.width); assert.equal(info.height, manifest.height); assert.equal(info.channels, 4);
  assert.equal(manifest.frames.length, counts[index]);
  const cells = [];
  let alphaZero = 0, lowAlphaPixels = 0;
  for (let p = 3; p < data.length; p += 4) { if (data[p] === 0) alphaZero++; else if (data[p] <= 24) lowAlphaPixels++; }
  assert.equal(alphaZero, manifest.backgroundAlphaZero);
  for (let i = 0; i < manifest.frames.length; i++) {
    const frame = manifest.frames[i], measurement = manifest.measurements[i], cell = measurement.cell;
    const crop = nativeCrops.crops.find(record => record.kind === kind && record.i === i);
    const old = previousReview?.corrections?.find(record => record.kind === kind && record.i === i)?.before ?? { anchorX: frame.anchorX, anchorY: frame.anchorY, headOrHatTop: measurement.headOrHatTop };
    if (manualX[kind]) {
      frame.anchorX = manualX[kind][i];
      measurement.crop.anchorX = frame.anchorX;
      measurement.anchorMethod = 'manual body/ground: midpoint between the two visible boot centres, retaining lowest sole baseline; exclude rocks/hair/cape';
      measurement.headMethod = 'native individual visual review confirms crown/hair as actor top, without detached effect geometry';
      measurement.bodyHeadTop = measurement.headOrHatTop;
      measurement.groundSole = frame.anchorY;
      metrics.push({ kind, i, headTop: measurement.headOrHatTop, groundSole: frame.anchorY, bodyHeight: frame.anchorY - measurement.headOrHatTop, anchorX: frame.anchorX, anchorY: frame.anchorY, nativeBodyReviewed: true });
      anchors.push({ kind, i, before: old, after: { anchorX: frame.anchorX, anchorY: frame.anchorY, headOrHatTop: measurement.headOrHatTop }, reason: 'Use both boots for support rather than overweighting the lower boot in the automatic alpha band; no source pixels changed.' });
    }
    assert.ok(frame.x >= cell.x && frame.y >= cell.y && frame.x + frame.w <= cell.x + cell.w && frame.y + frame.h <= cell.y + cell.h);
    assert.ok(frame.anchorX >= frame.x && frame.anchorX < frame.x + frame.w && frame.anchorY >= frame.y && frame.anchorY < frame.y + frame.h);
    assert.deepEqual(measurement.crop, frame);
    for (const key of ['x', 'y', 'w', 'h']) assert.equal(frame[key], crop.crop[key]);
    const native = await sharp(fileURLToPath(new URL(crop.path, import.meta.url))).ensureAlpha().raw().toBuffer();
    for (let y = 0; y < frame.h; y++) {
      const start = ((frame.y + y) * info.width + frame.x) * 4;
      assert.deepEqual(native.subarray(y * frame.w * 4, (y + 1) * frame.w * 4), data.subarray(start, start + frame.w * 4));
      report.nativeRgbaRowsVerified++;
    }
    let visibleEdge = 0, visibleOutsideCrop = 0, boundaryAlphaZero = 0, boundaryLowAlpha = 0;
    for (let y = cell.y; y < cell.y + cell.h; y++) for (let x = cell.x; x < cell.x + cell.w; x++) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      const edge = x === cell.x || x === cell.x + cell.w - 1 || y === cell.y || y === cell.y + cell.h - 1;
      if (edge && alpha === 0) boundaryAlphaZero++; else if (edge && alpha <= 24) boundaryLowAlpha++;
      if (alpha > 24) {
        if (edge) visibleEdge++;
        if (x < frame.x || x >= frame.x + frame.w || y < frame.y || y >= frame.y + frame.h) visibleOutsideCrop++;
      }
    }
    assert.equal(visibleEdge, 0); assert.equal(visibleOutsideCrop, 0);
    if (kind === 'icons') {
      assert.deepEqual(await sharp(measurement.individual.path).ensureAlpha().raw().toBuffer(), native);
      assert.equal(hash(await readFile(measurement.individual.path)), measurement.individual.sha256);
      report.iconRgbaRowsVerified += frame.h;
    }
    measurement.visualReview = { method: 'Individual native crop and whole-sheet continuity', reviewed: true, completeSilhouette: true, adjacentCellFragmentObserved: false, date: '2026-10-11' };
    cells.push({ i, crop: frame, visibleEdge, visibleOutsideCrop, boundaryAlphaZero, boundaryLowAlpha1To24: boundaryLowAlpha, nativeRgbaUnchanged: true });
    crop.crop = frame;
  }
  await write(`${kind}-manifest.json`, manifest);
  const colCuts = Array.from({ length: manifest.rows }, (_, row) => { const cells = manifest.measurements.filter(record => record.row === row).map(record => record.cell); return [...cells.map(cell => cell.x), cells.at(-1).x + cells.at(-1).w]; });
  entries.push({ id, kind, source: manifest.selected, cols: manifest.cols, rows: manifest.rows, rowCuts: manifest.rowCuts, colCuts, anchors: manifest.frames.map(frame => [frame.anchorX, frame.anchorY]) });
  const prompt = records.assets.find(record => record.kind === kind);
  assert.equal(prompt.source.split(/[\\/]+/).at(-1), manifest.source.split(/[\\/]+/).at(-1));
  prompts.push({ ...prompt, selected: manifest.selected, sha256: hash(source), status: 'selected-native-reviewed', exactSourcePrompt: true });
  report.sheets.push({ kind, width: info.width, height: info.height, sourceSha256: hash(source), originalSelectedRuntimeByteIdentical: true, alphaZeroPixels: alphaZero, lowAlphaPixels1To24: lowAlphaPixels, lowAlphaPreservedWithoutCleaning: true, cells });
}
assert.equal(report.sheets.reduce((n, sheet) => n + sheet.cells.length, 0), 44);
const background = await json('cinematic-background-manifest.json');
assert.equal(hash(await readFile(background.selected)), background.sourceSha256);
assert.equal(hash(await readFile(background.runtime)), background.sourceSha256);
report.cinematicBackground = { reusedWithParentAuthorization: true, sourceSha256: background.sourceSha256, width: background.width, height: background.height, opaque: true, nativePixelRoundingHeight: background.ratioErrorHeightPixels, pixelsUnchanged: true };
report.portraitSha256 = portrait.sourceSha256; report.faceSha256 = portrait.face.sha256;
report.bodyMetrics = metrics;
await write('atlas-entries.json', entries);
await write('anchor-review.json', { id, coordinateSpace: 'original native atlas pixels', method: 'Manual visual support position between both boot centres; original native lowest sole retained', corrections: anchors, pixelsChanged: false });
await write('body-metrics.json', { id, coordinateSpace: 'original native atlas pixels', metrics });
await write('prompts.json', { id, tool: 'built-in image_gen', selectedIdentity: records.selectedIdentity, selected: prompts, portraitProvenance: 'art-source/v36/redesign-portraits-v2.json', portraitSha256: portrait.sourceSha256, reusedBackground: { ...background, promptArchive: 'rejected-copper-concept-2026-10-11/generation-records.json; cinematic-background record only', parentAuthorizedReuse: true }, rejectedCharacterHistory: 'rejected-copper-concept-2026-10-11/REJECTED.md' });
await write('playback-order.json', { id, sourcesRemainRowMajor: true, walkFacingOrder: ['south', 'west', 'east', 'north'], walkStepOrder: ['neutral', 'step-left', 'step-right'], attackPlaybackOrder: [0, 1, 2, 3, 4, 5], ultimatePlaybackOrder: [0, 1, 2, 3, 4, 5, 6, 7], ultimateContactPlaybackIndex: 5, ultimateContactNativeOrdinal: 5, vfxAndIconOrder: ['earth-impact', 'rock-projectile', 'protection-heal', 'mineral-bind', 'worldroot-throne', 'strata-cathedral'], companion: null, cinematicBackground: `/${runtimeDirectory}/cinematic-background.png`.replace('/public/', '/') });
await write('review/native-crops.json', nativeCrops);
await write('verification.json', report);
console.log(JSON.stringify({ status: report.status, cells: 44, nativeRgbaRowsVerified: report.nativeRgbaRowsVerified, iconRgbaRowsVerified: report.iconRgbaRowsVerified, manualBodyAnchors: metrics.length, portraitAndFacePreserved: true, cathedralUnchanged: true }));
