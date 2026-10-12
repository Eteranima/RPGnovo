import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {decodeNative,inspectNative} from './items-and-fx/inspect-native.mjs';

const directory=path.dirname(fileURLToPath(import.meta.url));
const workspace=path.resolve(directory,'../../..');
const publicRoot=path.join(workspace,'public/assets/v39/autochess');
const artRegistry=path.join(workspace,'lib/art/autoChessArtV39.ts');
const expected=['seiji','ophelia','max','gabriel','marin','ava','carmilla','beatriz','abel','orfeu','seiji-last-script','ophelia-white-equinox','marin-starless-throne','gabriel-solar-oath','max-thunder-requiem','ava-worldroot-sovereign','beatriz-eclipse-tide','orfeu-unwritten-archon'];
const readJSON=file=>JSON.parse(fs.readFileSync(path.join(directory,file),'utf8'));
const inspectOnly=process.argv.includes('--inspect-only');
const inputIndex=process.argv.indexOf('--input');
if(inputIndex>=0&&!inspectOnly)throw Error('Candidate input is allowed only for inspection; final registration uses18-ready-human.json');
const input=inputIndex>=0?process.argv[inputIndex+1]:'18-ready-human.json';
if(!input)throw Error('Missing input filename');
const choices=readJSON(input);
const manualBodies=readJSON('manual-body-measurements.json');
const sorted=values=>values.toSorted();
const median=values=>{const v=values.toSorted((a,b)=>a-b),i=Math.floor(v.length/2);return v.length%2?v[i]:(v[i-1]+v[i])/2;};
let checks=0;const check=(value,message)=>{if(!value)throw Error(message);checks++;};
check(Array.isArray(choices)&&choices.every(choice=>expected.includes(choice.id))&&new Set(choices.map(choice=>choice.id)).size===choices.length,'Known unique human/base/event IDs are required');
if(!inspectOnly)check(JSON.stringify(sorted(choices.map(choice=>choice.id)))===JSON.stringify(sorted(expected)),'Exactly18 approved human/base/event source selections are required');

function chooseCuts(decoded){
 const {width,height,pixels}=decoded,alpha=(x,y)=>pixels[(y*width+x)*4+3];
 const seam=(axis,target,radius,from=0,until=axis==='x'?height:width)=>{const size=axis==='x'?width:height;let best=target,bestScore=Infinity,strongAlpha=0;for(let position=Math.max(2,target-radius);position<=Math.min(size-3,target+radius);position++){let score=0;for(let offset=-2;offset<=2;offset++)for(let j=from;j<until;j++){const value=axis==='x'?alpha(position+offset,j):alpha(j,position+offset);if(value>=16)score+=value;}const ranked=score+Math.abs(position-target)*.001;if(ranked<bestScore){bestScore=ranked;best=position;strongAlpha=score;}}return {position:best,strongAlpha};};
 const y=[1,2].map(i=>seam('y',Math.round(height*i/3),Math.floor(height/3*.18)));
 const rows=[0,...y.map(cut=>cut.position),height];
 const x=Array.from({length:3},(_,row)=>[1,2,3].map(i=>seam('x',Math.round(width*i/4),Math.floor(width/4*.18),rows[row],rows[row+1])));
 return {x,y,rows,columns:x.map(row=>[0,...row.map(cut=>cut.position),width])};
}

function measureBody(decoded,inspection,choice){
 const {width,pixels}=decoded,heads=[],feet=[],footRegions=[];
 for(let index=0;index<12;index++){
  const [x,y,w,h]=inspection.cells[index].crop;
  let footY=-1;
  // Boots/soles have a dark outline. Restrict to lower body and reject low-alpha magic.
  for(let py=Math.floor(y+h*.52);py<y+h;py++)for(let px=Math.ceil(x+w*.12);px<Math.floor(x+w*.88);px++){
   const at=(py*width+px)*4,alpha=pixels[at+3];
   if(alpha>=100&&Math.max(pixels[at],pixels[at+1],pixels[at+2])<170)footY=Math.max(footY,py);
  }
  if(footY<0&&!choice.anchors?.[index])throw Error(choice.id+': supply visually measured ground anchor for frame'+index);
  const frequencies=[];
  for(let px=Math.ceil(x+w*.1);px<Math.floor(x+w*.9);px++){let n=0;for(let py=Math.max(y,footY-Math.max(14,Math.round(h*.045)));py<=footY;py++){const at=(py*width+px)*4;if(pixels[at+3]>=100&&Math.max(pixels[at],pixels[at+1],pixels[at+2])<170)n++;}frequencies.push({x:px,n});}
  const groups=[];let group=[];
  for(const sample of frequencies){if(sample.n>=2)group.push(sample.x);else if(group.length){if(group.length>=Math.max(4,Math.round(w*.02)))groups.push(group);group=[];}}
  if(group.length>=Math.max(4,Math.round(w*.02)))groups.push(group);
  // Thin staff shafts and isolated sparks do not set a foot center.
  const likely=groups.toSorted((a,b)=>b.length-a.length).slice(0,2).flat();
  const anchor=choice.anchors?.[index]||[likely.length?(Math.min(...likely)+Math.max(...likely))/2:x+w/2,footY];
  check(anchor[0]>=x&&anchor[0]<x+w&&anchor[1]>=y&&anchor[1]<y+h,choice.id+': ground anchor outside its frame');
  feet.push(anchor);footRegions.push({index,region:[x+w*.1,Math.max(y,footY-Math.max(14,Math.round(h*.045))),w*.8,Math.max(14,Math.round(h*.045))+1],manual:!!choice.anchors?.[index]});
  if(index<4){let headTop=Infinity;
   // Upper central body excludes off-center staff tips, brushes and raised hands.
   for(let py=y;py<y+h*.7;py++)for(let px=Math.ceil(x+w*.34);px<Math.floor(x+w*.66);px++)if(pixels[(py*width+px)*4+3]>=128)headTop=Math.min(headTop,py);
   const selectedHead=choice.headTop?.[index]??headTop;
   check(Number.isFinite(selectedHead)&&selectedHead>=y&&selectedHead<anchor[1],choice.id+': invalid head-to-ground measurement');
   heads.push({index,headTop:selectedHead,ground:anchor[1],height:anchor[1]-selectedHead,manual:choice.headTop?.[index]!==undefined,excludedAbove:Math.max(0,selectedHead-inspection.cells[index].visibleBounds[1])});
  }
 }
 const bodyHeight=choice.bodyHeight??median(heads.map(head=>head.height));
 check(Number.isFinite(bodyHeight)&&bodyHeight>30,choice.id+': invalid bodyHeight');
 return {feet,heads,footRegions,bodyHeight};
}

const humanRecords=[],pieces={},failures=[];
for(const choice of choices){
 const decoded=decodeNative(choice.source),cuts=chooseCuts(decoded);
 const manualBody=manualBodies[choice.id];
 if(manualBody)check(decoded.sha256===manualBody.sha256,choice.id+': recheck visually measured head tops after a source change');
 const inspection=inspectNative(choice.source,4,3,choice.rowCuts||cuts.rows,choice.columnCuts||cuts.columns);
 const problems=[];
 if(!inspection.alpha.zero)problems.push('no fully transparent pixels');
 if(inspection.cells.some(cell=>!cell.visiblePixels))problems.push('empty source frame');
 if(new Set(inspection.cells.map(cell=>cell.pixelHash)).size!==12)problems.push('duplicate native frame pixels');
 if(inspection.cells.some(cell=>cell.edgePixels))problems.push('visible art on a measured crop boundary');
 const measured=measureBody(decoded,inspection,manualBody?{...choice,headTop:manualBody.headTop}:choice);
 const frames=inspection.cells.map((cell,index)=>{const[x,y,w,h]=cell.crop,[anchorX,anchorY]=measured.feet[index];return{x,y,w,h,anchorX,anchorY};});
 const src='/assets/v39/autochess/pieces/'+choice.id+'.png';
 pieces[choice.id]={src,sheetWidth:inspection.width,sheetHeight:inspection.height,bodyHeight:measured.bodyHeight,idle:frames.slice(0,4),attack:frames.slice(4,8),cast:frames.slice(8,12)};
 const record={...inspection,path:src,id:choice.id,generatedSource:choice.source,prompt:choice.prompt,generationPrompt:choice.generationPrompt,previousRepairPrompt:choice.previousRepairPrompt,cutSelection:cuts,frames,bodyMeasurement:measured,manualBodyMeasurement:manualBody,problems,nativeBytesPreserved:true};
 humanRecords.push(record);if(problems.length)failures.push({id:choice.id,problems,edges:inspection.cells.map(cell=>cell.edgePixels)});
}
fs.writeFileSync(path.join(directory,'registration-inspection.json'),JSON.stringify({date:'2026-10-12',humanRecords,failures},null,2)+'\n');
console.log(JSON.stringify({humans:humanRecords.map(entry=>({id:entry.id,width:entry.width,height:entry.height,bodyHeight:entry.bodyMeasurement.bodyHeight,headTops:entry.bodyMeasurement.heads.map(head=>head.headTop),groundY:entry.bodyMeasurement.feet.map(foot=>foot[1]),excludedAboveHead:entry.bodyMeasurement.heads.map(head=>head.excludedAbove),boundaryAlphaMax:Math.max(...entry.cells.map(cell=>cell.edgeMaxAlpha)),problems:entry.problems})),failures},null,2));
if(inspectOnly){if(failures.length)process.exitCode=2;}else{
 check(failures.length===0,'Native artwork must pass separation/transparency/distinct-frame gates before registration');
 for(const choice of choices){const bytes=fs.readFileSync(choice.source),source=path.join(directory,'pieces',choice.id+'.png'),destination=path.join(publicRoot,'pieces',choice.id+'.png');for(const target of[source,destination]){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}check(bytes.equals(fs.readFileSync(source))&&bytes.equals(fs.readFileSync(destination)),choice.id+': native source/public differ');}
 const companionRegistry=readJSON('companions/registry-companion.json'),companionManifest=readJSON('companions/manifest.json');
 const companionHeights={shin:254.5,mika:258.5,umbra:264.5,vajra:249,dante:239.5};
 for(const[id,entry]of Object.entries(companionRegistry)){const source=path.join(workspace,'public',entry.src),bytes=fs.readFileSync(source),stored=companionManifest.entries.find(asset=>asset.path===entry.src);check(stored&&crypto.createHash('sha256').update(bytes).digest('hex')===stored.sha256,id+': companion bytes changed');pieces[id]={...entry,bodyHeight:companionHeights[id]};}
 check(Object.keys(pieces).length===23,'Registry must contain23 actual native pieces');
 const shared=readJSON('items-and-fx/registry.json');
 check(Object.keys(shared.items).length===20&&Object.keys(shared.effects).length===3,'Registry needs20items/3effects');
 for(const[name,entry]of Object.entries(shared.effects))check(entry.frames.length===24,name+': effect needs24 native frames');
 const scenes=readJSON('selections.json');check(scenes.length===4&&scenes.filter(scene=>scene.kind==='board').length===3,'Need3boards+one splash');
 const sceneRecords=[];
 for(const scene of scenes){const bytes=fs.readFileSync(scene.source),relative=scene.kind==='board'?'boards/'+scene.id+'.png':'splash.png';const source=path.join(directory,relative),destination=path.join(publicRoot,relative);for(const target of[source,destination]){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}check(bytes.equals(fs.readFileSync(source))&&bytes.equals(fs.readFileSync(destination)),scene.id+': scene native bytes changed');sceneRecords.push({...scene,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:crypto.createHash('sha256').update(bytes).digest('hex'),path:'/assets/v39/autochess/'+relative,nativeBytesPreserved:true});}
 const original=fs.readFileSync(artRegistry,'utf8'),marker='export const AUTO_CHESS_PIECE_ART_V39';
 check(original.includes(marker),'Preserve existing registry header/boards/splash');
 let header=original.slice(0,original.indexOf(marker));
 header=header.replace(/export type AutoChessPieceArtV39=\{([^}]*)\};/,(_,fields)=>'export type AutoChessPieceArtV39={'+fields+(fields.includes('bodyHeight')?'':';bodyHeight?:number')+'};');
 const final=header+'export const AUTO_CHESS_PIECE_ART_V39:Record<string,AutoChessPieceArtV39>='+JSON.stringify(pieces,null,2)+';\nexport const AUTO_CHESS_EFFECT_ART_V39:Record<string,AutoChessSheetArtV39>='+JSON.stringify(shared.effects,null,2)+';\nexport const AUTO_CHESS_ITEM_ART_V39:Record<string,AutoChessItemArtV39>='+JSON.stringify(shared.items,null,2)+';\n';
 fs.writeFileSync(artRegistry,final);
 fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify({generator:'built-in image_gen',date:'2026-10-12',checks,pieces:humanRecords,companions:companionManifest.entries,itemsAndEffectsManifest:'items-and-fx/manifest.json',scenes:sceneRecords,registry:'lib/art/autoChessArtV39.ts',nativeBytesPreserved:true,pixelEditingPerformed:false},null,2)+'\n');
 console.log(JSON.stringify({registered:true,checks,pieces:Object.keys(pieces).length,items:Object.keys(shared.items).length,effects:Object.keys(shared.effects).length,nativePieceFrames:Object.values(pieces).reduce((sum,entry)=>sum+entry.idle.length+entry.attack.length+entry.cast.length,0),nativeEffectFrames:Object.values(shared.effects).reduce((sum,entry)=>sum+entry.frames.length,0),registry:artRegistry},null,2));
}
