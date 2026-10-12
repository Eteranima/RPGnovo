import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectNative} from '../items-and-fx/inspect-native.mjs';
const directory=path.dirname(fileURLToPath(import.meta.url)),workspace=path.resolve(directory,'../../../..');
const output=path.join(workspace,'public/assets/v39/autochess/pieces');fs.mkdirSync(output,{recursive:true});
const generated='C:/Users/Diego/.codex/generated_images/01a12db1-1d3c-7e13-a813-9d63c6193b61';
const selected={shin:'exec-9efc99ed-b152-426f-889d-adccec485f65.png',mika:'exec-a7e23b15-0c39-477e-bdc4-af2a05a0d8c8.png',umbra:'exec-18964948-c36d-4ef8-9dce-7218834c7f61.png',vajra:'exec-22e49d6d-7c63-48f9-9fc0-917ff49950cb.png',dante:'exec-4f7e1c7d-8c48-4c22-915d-995d895d204f.png'};
// Absolute source anchors measured on boot soles / phoenix talons, excluding colored VFX and tail.
// Two staggered feet in Umbra's attack and Vajra's cast use the full visually verified pair.
const anchors={
 shin:[[188.5,344],[554,345],[912.5,342],[1272,342],[184.5,677],[551.5,678],[901,678],[1272,677],[187,1021],[556,1022],[913.5,1023],[1268,1021]],
 mika:[[183,338],[541.5,338],[900.5,338],[1262,338],[186.5,688],[522.5,688],[885.5,688],[1265.5,688],[190,1023],[549,1023],[917,1023],[1281,1023]],
 umbra:[[183,345],[551.5,345],[911,345],[1273,344],[173.5,684],[503.5,684],[904.5,684],[1282,685],[192,1026],[540.5,1027],[904.5,1031],[1252.5,1028]],
 vajra:[[175.5,347],[551.5,347],[895,347],[1260,347],[181.5,703],[534,702],[899,702],[1274.5,703],[177.5,1037],[539.5,1036],[872,1036],[1275.5,1036]],
 dante:[[194.5,331],[553.5,330],[906.5,330],[1277.5,327],[205.5,665],[613,650],[936,665],[1287.5,666],[201,982],[556.5,984],[923.5,985],[1283.5,997]],
};
const registry={},entries=[];let checks=0;
const check=(value,message)=>{if(!value)throw Error(message);checks++;};
for(const[id,file]of Object.entries(selected)){
 const native=path.join(generated,file),bytes=fs.readFileSync(native),source=path.join(directory,id+'.png'),destination=path.join(output,id+'.png');
 for(const target of [source,destination]){if(fs.existsSync(target)&&!bytes.equals(fs.readFileSync(target)))throw Error('Refusing to overwrite another asset: '+target);fs.writeFileSync(target,bytes);}
 check(bytes.equals(fs.readFileSync(source))&&bytes.equals(fs.readFileSync(destination)),id+': native bytes differ');
 const columnCuts=id==='vajra'?[undefined,undefined,[0,362,724,1110,1448]]:undefined;
 const result=inspectNative(source,4,3,undefined,columnCuts);
 check(result.width===1448&&result.height===1086,id+': source dimensions changed');
 check(result.cells.length===12&&new Set(result.cells.map(cell=>cell.pixelHash)).size===12,id+': not 12 distinct native frames');
 check(result.alpha.zero>0,id+': no actual transparency');check(result.cells.every(cell=>cell.visiblePixels>0),id+': empty sprite');
 check(result.cells.every(cell=>cell.edgePixels===0),id+': visible sprite crosses measured crop');
 const frames=result.cells.map((cell,index)=>{const[x,y,w,h]=cell.crop,[anchorX,anchorY]=anchors[id][index];check(anchorX>=x&&anchorX<x+w&&anchorY>=y&&anchorY<y+h,id+': ground anchor outside crop');return{x,y,w,h,anchorX,anchorY};});
 const src='/assets/v39/autochess/pieces/'+id+'.png';registry[id]={src,idle:frames.slice(0,4),attack:frames.slice(4,8),cast:frames.slice(8,12),sheetWidth:result.width,sheetHeight:result.height};
 entries.push({...result,path:src,generatedSource:native,canonicalReference:'/assets/v31/companions/'+id+'/fullbody.png',nativeBytesPreserved:true,frames,groundAnchorMethod:'Boot/talon pixel region measurement with full-sheet visual inspection. Phoenix tail and colored magic are excluded; cast/attack feet are not inferred from the full sprite bounding-box bottom.',visualInspection:id==='dante'?'Canonical phoenix: one head, two wings, two bird legs; rejected extra chest claws removed in builtin edit. Original ruby chest ornament/red-gold plumage retained.':'Canonical chibi humanoid: two arms/two legs, complete body and approved outfit/hair/colors; distinct ready/attack/cast silhouettes inspected.',boundaryVisibilityThreshold:16,notes:id==='vajra'?'Peak cast nails extend into clear gutter beyond uniform x1086. Measured boundary x1110 keeps all three nails in frame10 and excludes them from frame11. No raster edits performed.':'Regular 362px source cells. Ground baselines are measured, not the requested84% assumed; caster effects remain isolated.'});
}
fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify({generator:'built-in image_gen',date:'2026-10-11',promptFile:'prompts.json',checks,entries},null,2)+'\n');
fs.writeFileSync(path.join(directory,'registry-companion.json'),JSON.stringify(registry,null,2)+'\n');
console.log(JSON.stringify({checks,pieces:Object.keys(registry),nativeFrames:entries.reduce((sum,entry)=>sum+entry.frames.length,0),entries:entries.map(entry=>({name:path.basename(entry.path),width:entry.width,height:entry.height,bytes:entry.bytes,sha256:entry.sha256,maxEdgeAlpha:Math.max(...entry.cells.map(cell=>cell.edgeMaxAlpha))}))},null,2));
