import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectNative} from './inspect-native.mjs';
const directory=path.dirname(fileURLToPath(import.meta.url)),workspace=path.resolve(directory,'../../../..');
const output=path.join(workspace,'public/assets/v39/autochess/items-and-fx');fs.mkdirSync(output,{recursive:true});
const generated='C:/Users/Diego/.codex/generated_images/01a12db1-1d3c-7e13-a813-9d63c6193b61';
const selected={items:'exec-0e81ffd9-307a-40bc-8752-1a5b488bc228.png',fusion:'exec-d55f8c29-d02a-41a8-b2ba-42cdc2780455.png',craft:'exec-f0279a7b-4587-4bc3-acd8-b6638e883b33.png',victory:'exec-4aa7b834-1d3b-4431-ad61-5956e068ec2a.png'};
const itemIds=['blade','orb','cloak','core','sigil','blade-blade','blade-orb','blade-cloak','blade-core','blade-sigil','orb-orb','orb-cloak','orb-core','orb-sigil','cloak-cloak','cloak-core','cloak-sigil','core-core','core-sigil','sigil-sigil'];
const registry={items:{},effects:{}},entries=[];let checks=0;
const check=(value,message)=>{if(!value)throw Error(message);checks++;};
for(const [name,file]of Object.entries(selected)){
 const native=path.join(generated,file),bytes=fs.readFileSync(native);
 const source=path.join(directory,name+'.png'),destination=path.join(output,name+'.png');
 for(const target of [source,destination]){if(fs.existsSync(target)&&!bytes.equals(fs.readFileSync(target)))throw Error('Refusing to overwrite a different native asset: '+target);fs.writeFileSync(target,bytes);}
 check(bytes.equals(fs.readFileSync(source))&&bytes.equals(fs.readFileSync(destination)),'Native bytes differ');
 const result=inspectNative(source,name==='items'?4:6,name==='items'?5:4,name==='items'?[0,280,545,810,1082,1402]:undefined);
 check(result.cells.length===(name==='items'?20:24),'Wrong cells count');check(new Set(result.cells.map(cell=>cell.pixelHash)).size===result.cells.length,'Duplicated frame pixels');
 check(result.alpha.zero>0,'No actual transparent pixels');
 check(result.cells.every(cell=>cell.visiblePixels>0),'Empty frame');
 check(result.cells.every(cell=>cell.edgePixels===0),'Visible artwork crosses measured cell boundary');
 const src='/assets/v39/autochess/items-and-fx/'+name+'.png';
 const frames=result.cells.map(cell=>{const[x,y,w,h]=cell.crop;return {x,y,w,h,anchorX:x+w/2,anchorY:y+h/2};});
 if(name==='items')itemIds.forEach((id,index)=>registry.items[id]={src,crop:frames[index],sheetWidth:result.width,sheetHeight:result.height});
 else registry.effects[name]={src,frames,sheetWidth:result.width,sheetHeight:result.height};
 entries.push({...result,path:src,generatedSource:native,nativeBytesPreserved:true,visualInspection:'Approved full-sheet subject/count/order/style inspection. Effects grow, peak and decay in row-major order.',boundaryVisibilityThreshold:16,notes:name==='items'?'Generated native rows are not evenly spaced. Exact measured cuts preserve every complete icon; no raster resizing/cropping/editing performed.':'Native low-alpha antialias glow remains at some cell edges; no edge pixels reach 16/255 alpha. Each of the 24 cells has distinct native pixels.'});
}
fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify({generator:'built-in image_gen',date:'2026-10-11',promptFile:'prompts.json',checks,entries},null,2)+'\n');
fs.writeFileSync(path.join(directory,'registry.json'),JSON.stringify(registry,null,2)+'\n');
console.log(JSON.stringify({checks,items:Object.keys(registry.items).length,effects:Object.fromEntries(Object.entries(registry.effects).map(([name,entry])=>[name,entry.frames.length])),entries:entries.map(entry=>({name:path.basename(entry.path),width:entry.width,height:entry.height,sha256:entry.sha256,bytes:entry.bytes,maxEdgeAlpha:Math.max(...entry.cells.map(cell=>cell.edgeMaxAlpha))}))},null,2));
