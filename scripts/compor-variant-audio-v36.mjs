// Original, deterministic material synthesis and musical scores. No external samples.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..'),SR=48000,TAU=Math.PI*2;
const OUTPUT=resolve(ROOT,'public/assets/v36/audio'),DOCS=resolve(ROOT,'docs/qa-v36/audio');
const midi=n=>440*2**((n-69)/12), db=x=>20*Math.log10(Math.max(1e-12,x));
const seedFor=text=>{let value=2166136261;for(const c of text)value=Math.imul(value^c.charCodeAt(0),16777619);return value>>>0;};
function random(seed){let state=seed||1;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296*2-1;};}
const fade=(t,duration,attack=.004,release=.055)=>Math.min(1,t/attack)*Math.min(1,Math.max(0,(duration-t)/release));

export const SCORES_V36=[
 {id:'seiji-last-script',hero:'Seiji',material:'papel, tinta líquida, madeira e cordas de códice',motif:[62,69,65,72,74],cast:1.95,ultimate:3.45,kind:'ink'},
 {id:'ophelia-white-equinox',hero:'Ophelia',material:'cristal, sinos de gelo, geada e flor de cura',motif:[76,83,80,87,88],cast:2.15,ultimate:3.70,kind:'ice'},
 {id:'marin-starless-throne',hero:'Marin',material:'leque, tecido, ar sem voz e cordas de sombra',motif:[50,57,53,60,61],cast:1.90,ultimate:3.40,kind:'shadow'},
 {id:'gabriel-solar-oath',hero:'Gabriel',material:'forja, metal quente, brasa e harmonia solar',motif:[57,64,69,73,76],cast:2.05,ultimate:3.65,kind:'solar'},
 {id:'max-thunder-requiem',hero:'Max',material:'corrente, pregos, arcos e cordas metálicas',motif:[66,73,70,78,82],cast:1.75,ultimate:3.30,kind:'electric'},
 {id:'ava-worldroot-sovereign',hero:'Ava',material:'rocha profunda, estratos, seiva e cristais',motif:[43,50,55,59,62],cast:2.30,ultimate:3.95,kind:'earth',legendary:true},
 {id:'beatriz-eclipse-tide',hero:'Beatriz',material:'marés escuras, gotas, lâmina e ressonância abissal',motif:[58,65,61,68,70],cast:2.25,ultimate:3.90,kind:'tide',legendary:true},
 {id:'orfeu-unwritten-archon',hero:'Orfeu',material:'impacto físico seco, couro, tambor e vácuo',motif:[38,45,50,52,57],cast:1.80,ultimate:3.80,kind:'null',legendary:true},
];

function compose(score,beat){
 const duration=score[beat],length=Math.round(duration*SR),left=new Float64Array(length),right=new Float64Array(length);
 const rng=random(seedFor(`${score.id}/${beat}/original-v36`)),events=[];
 function layer(label,start,span,gain,pan,signal,details={}){
  events.push({label,startSeconds:start,durationSeconds:span,gain,pan:typeof pan==='function'?'slow stereo gesture':pan,...details});
  const offset=Math.round(start*SR),count=Math.min(length-offset,Math.round(span*SR));
  for(let i=0;i<count;i++){const t=i/SR,sample=signal(t,i)*gain,position=typeof pan==='function'?pan(t/span):pan,angle=(Math.max(-.86,Math.min(.86,position))+1)*Math.PI/4;left[offset+i]+=sample*Math.cos(angle);right[offset+i]+=sample*Math.sin(angle);}
 }
 function noise(label,start,span,gain,pan,low,high,decay=span*.35,flutter=0){
  let lowState=0,highState=0;const lo=1-Math.exp(-TAU*low/SR),hi=1-Math.exp(-TAU*high/SR);
  layer(label,start,span,gain,pan,t=>{const n=rng();lowState+=lo*(n-lowState);const hp=n-lowState;highState+=hi*(hp-highState);return highState*Math.exp(-t/decay)*fade(t,span,.002,.035)*(flutter?.72+.28*Math.sin(TAU*flutter*t)**2:1);},{type:'band-shaped aperiodic texture',bandHz:[low,high],decaySeconds:decay,flutterHz:flutter});
 }
 function modal(label,start,span,freq,gain,pan,ratios,decay=.8){
  const phases=ratios.map(()=>rng()*.06),strengths=ratios.map((_,i)=>1/(1+i*1.15));
  layer(label,start,span,gain,pan,t=>{let value=0;for(let i=0;i<ratios.length;i++){const damping=decay/(1+i*.37),vibrato=1+.0008*Math.sin(TAU*(3.8+i*.23)*t);value+=strengths[i]*Math.sin(TAU*freq*ratios[i]*t*vibrato+phases[i])*Math.exp(-t/damping);}return value*fade(t,span,.0018,.06);},{type:'inharmonic material resonator',fundamentalHz:freq,ratios,decaySeconds:decay});
 }
 function drum(label,start,span,freq,gain,pan,drop=2.2){
  let phase=0;layer(label,start,span,gain,pan,t=>{phase+=TAU*(freq+(freq*drop)*Math.exp(-t/.022))/SR;return(Math.sin(phase)+.18*Math.sin(phase*2.81))*Math.exp(-t/(span*.22))*fade(t,span,.0018,.045);},{type:'membrane/body impact',fundamentalHz:freq,pitchDropRatio:drop});
 }
 function droplet(label,start,span,freq,gain,pan){
  let phase=0;layer(label,start,span,gain,pan,t=>{phase+=TAU*(freq*(1+.8*Math.exp(-t/.037)))/SR;return(Math.sin(phase)+.28*Math.sin(phase*2.47))*Math.exp(-t/.105)*fade(t,span,.003,.04);},{type:'liquid cavity resonance',fundamentalHz:freq});
 }
 function bowed(label,start,span,freq,gain,pan,dark=false){
  layer(label,start,span,gain,pan,t=>{const vibrato=.012*Math.sin(TAU*4.7*t),phase=TAU*freq*t+vibrato;return(Math.sin(phase)+.33*Math.sin(phase*2.002)+.16*Math.sin(phase*3.01))*(.7+.3*Math.sin(TAU*2.2*t)**2)*Math.exp(-t/(span*(dark?.4:.56)))*fade(t,span,.028,.12);},{type:'bowed musical partials',fundamentalHz:freq});
 }
 const ultimate=beat==='ultimate',scale=ultimate?1.14:1,span=duration;
 // Every score begins with actual contact; long tails never delay the gameplay impact.
 switch(score.kind){
  case'ink':
   drum('capa do códice — golpe de madeira',0,.34,128,.43*scale,0,1.4);noise('páginas e corte de papel',.006,.62,.36,-.18,1200,7300,.19,37);noise('tinta fluida profunda',.012,.9,.30,.12,95,780,.28,11);
   for(let i=0;i<(ultimate?7:4);i++){const at=.06+i*.081;noise(`página ${i+1}`,at,.11,.14,Math.sin(i*1.5)*.5,2200,8600,.028,65);modal(`pincel de madeira ${i+1}`,at,.25,185+i*21,.07,Math.sin(i)*.5,[1,2.38,3.79],.095);}
   break;
  case'ice':
   modal('contato cristalino',0,span*.89,440,.30*scale,0,[1,2.01,2.71,4.13,5.57,7.33],.96);noise('fissura de gelo — sem fogo',.004,.29,.24,-.08,1850,11500,.052);noise('geada aérea',.028,span*.66,.16,t=>-.35+.7*t,600,5800,.55,8);
   for(let i=0;i<(ultimate?7:4);i++)modal(`fragmento de cristal ${i+1}`,.07+i*.085,.9,760+i*137,.075,Math.sin(i*1.2)*.68,[1,2.39,3.77,5.81],.32);
   break;
  case'shadow':
   drum('leque fechado — impacto grave',0,.27,72,.52*scale,.02,1.8);noise('tecido e lâmina de ar sem voz',.004,.74,.37,t=>-.58+1.16*t,470,4200,.24,14);noise('véu de sombra',.018,span*.73,.22,t=>.4-.8*t,140,1550,.68,4.2);
   for(let i=0;i<(ultimate?6:3);i++){const at=.045+i*.095;modal(`nervura do leque ${i+1}`,at,.31,245+i*31,.075,Math.sin(i)*.4,[1,2.71,4.89],.13);}
   break;
  case'solar':
   drum('malho solar — corpo do contato',0,.40,78,.60*scale,0,3);modal('bigorna radiante',.002,span*.75,155,.31,-.06,[1,1.51,2.17,3.72,5.37,7.9],.75);noise('brasa e ar quente',.015,span*.67,.22,t=>-.27+.54*t,240,3600,.57,16);
   for(let i=0;i<(ultimate?8:4);i++)noise(`estalo de forja ${i+1}`,.03+i*.084,.038,.14,Math.sin(i*2)*.45,2300,9900,.006);
   break;
  case'electric':
   drum('corrente aterrada',0,.25,115,.50*scale,0,1.8);modal('pregos de aço — contato',.003,.93,350,.27,-.12,[1,1.74,2.61,4.71,6.93],.35);noise('arco elétrico — textura fraturada',.006,.67,.32,t=>-.4+.8*t,980,7800,.19,88);
   for(let i=0;i<(ultimate?10:5);i++){const at=.025+i*.047;noise(`curto arco ${i+1}`,at,.043,.10,Math.sin(i*2.3)*.52,2600,10500,.012,180);modal(`prego ressonante ${i+1}`,at,.33,530+i*57,.067,Math.sin(i*.8)*.56,[1,2.59,4.81],.12);}
   break;
  case'earth':
   drum('estrato profundo — impacto central',0,.68,46,.75*scale,0,2.5);drum('pedra superior — deslocamento físico',.022,.36,121,.36,-.1,1.5);noise('rocha e cascalho',.005,1.27,.40,t=>-.25+.5*t,80,2400,.36,22);noise('subsolo em ressonância',.018,span*.69,.28,.07,24,430,.72,2.7);
   for(let i=0;i<(ultimate?12:5);i++){const at=.044+i*.055;modal(`lascas minerais ${i+1}`,at,.50,225+i*53,.07,Math.sin(i*1.7)*.57,[1,1.83,3.43,5.67],.22);}
   break;
  case'tide':
   drum('maré abissal — impacto da lâmina',0,.50,58,.61*scale,0,2.6);noise('água sob pressão',.006,1.20,.51,t=>-.58+1.16*t,110,5200,.32,6);noise('rastro de maré escura',.015,span*.77,.24,t=>.4-.8*t,85,1400,.71,2.5);
   for(let i=0;i<(ultimate?14:6);i++)droplet(`gota e cavidade ${i+1}`,.025+i*.061,.47,290+i*71,.11,Math.sin(i*1.35)*.66);
   modal('lâmina entre água e trevas',.018,1.12,216,.18,.12,[1,1.59,2.77,4.91],.40);
   break;
  case'null':
   drum('punho — corpo seco do contato',0,.31,59,.83*scale,0,3.8);noise('couro e ar comprimido',.004,.17,.55,-.05,330,4600,.030);noise('vácuo sem voz — retração',.015,.47,.25,t=>.32-.64*t,80,950,.11,3);
   drum('articulação física',.026,.15,178,.23,.06,1.1);for(let i=0;i<(ultimate?5:2);i++)modal(`ressonância de tambor ${i+1}`,.065+i*.12,.38,103+i*31,.09,Math.sin(i)*.28,[1,1.59,2.31,3.79],.14);
   break;
 }
 // Original five-note motifs, voiced as materials rather than bare sine beeps.
 const noteCount=ultimate?(score.legendary?10:7):4;
 for(let i=0;i<noteCount;i++){
  const note=score.motif[i%score.motif.length]+(i>=score.motif.length?12:0),at=(ultimate?.045:.025)+i*(ultimate?.135:.155),freq=midi(note),pan=Math.sin(i*1.67)*.57;
  if(score.kind==='null')modal(`motivo físico ${i+1}`,at,.66,freq,.125,pan,[1,1.50,2.32,3.88],.24);
  else if(score.kind==='ice'||score.kind==='earth')modal(`motivo de cristal ${i+1}`,at,Math.min(duration-at,.9+(ultimate?.75:0)),freq,.12,pan,[1,2.03,2.73,4.17,6.4],ultimate?.73:.41);
  else if(score.kind==='electric'||score.kind==='ink')modal(`motivo de corda ${i+1}`,at,Math.min(duration-at,1.1),freq,.125,pan,[1,2,3.01,4.02,6.05],.36);
  else bowed(`motivo harmônico ${i+1}`,at,Math.min(duration-at,ultimate?2.15:1.20),freq,.13,pan,score.kind==='shadow'||score.kind==='tide');
 }
 if(ultimate){
  const chord=score.motif.slice(0,4),start=.022;
  for(let i=0;i<chord.length;i++){
   const f=midi(chord[i]-(score.kind==='ice'?12:0)),pan=(i-1.5)*.22;
   if(score.kind==='null')modal(`clímax de percussão ${i+1}`,start,1.4,f,.14,pan,[1,1.54,2.31,3.75],.44);
   else bowed(`clímax ${score.legendary?'mítico':'da ultimate'} ${i+1}`,start,span-.16,f,.135,pan,score.kind==='shadow'||score.kind==='tide');
  }
  if(score.legendary){
   for(let i=0;i<5;i++){
    const at=.24+i*.22,f=midi(score.motif[(i+2)%5]+12);
    if(score.kind==='null')modal(`resposta rítmica física ${i+1}`,at,.76,f/2,.092,Math.sin(i)*.35,[1,1.5,2.25,3.8],.24);
    else modal(`resposta mítica ${i+1}`,at,2.0,f,.093,Math.sin(i*1.9)*.63,score.kind==='earth'?[1,1.83,3.19,5.71]:[1,2.02,3.17,5.33],.82);
   }
   if(score.kind==='earth')noise('raízes e terra — cauda orgânica',.48,span-.53,.14,t=>-.35+.7*t,120,1100,.93,7);
   if(score.kind==='tide')noise('maré final sem segunda explosão',.55,span-.61,.15,t=>.4-.8*t,180,3700,.85,4);
   // Anti-magic has no ethereal pad or glitter: its ending remains percussion/air.
  }
 }
 // Short, quiet reflections provide depth while keeping the direct impact centred.
 const dryL=left.slice(),dryR=right.slice(),reflections=ultimate?[[.031,.105],[.067,.075],[.113,.049],[.173,.025]]:[[.029,.08],[.061,.052]];
 for(const [delay,gain] of reflections){const d=Math.round(delay*SR);for(let i=d;i<length;i++){left[i]+=dryR[i-d]*gain;right[i]+=dryL[i-d]*gain;}}
 events.push({label:'reflexões estéreo curtas',type:'original room response',reflections});
 // DC blocker + mild bus saturation; peak-normalized only after the complete mix.
 for(const buffer of [left,right]){let previousX=0,previousY=0;const pole=Math.exp(-TAU*20/SR);for(let i=0;i<length;i++){const x=buffer[i],y=x-previousX+pole*previousY;previousX=x;previousY=y;buffer[i]=Math.tanh(y*.82);}}
 let meanL=0,meanR=0;for(let i=0;i<length;i++){meanL+=left[i];meanR+=right[i];}meanL/=length;meanR/=length;
 let peak=0;for(let i=0;i<length;i++){const t=i/SR,e=fade(t,duration,.0018,.095);left[i]=(left[i]-meanL)*e;right[i]=(right[i]-meanR)*e;peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));}
 const normalize=(ultimate?.875:.83)/peak;for(let i=0;i<length;i++){left[i]*=normalize;right[i]*=normalize;}
 return{left,right,events,duration};
}

function encodeWav(left,right){
 const samples=left.length,dataBytes=samples*4,buffer=Buffer.alloc(44+dataBytes);buffer.write('RIFF',0);buffer.writeUInt32LE(36+dataBytes,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(SR,24);buffer.writeUInt32LE(SR*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(dataBytes,40);
 for(let i=0;i<samples;i++){buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,left[i]))*32767),44+i*4);buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,right[i]))*32767),46+i*4);}return buffer;
}
export function inspectWav(buffer){
 assert.equal(buffer.toString('ascii',0,4),'RIFF');assert.equal(buffer.toString('ascii',8,12),'WAVE');assert.equal(buffer.readUInt16LE(20),1);const channels=buffer.readUInt16LE(22),rate=buffer.readUInt32LE(24),bits=buffer.readUInt16LE(34),count=buffer.readUInt32LE(40)/4;
 let peak=0,sumL=0,sumR=0,square=0,ll=0,rr=0,lr=0,clip=0,startSquare=0,startCount=0,endPeak=0,maxStep=0,previous=[0,0];
 for(let i=0;i<count;i++){const l=buffer.readInt16LE(44+i*4)/32768,r=buffer.readInt16LE(46+i*4)/32768;peak=Math.max(peak,Math.abs(l),Math.abs(r));sumL+=l;sumR+=r;square+=l*l+r*r;ll+=l*l;rr+=r*r;lr+=l*r;if(Math.abs(l)>=.9999||Math.abs(r)>=.9999)clip++;if(i<rate*.1){startSquare+=l*l+r*r;startCount+=2;}if(i>=count-128)endPeak=Math.max(endPeak,Math.abs(l),Math.abs(r));maxStep=Math.max(maxStep,Math.abs(l-previous[0]),Math.abs(r-previous[1]));previous=[l,r];}
 return{sampleRate:rate,channels,bitsPerSample:bits,frames:count,durationSeconds:count/rate,peakDbfs:db(peak),rmsDbfs:db(Math.sqrt(square/(count*2))),dcLeft:sumL/count,dcRight:sumR/count,stereoCorrelation:lr/Math.sqrt(ll*rr),clippedSamples:clip,first100msRmsDbfs:db(Math.sqrt(startSquare/startCount)),final128SamplesPeakDbfs:db(endPeak),maxSampleStep:maxStep,bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex')};
}
export function signalProfile(buffer){
 const count=buffer.readUInt32LE(40)/4,mono=new Float64Array(count);let onset=-1,active=0;
 for(let i=0;i<count;i++){const l=buffer.readInt16LE(44+i*4)/32768,r=buffer.readInt16LE(46+i*4)/32768;mono[i]=(l+r)*.5;if(Math.max(Math.abs(l),Math.abs(r))>.0316){if(onset<0)onset=i;active++;}}
 const n=4096,bands=[0,0,0,0,0,0],edges=[0,80,250,1000,4000,8000,24000];let weighted=0,power=0;
 for(let window=0;window<24;window++){
  const offset=Math.floor((count-n)*window/23),re=new Float64Array(n),im=new Float64Array(n);
  for(let i=0;i<n;i++)re[i]=mono[offset+i]*(.5-.5*Math.cos(TAU*i/(n-1)));
  for(let i=1,j=0;i<n;i++){let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];}}
  for(let size=2;size<=n;size<<=1){const half=size>>1;for(let start=0;start<n;start+=size)for(let j=0;j<half;j++){const angle=-TAU*j/size,wr=Math.cos(angle),wi=Math.sin(angle),a=start+j,b=a+half,tr=re[b]*wr-im[b]*wi,ti=re[b]*wi+im[b]*wr;re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti;}}
  for(let i=1;i<=n/2;i++){const f=i*SR/n,p=re[i]*re[i]+im[i]*im[i];weighted+=p*f;power+=p;const index=Math.min(5,edges.findIndex((v,j)=>j>0&&f<v)-1);bands[index<0?5:index]+=p;}
 }
 return{audibleOnsetSeconds:onset/SR,aboveMinus30DbfsFraction:active/count,spectralCentroidHz:weighted/power,bands:bands.map((value,i)=>({hz:[edges[i],edges[i+1]],energyPercent:value/power*100})),analysis:'24 Hann windows of 4096 samples over decoded mono mix; not a subjective listening test'};
}
export function analyzeExisting(){
 const reportPath=resolve(DOCS,'measurements.json'),report=JSON.parse(readFileSync(reportPath,'utf8')),runtime=JSON.parse(readFileSync(resolve(ROOT,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
 for(const file of report.files){
  const buffer=readFileSync(resolve(ROOT,file.path)),actual=inspectWav(buffer);assert.equal(actual.sha256,file.sha256);const profile=signalProfile(buffer);
  assert.ok(profile.audibleOnsetSeconds>=0&&profile.audibleOnsetSeconds<.020,'Impact starts within20ms');
  assert.ok(profile.bands[5].energyPercent<8,'Upper hiss remains controlled');
  const run=spawnSync(runtime.ffmpeg,['-hide_banner','-nostdin','-i',resolve(ROOT,file.path),'-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8',maxBuffer:2*1024*1024});assert.equal(run.status,0,'FFmpeg audio decode/loudness analysis');
  const summary=run.stderr.slice(run.stderr.lastIndexOf('Summary:')),integrated=Number(summary.match(/I:\s*([-\d.]+)\s*LUFS/)?.[1]),truePeak=Number(summary.match(/Peak:\s*([-\d.]+)\s*dBFS/)?.[1]);assert.ok(Number.isFinite(integrated)&&Number.isFinite(truePeak));assert.ok(truePeak<=-.5,'Intersample true peak has headroom');
  file.signalProfile=profile;file.ffmpeg={integratedLufs:integrated,truePeakDbtp:truePeak};console.log(`${file.hero} ${file.beat}: ${integrated}LUFS / ${truePeak}dBTP / onset ${(profile.audibleOnsetSeconds*1000).toFixed(2)}ms / >8kHz ${profile.bands[5].energyPercent.toFixed(2)}%`);
 }
 report.listeningReview='not performed: tool reported audio input unsupported; signal analysis and playable files provided';report.signalReview='passed: onset, clipping, DC, tail, stereo coherence, spectrum and independently decoded true peak';report.ffmpegVersion=runtime.versionLine;
 writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');return report;
}
export function generate(){
 mkdirSync(OUTPUT,{recursive:true});mkdirSync(DOCS,{recursive:true});const files=[],scoreSheets=[];
 for(const score of SCORES_V36)for(const beat of ['cast','ultimate']){
  const {left,right,events,duration}=compose(score,beat),wav=encodeWav(left,right),qa=inspectWav(wav),path=`public/assets/v36/audio/${score.id}/${beat}.wav`;
  assert.equal(qa.sampleRate,SR);assert.equal(qa.channels,2);assert.equal(qa.clippedSamples,0);assert.ok(Math.abs(qa.dcLeft)<.001&&Math.abs(qa.dcRight)<.001);assert.ok(qa.peakDbfs<=-1);assert.ok(qa.first100msRmsDbfs>-24);assert.ok(qa.final128SamplesPeakDbfs<-38);assert.ok(qa.stereoCorrelation>.2);assert.ok(qa.rmsDbfs>-26&&qa.rmsDbfs<-10);
  mkdirSync(dirname(resolve(ROOT,path)),{recursive:true});writeFileSync(resolve(ROOT,path),wav);files.push({id:score.id,hero:score.hero,beat,path,...qa});scoreSheets.push({id:score.id,hero:score.hero,beat,material:score.material,legendary:!!score.legendary,motifMidi:score.motif,durationSeconds:duration,events});
  console.log(`${score.hero} ${beat}: ${duration}s / ${qa.peakDbfs.toFixed(2)}dBFS peak / ${qa.rmsDbfs.toFixed(2)}dBFS RMS / ${events.length} layers`);
 }
 writeFileSync(resolve(DOCS,'score.json'),JSON.stringify({format:'original deterministic modal/foley/musical synthesis',externalSamples:false,paidServices:false,sampleRate:SR,tracks:scoreSheets},null,2)+'\n');
 writeFileSync(resolve(DOCS,'measurements.json'),JSON.stringify({format:'PCM16 stereo WAV',sampleRate:SR,files,totalBytes:files.reduce((s,f)=>s+f.bytes,0),listeningReview:'pending',noClippedSamples:files.every(f=>f.clippedSamples===0)},null,2)+'\n');
 return files;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.includes('--analyze'))analyzeExisting();
 else if(process.argv.includes('--verify')){const manifest=JSON.parse(readFileSync(resolve(DOCS,'measurements.json'),'utf8'));for(const file of manifest.files){const actual=inspectWav(readFileSync(resolve(ROOT,file.path)));assert.equal(actual.sha256,file.sha256);assert.equal(actual.frames,file.frames);assert.equal(actual.clippedSamples,0);}console.log('16 native audio files and recorded hashes verified.');}
 else generate();
}
