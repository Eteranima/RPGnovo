import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeNative,inspectNative} from '../../v39/autochess/items-and-fx/inspect-native.mjs';

const directory=path.dirname(fileURLToPath(import.meta.url));
const workspace=path.resolve(directory,'../../..');
const inspectOnly=process.argv.includes('--inspect-only');
const partial=process.argv.includes('--register-partial');
const inputIndex=process.argv.indexOf('--input');
if(inputIndex>=0&&!inspectOnly&&!partial)throw Error('Candidate selections are allowed only during inspection or staged registration');
const input=inputIndex>=0?process.argv[inputIndex+1]:'selections.json';
if(!input)throw Error('Missing selections filename');
const choices=JSON.parse(fs.readFileSync(path.join(directory,input),'utf8'));
const briefs=JSON.parse(fs.readFileSync(path.join(directory,'briefs.json'),'utf8'));
const manualAnchorsPath=path.join(directory,'manual-anchor-measurements.json');
const manualAnchors=fs.existsSync(manualAnchorsPath)?JSON.parse(fs.readFileSync(manualAnchorsPath,'utf8')):{};
const expected=briefs.map(brief=>brief.id);
let checks=0;
const check=(value,message)=>{if(!value)throw Error(message);checks++;};
check(briefs.length===8&&new Set(expected).size===8,'Eight distinct canonical expansion briefs are required');
check(Array.isArray(choices)&&choices.every(choice=>expected.includes(choice.id))&&new Set(choices.map(choice=>choice.id)).size===choices.length,'Selections must have unique canonical expansion IDs');
if(!inspectOnly&&!partial)check(JSON.stringify(choices.map(choice=>choice.id).sort())===JSON.stringify(expected.toSorted()),'Final registration requires all eight selected sprites');
const median=values=>{const sorted=values.toSorted((a,b)=>a-b),middle=Math.floor(sorted.length/2);return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;};

function chooseCuts(decoded){
 const{width,height,pixels}=decoded,alpha=(x,y)=>pixels[(y*width+x)*4+3];
 const seam=(axis,target,radius,from=0,until=axis==='x'?height:width)=>{
  const size=axis==='x'?width:height;let best=target,bestScore=Infinity,strongAlpha=0;
  for(let position=Math.max(2,target-radius);position<=Math.min(size-3,target+radius);position++){
   let score=0;for(let offset=-2;offset<=2;offset++)for(let index=from;index<until;index++){const value=axis==='x'?alpha(position+offset,index):alpha(index,position+offset);if(value>=16)score+=value;}
   const ranked=score+Math.abs(position-target)*.001;if(ranked<bestScore){bestScore=ranked;best=position;strongAlpha=score;}
  }
  return{position:best,strongAlpha};
 };
 const y=[1,2].map(index=>seam('y',Math.round(height*index/3),Math.floor(height/3*.18)));
 const rows=[0,...y.map(cut=>cut.position),height];
 const x=Array.from({length:3},(_,row)=>[1,2,3].map(index=>seam('x',Math.round(width*index/4),Math.floor(width/4*.18),rows[row],rows[row+1])));
 return{x,y,rows,columns:x.map(row=>[0,...row.map(cut=>cut.position),width])};
}
function measureBody(decoded,inspection,choice){
 const{width,pixels}=decoded,feet=[],heads=[];
 for(let index=0;index<12;index++){
  const[x,y,w,h]=inspection.cells[index].crop;let footY=-1;
  for(let py=Math.floor(y+h*.52);py<y+h;py++)for(let px=Math.ceil(x+w*.12);px<Math.floor(x+w*.88);px++){
   const at=(py*width+px)*4;if(pixels[at+3]>=100&&Math.max(pixels[at],pixels[at+1],pixels[at+2])<170)footY=Math.max(footY,py);
  }
  if(footY<0&&!choice.anchors?.[index])throw Error(choice.id+': visually measured ground anchor required for frame '+index);
  const frequencies=[];
  for(let px=Math.ceil(x+w*.1);px<Math.floor(x+w*.9);px++){
   let count=0;for(let py=Math.max(y,footY-Math.max(14,Math.round(h*.045)));py<=footY;py++){const at=(py*width+px)*4;if(pixels[at+3]>=100&&Math.max(pixels[at],pixels[at+1],pixels[at+2])<170)count++;}
   frequencies.push({x:px,count});
  }
  const groups=[];let group=[];
  for(const sample of frequencies){if(sample.count>=2)group.push(sample.x);else if(group.length){if(group.length>=Math.max(4,Math.round(w*.02)))groups.push(group);group=[];}}
  if(group.length>=Math.max(4,Math.round(w*.02)))groups.push(group);
  const likely=groups.toSorted((a,b)=>b.length-a.length).slice(0,2).flat();
  const anchor=choice.anchors?.[index]||[likely.length?(Math.min(...likely)+Math.max(...likely))/2:x+w/2,footY];
  check(anchor[0]>=x&&anchor[0]<x+w&&anchor[1]>=y&&anchor[1]<y+h,choice.id+': ground anchor outside frame '+index);feet.push(anchor);
  if(index<4){
   let headTop=Infinity;
   for(let py=y;py<y+h*.7;py++)for(let px=Math.ceil(x+w*.34);px<Math.floor(x+w*.66);px++)if(pixels[(py*width+px)*4+3]>=128)headTop=Math.min(headTop,py);
   const selectedHead=choice.headTop?.[index]??headTop;
   check(Number.isFinite(selectedHead)&&selectedHead>=y&&selectedHead<anchor[1],choice.id+': invalid idle body height');
   heads.push({index,headTop:selectedHead,ground:anchor[1],height:anchor[1]-selectedHead,manual:choice.headTop?.[index]!==undefined});
  }
 }
 const bodyHeight=choice.bodyHeight??median(heads.map(head=>head.height));
 check(Number.isFinite(bodyHeight)&&bodyHeight>30,choice.id+': invalid body height');
 return{feet,heads,bodyHeight,manualAnchors:!!choice.anchors};
}

const records=[],pieces={},portraits={},failures=[];
for(const choice of choices){
 const decoded=decodeNative(choice.source),cuts=chooseCuts(decoded);
 if(manualAnchors[choice.id])check(decoded.sha256===manualAnchors[choice.id].sha256,choice.id+': recheck visually measured anchors after source changes');
 const inspection=inspectNative(choice.source,4,3,choice.rowCuts||cuts.rows,choice.columnCuts||cuts.columns),problems=[];
 if(!inspection.alpha.zero)problems.push('no fully transparent pixels');
 if(inspection.cells.some(cell=>!cell.visiblePixels))problems.push('empty source frame');
 if(new Set(inspection.cells.map(cell=>cell.pixelHash)).size!==12)problems.push('duplicate native frame pixels');
 if(inspection.cells.some(cell=>cell.edgePixels))problems.push('visible art on a measured crop boundary');
 const measured=measureBody(decoded,inspection,choice);
 const frames=inspection.cells.map((cell,index)=>{const[x,y,w,h]=cell.crop,[anchorX,anchorY]=measured.feet[index];return{x,y,w,h,anchorX,anchorY};});
 const src='/assets/v40/autochess/pieces/'+choice.id+'.png';
 if(!inspectOnly)check(choice.facing==='left'||choice.facing==='right',choice.id+': source direction must be visually confirmed');
 pieces[choice.id]={src,sheetWidth:inspection.width,sheetHeight:inspection.height,bodyHeight:measured.bodyHeight,facing:choice.facing,idle:frames.slice(0,4),attack:frames.slice(4,8),cast:frames.slice(8,12)};
 if(choice.portrait){
  const{x,y,w,h}=choice.portrait;
  check([x,y,w,h].every(Number.isFinite)&&x>=frames[0].x&&y>=frames[0].y&&w>0&&h>0&&x+w<=frames[0].x+frames[0].w&&y+h<=frames[0].y+frames[0].h,choice.id+': portrait must be measured inside idle frame zero');
  portraits[choice.id]={src,sheetWidth:inspection.width,sheetHeight:inspection.height,crop:{x,y,w,h,anchorX:x+w/2,anchorY:y+h/2}};
 }
 const record={...inspection,path:src,id:choice.id,brief:briefs.find(brief=>brief.id===choice.id),generatedSource:choice.source,prompt:choice.prompt,referencePaths:choice.referencePaths,previousPrompts:choice.previousPrompts||[],portrait:choice.portrait,facing:choice.facing,cutSelection:cuts,frames,bodyMeasurement:measured,problems,nativeBytesPreserved:true};
 records.push(record);if(problems.length)failures.push({id:choice.id,problems,edges:inspection.cells.map(cell=>cell.edgePixels)});
}
fs.writeFileSync(path.join(directory,'registration-inspection.json'),JSON.stringify({date:'2026-10-12',records,failures},null,2)+'\n');
console.log(JSON.stringify({pieces:records.map(record=>({id:record.id,width:record.width,height:record.height,bodyHeight:record.bodyMeasurement.bodyHeight,groundAnchors:record.bodyMeasurement.feet,boundaryAlphaMax:Math.max(...record.cells.map(cell=>cell.edgeMaxAlpha)),problems:record.problems})),failures},null,2));
if(inspectOnly){if(failures.length)process.exitCode=2;}else{
 check(failures.length===0,'Native sprite separation, transparency and distinct-frame checks must pass before registration');
 check(Object.keys(portraits).length===choices.length,'All selected pieces need visually measured portrait crops from native idle frame zero');
 for(const choice of choices){
  const bytes=fs.readFileSync(choice.source),archive=path.join(directory,'pieces',choice.id+'.png'),destination=path.join(workspace,'public/assets/v40/autochess/pieces',choice.id+'.png');
  for(const target of[archive,destination]){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
  check(bytes.equals(fs.readFileSync(archive))&&bytes.equals(fs.readFileSync(destination)),choice.id+': native bytes were changed');
 }
 const registry=path.join(workspace,'lib/art/autoChessArtV40.ts');
 fs.writeFileSync(registry,"import type {AutoChessItemArtV39,AutoChessPieceArtV39} from './autoChessArtV39';\n\nexport type AutoChessPieceArtV40=AutoChessPieceArtV39&{facing?:'left'|'right'};\n// Eight canonical characters and creatures; measured native RGBA source cells.\nexport const AUTO_CHESS_PIECE_ART_V40:Record<string,AutoChessPieceArtV40>="+JSON.stringify(pieces,null,2)+';\nexport const AUTO_CHESS_PORTRAIT_ART_V40:Record<string,AutoChessItemArtV39>='+JSON.stringify(portraits,null,2)+';\n');
 fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify({generator:'built-in image_gen',date:'2026-10-12',complete:!partial,checks,pieces:records,preparatoryReferences:'references.json',manualAnchors:'manual-anchor-measurements.json',registry:'lib/art/autoChessArtV40.ts',nativeBytesPreserved:true,pixelEditingPerformed:false},null,2)+'\n');
 console.log(JSON.stringify({registered:true,checks,pieces:Object.keys(pieces).length,nativePieceFrames:records.length*12,registry},null,2));
}
