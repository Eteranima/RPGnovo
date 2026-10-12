import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const directory=path.dirname(fileURLToPath(import.meta.url)),workspace=path.resolve(directory,'../../../..'),publicDirectory=path.join(workspace,'public/assets/v41/autochess/ui');
const choices=JSON.parse(fs.readFileSync(path.join(directory,'selections.json'),'utf8'));
const inspection=JSON.parse(fs.readFileSync(path.join(directory,'inspection.json'),'utf8'));
let checks=0;const check=(value,message)=>{if(!value)throw Error(message);checks++;};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
check(JSON.stringify(choices.map(choice=>choice.id).sort())===JSON.stringify(['active','buttons','panel','shop']),'Four final native UI sources are required');
check(choices.every(choice=>choice.renderStyle==='stylized-3d'),'The official UI sources must use the requested volumetric 3D rendering');
fs.mkdirSync(publicDirectory,{recursive:true});
const entries={},native=[];
for(const choice of choices){
 const record=inspection.records.find(record=>record.id===choice.id),bytes=fs.readFileSync(choice.source);
 check(record&&hash(bytes)===record.sha256,choice.id+': inspect the exact selected native bytes before registration');
 check(record.alpha.zero>0&&record.frames.every(frame=>frame.visiblePixels>0&&frame.edgePixels===0),choice.id+': true transparency and isolated complete frames');
 check(record.frames.length===(choice.id==='buttons'?2:1),choice.id+': correct number of frames');
 for(const frame of record.frames){
  if(choice.center==='transparent')check(frame.center.strong===0&&frame.center.zeroRatio>.97&&frame.center.maxAlpha<=1&&frame.center.meanAlpha<.03,choice.id+': center must be transparent, allowing only native alpha-one quantization residual');
  else check(frame.center.meanAlpha>240&&frame.center.meanRGB.every(channel=>channel<70),choice.id+': clear dark center for readable DOM content');
 }
 const archive=path.join(directory,choice.fileName),destination=path.join(publicDirectory,choice.fileName);
 fs.writeFileSync(archive,bytes);fs.writeFileSync(destination,bytes);check(bytes.equals(fs.readFileSync(archive))&&bytes.equals(fs.readFileSync(destination)),choice.id+': native source bytes changed');
 const src='/assets/v41/autochess/ui/'+choice.fileName;
 const config=choice.frames||[{id:choice.id,svgName:choice.fileName.replace('.png','.svg'),row:0}];
 for(const spec of config){
  const frame=record.frames[spec.row],[cellX,cellY,cellW,cellH]=frame.crop,[x,y,w,h]=frame.visibleBounds,padding=8;
  const left=Math.max(cellX,x-padding),top=Math.max(cellY,y-padding),right=Math.min(cellX+cellW,x+w+padding),bottom=Math.min(cellY+cellH,y+h+padding);
  const crop={x:left,y:top,w:right-left,h:bottom-top,anchorX:(left+right)/2,anchorY:(top+bottom)/2};
  const slice=spec.slice||[choice.rawSlice[0]-top,choice.rawSlice[1]-(record.width-right),choice.rawSlice[2]-(record.height-bottom),choice.rawSlice[3]-left];
  check(slice.every(value=>Number.isFinite(value)&&value>0)&&slice[1]+slice[3]<crop.w&&slice[0]+slice[2]<crop.h,spec.id+': nine-slice center must remain positive');
  // A viewport embeds the unchanged PNG bytes; it contains no drawn paths, filters or pixel edits.
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${crop.w}" height="${crop.h}" viewBox="0 0 ${crop.w} ${crop.h}"><image x="${-crop.x}" y="${-crop.y}" width="${record.width}" height="${record.height}" href="data:image/png;base64,${bytes.toString('base64')}"/></svg>\n`;
  fs.writeFileSync(path.join(directory,spec.svgName),svg);fs.writeFileSync(path.join(publicDirectory,spec.svgName),svg);
  entries[spec.id]={src,frameSrc:'/assets/v41/autochess/ui/'+spec.svgName,sheetWidth:record.width,sheetHeight:record.height,crop,slice,...(choice.rawSlice?{nativeSlice:choice.rawSlice}:{}),center:choice.center,renderStyle:choice.renderStyle,safeArea:{x:slice[3],y:slice[0],w:crop.w-slice[1]-slice[3],h:crop.h-slice[0]-slice[2]}};
 }
 native.push({...record,path:src,generatedSource:choice.source,prompt:choice.prompt,previousPrompts:choice.previousPrompts,referencePaths:choice.referencePaths,generatedReferencePaths:choice.generatedReferencePaths,renderStyle:choice.renderStyle,nativeBytesPreserved:true});
}
const backgrounds=[];
for(const spec of [{id:'academy-atmosphere',folder:'ui'},{id:'academy-3d',folder:'boards'}]){
 const src='/assets/v41/autochess/'+spec.folder+'/'+spec.id+'.png',archive=path.join(directory,'..',spec.folder,spec.id+'.png'),promptFile=path.join(directory,'..',spec.folder,spec.id+'.prompt.json');
 check(fs.existsSync(path.join(workspace,'public'+src))&&fs.existsSync(archive)&&fs.existsSync(promptFile),spec.id+': complete native background and provenance');
 const bytes=fs.readFileSync(path.join(workspace,'public'+src)),provenance=JSON.parse(fs.readFileSync(promptFile,'utf8'));
 check(bytes.equals(fs.readFileSync(archive)),spec.id+': native public/archive bytes differ');
 check(provenance.tool==='image_gen'&&provenance.transparent_background===false,spec.id+': opaque native imagegen background');
 if(fs.existsSync(provenance.native_source))check(hash(bytes)===hash(fs.readFileSync(provenance.native_source)),spec.id+': generated bytes differ');
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 if(spec.folder==='boards')check(width===height,spec.id+': orthographic square arena required');
 else check(Math.abs(width/height-16/9)<.01,spec.id+': panoramic atmosphere required');
 backgrounds.push({id:spec.id,path:src,width,height,colorType:bytes[25],sha256:hash(bytes),promptFile:path.relative(directory,promptFile).replaceAll('\\','/'),generatedSource:provenance.native_source,reference:provenance.reference,renderStyle:'stylized-3d',nativeBytesPreserved:true,...(spec.folder==='boards'?{camera:'orthographic-top-down',targetTileBounds:{x:.125,y:.125,w:.75,h:.75},targetTileBoundsSource:'generation prompt and existing game topology'}:{})});
}
const registry=path.join(workspace,'lib/art/autoChessInterfaceArtV41.ts');
fs.writeFileSync(registry,"import type {SpriteCrop} from '@/lib/game/sprites';\n\nexport type AutoChessInterfaceArtV41={src:string;frameSrc:string;sheetWidth:number;sheetHeight:number;crop:SpriteCrop;slice:[number,number,number,number];nativeSlice?:[number,number,number,number];center:'transparent'|'dark';renderStyle:'stylized-3d';safeArea:{x:number;y:number;w:number;h:number}};\n// frameSrc wraps native PNG bytes in a measured SVG viewport. slice applies to frameSrc; nativeSlice applies to full PNG src.\nexport const AUTO_CHESS_INTERFACE_ART_V41:Record<string,AutoChessInterfaceArtV41>="+JSON.stringify(entries,null,2)+';\nexport const AUTO_CHESS_ATMOSPHERE_V41=\'/assets/v41/autochess/ui/academy-atmosphere.png\';\n');
fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify({date:'2026-10-12',generator:'built-in image_gen',renderStyle:'stylized-3d',checks,complete:true,nativeSources:native,entries,backgrounds,nativeBytesPreserved:true,pixelEditingPerformed:false,svgViewportsOnly:true,earlier2dExploration:'2d-exploration/'},null,2)+'\n');
console.log(JSON.stringify({registered:true,checks,nativePNG:native.length,frames:Object.keys(entries).length,backgrounds:backgrounds.length,entries,registry},null,2));
