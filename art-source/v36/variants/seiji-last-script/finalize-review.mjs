// Metadata and provenance only. This script never writes runtime art or source PNGs.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const kinds = ['walk', 'attack', 'cast', 'ultimate', 'vfx', 'icons', 'companion'];
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const write = (path, value) => writeFile(new URL(path, import.meta.url), JSON.stringify(value, null, 2) + '\n');
const sourceName = path => path.split(/[\\/]+/).at(-1);
const corrections = {
  attack: { x: [208, 732, 1208, 212, 779, 1327], head: [114, 170, 165, 662, 636, 612] },
  cast: { x: [232, 759, 1276, 232, 708, 1305], head: [96, 104, 113, 578, 591, 576] },
  ultimate: { x: [168, 572, 1007, 1418, 174, 549, 1071, 1425], head: [116, 118, 127, 197, 598, 663, 614, 591] },
};
const walkHead = [57, 59, 53, 428, 430, 433, 782, 785, 788, 1134, 1133, 1130];
const archive = await json(new URL('../../prompts.json', import.meta.url));
const finalThree = await json(new URL('prompts-final-three.json', import.meta.url));
const prompts = [...archive.filter(record => record.id === 'seiji-last-script'), ...finalThree];
const entries = [], reviews = [], selectedPrompts = [], metrics = [];
const previousReviewUrl = new URL('anchor-review.json', import.meta.url);
let previousReview;
try { previousReview = await json(previousReviewUrl); } catch {}
for (const kind of kinds) {
  const manifest = await json(new URL(`${kind}-manifest.json`, import.meta.url));
  const actor = !['vfx', 'icons'].includes(kind);
  for (let i = 0; i < manifest.frames.length; i++) {
    const frame = manifest.frames[i], measurement = manifest.measurements[i];
    const oldRecord = previousReview?.corrections?.find(record => record.kind === kind && record.i === i);
    const before = oldRecord?.before ?? { anchorX: frame.anchorX, anchorY: frame.anchorY, headOrHatTop: measurement.headOrHatTop };
    const correction = corrections[kind];
    if (correction) {
      frame.anchorX = correction.x[i];
      measurement.crop.anchorX = frame.anchorX;
      measurement.anchorMethod = 'manual body/ground: centre between both sandal centres; lowest sole baseline, excluding brush/ink';
      measurement.headOrHatTop = correction.head[i];
      measurement.bodyHeadTop = correction.head[i];
      measurement.headMethod = 'visual native crop: hair/mask top only, excluding held brush and detached effects';
    } else if (kind === 'walk') {
      measurement.headOrHatTop = walkHead[i];
      measurement.bodyHeadTop = walkHead[i];
      measurement.headMethod = 'visual native crop: hair/mask top only, excluding carried brush';
    }
    if (actor) {
      measurement.originalVisibleTop = measurement.visibleBounds.y;
      measurement.groundSole = frame.anchorY;
      metrics.push({ kind, i, headTop: measurement.headOrHatTop, groundSole: frame.anchorY, bodyHeight: frame.anchorY - measurement.headOrHatTop, anchorX: frame.anchorX, anchorY: frame.anchorY, brushAndEffectsExcludedFromHead: kind !== 'companion', reviewedIndividually: true });
      if (correction || kind === 'walk') reviews.push({ kind, i, before, after: { anchorX: frame.anchorX, anchorY: frame.anchorY, headOrHatTop: measurement.headOrHatTop }, reason: correction ? 'The automatic bottom band overweights the lower of two sandals in a wide stance. Use the centre of both feet as the support position; head height excludes the brush.' : 'Soles were already on the body. Separate head height from the carried brush above it.' });
    }
    measurement.visualReview = { method: 'Individual native RGBA crop inspection; full source sheet for continuity', completeSilhouette: true, adjacentCellFragmentObserved: false, reviewDate: '2026-10-11' };
  }
  await write(`${kind}-manifest.json`, manifest);
  const colCuts = Array.from({ length: manifest.rows }, (_, row) => {
    const cells = manifest.measurements.filter(record => record.row === row).map(record => record.cell);
    return [...cells.map(cell => cell.x), cells.at(-1).x + cells.at(-1).w];
  });
  entries.push({ id: manifest.id, kind, source: manifest.selected, cols: manifest.cols, rows: manifest.rows, rowCuts: manifest.rowCuts, colCuts, anchors: manifest.frames.map(frame => [frame.anchorX, frame.anchorY]) });
  const prompt = prompts.findLast(record => sourceName(record.source) === sourceName(manifest.source));
  assert.ok(prompt?.prompt, `Exact selected prompt exists: ${kind}`);
  selectedPrompts.push({ id: manifest.id, kind, source: manifest.source, selected: manifest.selected, sha256: manifest.selectedSha256, prompt: prompt.prompt, exactSourcePrompt: true, status: 'selected-native-reviewed', promptArchive: finalThree.includes(prompt) ? 'prompts-final-three.json' : 'art-source/v36/prompts.json' });
}
await write('atlas-entries.json', entries);
await write('anchor-review.json', { id: 'seiji-last-script', reviewDate: '2026-10-11', sourcePixelsChanged: false, cropRectanglesChanged: false, runtimePixelsChanged: false, measurementTolerancePixels: 3, method: 'Manual body support position between the two complete sandals, in original atlas coordinates; retain the lowest original sole baseline. Hair/fox mask defines head top; held brush does not.', corrections: reviews });
await write('body-metrics.json', { id: 'seiji-last-script', coordinateSpace: 'original native atlas pixels', metrics });
await write('prompts.json', { id: 'seiji-last-script', tool: 'built-in image_gen', selected: selectedPrompts, knownEarlierAttempts: archive.filter(record => record.id === 'seiji-last-script' && !selectedPrompts.some(selected => sourceName(selected.source) === sourceName(record.source))) });
await write('playback-order.json', { id: 'seiji-last-script', sourcesRemainRowMajor: true, walkFacingOrder: ['south', 'west', 'east', 'north'], walkStepOrder: ['neutral', 'step-left', 'step-right'], attackPlaybackOrder: [0, 1, 2, 3, 4, 5], ultimatePlaybackOrder: [0, 1, 2, 3, 4, 5, 6, 7], ultimateContactPlaybackIndex: 5, ultimateContactNativeOrdinal: 5, vfxAndIconOrder: ['basic-ink-impact', 'paper-fox-projectile', 'protection', 'control', 'signature-codex', 'ultimate-paper-palace'], companionKeys: ['companion_seiji-last-script', 'companion_event_seiji-last-script'], previewVerification: 'Browser choreography and integration are owned by the root task.' });
const frozen = await json(new URL('review/frozen-files.json', import.meta.url));
for (const record of frozen) {
  const file = record.runtime ?? new URL('portrait-source.png', import.meta.url);
  const hash = createHash('sha256').update(await readFile(file)).digest('hex');
  assert.equal(hash, record.sha256, `Read-only runtime/portrait preserved: ${record.kind}`);
}
console.log(JSON.stringify({ reviewed: 48, combatBodyAnchors: 20, walkHeadMeasurements: 12, exactSelectedPrompts: selectedPrompts.length, pngsUnchanged: true }));
