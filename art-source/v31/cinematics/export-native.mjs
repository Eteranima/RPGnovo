import {readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';

const dir='art-source/v31/cinematics', plans=JSON.parse(readFileSync(`${dir}/storyboards.json`,'utf8')), entries=JSON.parse(readFileSync(`${dir}/selected.json`,'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const captions={
 'long-tinta':['O porto perdeu um nome. A tinta ainda se lembra do caminho.','Entre registros apagados, Shin e Umbra reconstituem a memória de Iria.','A lembrança voltou. Torná-la pública ou protegê-la cabe a você.'],
 'long-geada':['Uma flor conserva o inverno que o jardim não conseguiu esquecer.','Mika cuida das raízes sem apagar o testemunho do gelo.','A memória pode permanecer na flor ou acompanhar as novas sementes.'],
 'long-brasa':['Sob as cinzas, Gabriel encontra uma promessa que ainda respira.','Dante abriga a pequena vida. A chama aquece, e a raiz desperta.','A antiga pira pode acolher um abrigo ou uma oficina livre.'],
 'long-trovao':['O sino calado guarda a mensagem dos antigos sinalizadores.','Max e Vajra religam o astrolábio e libertam o sinal.','Ao amanhecer, a mensagem pode alcançar a cidade ou voltar às famílias.'],
 'long-nulo':['Uma página tenta prescrever os caminhos de quem ainda vive.','Orfeu rompe as amarras. A antimagia devolve silêncio ao papel.','A página está em branco: um destino livre ou um pacto de cuidado.']
};
const avatars={
 'long-tinta':[{name:'Shin',act:1,crop:{left:941,top:477,width:307,height:227}},{name:'Umbra',act:1,crop:{left:548,top:490,width:222,height:209}}],
 'long-geada':[{name:'Mika',act:0,crop:{left:47,top:714,width:291,height:217}}],
 'long-brasa':[{name:'Gabriel',src:'/assets/v29/gabriel/face.png'},{name:'Dante',act:0,crop:{left:1310,top:245,width:279,height:218}}],
 'long-trovao':[{name:'Max',src:'/assets/v29/max/face.png'},{name:'Vajra',act:0,crop:{left:1316,top:252,width:261,height:211}}],
 'long-nulo':[{name:'Orfeu',act:2,crop:{left:897,top:708,width:324,height:231}}]
};
const scenes={}, manifests=[];let checked=0;
for(const plan of plans){
 const atlases=[],frames=[],hashes=[];
 for(let act=0;act<3;act++){
  const e=entries.find(e=>e.id===plan.id&&e.act===act);assert.ok(e,`${plan.id} act ${act} selected`);
  const sourceDir=`${dir}/${plan.id}`,runtimeDir=`public/assets/v31/cinematics/${plan.id}`;mkdirSync(sourceDir,{recursive:true});mkdirSync(runtimeDir,{recursive:true});
  const selected=`${sourceDir}/act-${act+1}-source.png`,runtime=`${runtimeDir}/act-${act+1}.png`;copyFileSync(e.source,selected);copyFileSync(e.source,runtime);writeFileSync(`${sourceDir}/act-${act+1}-prompt.txt`,e.prompt+'\n');
  const {data,info}=await sharp(e.source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height;
  assert.ok(w>=1500&&h>=800,'native cinema resolution');
  let alphaMin=255,alphaMax=0;for(let p=3;p<data.length;p+=4){alphaMin=Math.min(alphaMin,data[p]);alphaMax=Math.max(alphaMax,data[p]);}
  assert.equal(alphaMin,255,'Full-bleed painted scene has opaque interior.');
  const localFrames=[];const cutsX=Array.from({length:5},(_,i)=>Math.round(i*w/4)),cutsY=Array.from({length:5},(_,i)=>Math.round(i*h/4));
  for(let i=0;i<16;i++){
   const col=i%4,row=Math.floor(i/4),x=cutsX[col]+1,y=cutsY[row]+1,cw=cutsX[col+1]-cutsX[col]-2,ch=cutsY[row+1]-cutsY[row]-2,index=act*16+i;
   const frame={atlas:act,x,y,w:cw,h:ch,startMs:index*220,durationMs:220,description:plan.acts[act][i]};
   assert.ok(Math.abs(cw/ch-16/9)<.025,'Native quarter-cell remains 16:9 without resizing');
   const cropped=await sharp(e.source).extract({left:x,top:y,width:cw,height:ch}).ensureAlpha().raw().toBuffer();
   const rgbaSha256=hash(cropped);hashes.push(rgbaSha256);frames.push(frame);localFrames.push({...frame,index,rgbaSha256});checked++;
  }
  const sha=hash(readFileSync(e.source));assert.equal(hash(readFileSync(runtime)),sha,'runtime byte-identical');assert.equal(hash(readFileSync(selected)),sha,'selected source byte-identical');
  const manifest={id:plan.id,act,tool:'built-in image_gen',source:e.source,selected,runtime,width:w,height:h,sourceSha256:sha,runtimeSha256:sha,byteIdentical:true,alphaMin,alphaMax,columns:4,rows:4,cutsX,cutsY,onePixelNativeGutter:true,resized:false,repainted:false,frames:localFrames,visualReview:'16 distinct painted shots; costumes, anatomy, objects and scene chronology reviewed; no baked text.'};
  writeFileSync(`${sourceDir}/act-${act+1}-manifest.json`,JSON.stringify(manifest,null,2)+'\n');manifests.push(manifest);atlases.push({src:runtime.slice(6),width:w,height:h,sha256:sha});
 }
 assert.equal(new Set(hashes).size,48,plan.id+' 48 byte-distinct native frames');
 const actorAvatars=[];
 for(const avatar of avatars[plan.id]){
  if(avatar.src){assert.ok(existsSync('public'+avatar.src));actorAvatars.push({name:avatar.name,src:avatar.src});continue;}
  const e=entries.find(e=>e.id===plan.id&&e.act===avatar.act),runtime=`public/assets/v31/cinematics/${plan.id}/avatar-${avatar.name.toLowerCase()}.png`;
  await sharp(e.source).extract(avatar.crop).png().toFile(runtime);
  const {data,info}=await sharp(e.source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),raw=await sharp(runtime).ensureAlpha().raw().toBuffer(),c=avatar.crop;
  for(let y=0;y<c.height;y++)assert.ok(raw.subarray(y*c.width*4,(y+1)*c.width*4).equals(data.subarray(((c.top+y)*info.width+c.left)*4,((c.top+y)*info.width+c.left+c.width)*4)),'Avatar preserves every native RGBA byte');
  actorAvatars.push({name:avatar.name,src:runtime.slice(6)});writeFileSync(`${dir}/${plan.id}/avatar-${avatar.name.toLowerCase()}-manifest.json`,JSON.stringify({source:e.source,sourceSha256:hash(readFileSync(e.source)),runtime,crop:c,allRgbaBytesPreserved:true,runtimeSha256:hash(readFileSync(runtime))},null,2)+'\n');
 }
 scenes[plan.id]={id:plan.id,title:plan.title,actors:plan.actors,avatars:actorAvatars,atlases,frames,durationMs:10560,captions:captions[plan.id].map((text,i)=>({startFrame:i*16,text})),thumbnail:{src:atlases[0].src,...frames[0]}};
}
assert.equal(new Set(manifests.flatMap(m=>m.frames.map(f=>f.rgbaSha256))).size,240,'All five films have 240 distinct native frame byte arrays');
mkdirSync('lib/art',{recursive:true});
const library=`/** Five native 48-shot films. Atlas loading is exclusively local to QuestCinematic. Generated registry: art-source/v31/cinematics/export-native.mjs. */
export type QuestCinematicId = 'long-tinta'|'long-geada'|'long-brasa'|'long-trovao'|'long-nulo';
export type SceneAct = 0|1|2;
export type QuestCinemaFrame = {atlas:number;x:number;y:number;w:number;h:number;startMs:number;durationMs:number;description:string};
export type QuestCinemaScene = {id:QuestCinematicId;title:string;actors:string[];avatars:{name:string;src:string}[];atlases:{src:string;width:number;height:number;sha256:string}[];frames:QuestCinemaFrame[];durationMs:number;captions:{startFrame:number;text:string}[];thumbnail:QuestCinemaFrame&{src:string}};
export const QUEST_CINEMATICS_V31:Record<QuestCinematicId,QuestCinemaScene> = ${JSON.stringify(scenes,null,2)};
export function getQuestCinematic(id:string):QuestCinemaScene|undefined{return Object.prototype.hasOwnProperty.call(QUEST_CINEMATICS_V31,id)?QUEST_CINEMATICS_V31[id as QuestCinematicId]:undefined;}
export function cinematicRange(scene:QuestCinemaScene,act?:SceneAct){const start=act===undefined?0:act*16,end=act===undefined?scene.frames.length:start+16;return{start,end,durationMs:scene.frames.slice(start,end).reduce((sum,f)=>sum+f.durationMs,0)};}
export function cinematicFrameAt(scene:QuestCinemaScene,elapsedMs:number,act?:SceneAct){const range=cinematicRange(scene,act),elapsed=Math.max(0,Number.isFinite(elapsedMs)?elapsedMs:0);let consumed=0;for(let i=range.start;i<range.end;i++){consumed+=scene.frames[i].durationMs;if(elapsed<consumed)return i;}return range.end-1;}
export function cinematicPlaybackStep(elapsedMs:number,deltaMs:number,durationMs:number,paused:boolean,hidden:boolean){const elapsed=Math.max(0,elapsedMs),delta=paused||hidden?0:Math.max(0,Number.isFinite(deltaMs)?deltaMs:0),nextBoundary=(Math.floor(elapsed/220)+1)*220,next=Math.min(durationMs,elapsed+delta,nextBoundary);return{elapsedMs:next,finished:next>=durationMs};}
export function cinematicTabTarget(eventType:string,shift:boolean,current:number,count:number):number|null{if(eventType!=='keydown'||count<1)return null;if(current<0)return shift?count-1:0;if(shift&&current===0)return count-1;if(!shift&&current===count-1)return 0;return null;}
`;
writeFileSync('lib/art/questCinematicsV31.ts',library);
writeFileSync(`${dir}/registry-manifest.json`,JSON.stringify({tool:'built-in image_gen',films:5,frames:240,distinctNativeRgbaFrames:240,frameDurationMs:220,durationMs:10560,loading:'only current mission atlas URLs',resized:false,repainted:false,atlases:manifests.map(({frames,...m})=>m)},null,2)+'\n');
console.log(JSON.stringify({films:5,nativeFrames:checked,atlases:manifests.length,distinctNativeFrames:240,exports:'lib/art/questCinematicsV31.ts'}));
