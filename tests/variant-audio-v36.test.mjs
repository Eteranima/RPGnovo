import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { inspectWav, signalProfile, SCORES_V36 } from '../scripts/compor-variant-audio-v36.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-variant-audio-v36-'));
for(const name of ['variantsV36','variantAudioV36']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8'),js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replaceAll("'./variantsV36'","'./variantsV36.js'").replaceAll('"./variantsV36"','"./variantsV36.js"');
 writeFileSync(join(out,`${name}.js`),js);
}
const {VARIANTS_V36}=await import(pathToFileURL(join(out,'variantsV36.js')).href);
const {variantAudioPathV36,variantSoundCueV36}=await import(pathToFileURL(join(out,'variantAudioV36.js')).href);
const report=JSON.parse(readFileSync('docs/qa-v36/audio/measurements.json','utf8')),scoreSheet=JSON.parse(readFileSync('docs/qa-v36/audio/score.json','utf8'));
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
check(report.files.length===16&&new Set(report.files.map(f=>f.sha256)).size===16,'sixteen genuinely distinct generated files');
check(new Set(report.files.map(f=>f.id)).size===8,'all eight variant identities covered');
check(!scoreSheet.externalSamples&&!scoreSheet.paidServices,'scores require neither external samples nor a paid service');
for(const variant of VARIANTS_V36){
 check(SCORES_V36.some(s=>s.id===variant.id),'score identity comes from a real variant');
 for(const beat of ['cast','ultimate']){
  const path=variantAudioPathV36(variant.id,beat),file=report.files.find(f=>f.path===`public${path}`);check(!!file,'actual fixed runtime path exists in the delivery');
  const buffer=readFileSync(file.path),actual=inspectWav(buffer),profile=signalProfile(buffer);
  check(actual.sha256===file.sha256&&actual.bytes===file.bytes,'actual PCM bytes match recorded provenance');
  check(actual.sampleRate===48000&&actual.channels===2&&actual.bitsPerSample===16,'native stereo48kHz PCM16 WAV');
  check(actual.frames===Math.round(actual.durationSeconds*48000)&&buffer.length===44+actual.frames*4,'sample count, header and payload are exact');
  check(beat==='cast'?actual.durationSeconds>=1.5&&actual.durationSeconds<=2.5:actual.durationSeconds>=3&&actual.durationSeconds<=4,'duration respects the gameplay cue contract');
  check(actual.clippedSamples===0&&actual.peakDbfs<=-1,'complete delivered signal retains headroom and never clips');
  check(Math.abs(actual.dcLeft)<.001&&Math.abs(actual.dcRight)<.001,'both channels avoid DC offset');
  check(profile.audibleOnsetSeconds<.020&&actual.first100msRmsDbfs>-24,'the impact is audible immediately instead of after an anticipation');
  check(actual.final128SamplesPeakDbfs<-38,'native tail fades before the file boundary');
  check(actual.stereoCorrelation>.2&&actual.stereoCorrelation<.999,'stereo is distinct but remains coherent in mono');
  check(profile.bands[5].energyPercent<8,'very high frequency hiss remains a small part of the real mix');
  check(file.ffmpeg.truePeakDbtp<=-.5&&Number.isFinite(file.ffmpeg.integratedLufs),'independent decoding confirms true-peak headroom and real loudness');
  const events=scoreSheet.tracks.find(s=>s.id===variant.id&&s.beat===beat).events;check(events.some(e=>e.type==='inharmonic material resonator')&&events.length>=10,'each cue combines physical timbre with musical resonances');
 }
 check(variantSoundCueV36(variant.id,variant.signature.id)===variantAudioPathV36(variant.id,'cast'),'signature resolves its own cast rather than a generic sound');
 check(variantSoundCueV36(variant.id,'ultimate')===variantAudioPathV36(variant.id,'ultimate'),'ultimate resolves the equipped identity');
 check(variantSoundCueV36(variant.id,'attack')===null,'basic actions keep their existing gameplay cue');
}
check(variantSoundCueV36(undefined,'ultimate')===null&&variantSoundCueV36('ophelia','ultimate')===null,'original forms and unknown identities never receive a premium cue');
for(const id of ['ava-worldroot-sovereign','beatriz-eclipse-tide','orfeu-unwritten-archon'])check(scoreSheet.tracks.find(s=>s.id===id&&s.beat==='ultimate').events.length>=29,'mythic ultimates have their own elaborate climax score');
console.log(`Variant audio v36 PASS: ${checks} checks / sixteen native WAVs, fixed runtime cues, decoded levels, musical layers and signal integrity.`);
