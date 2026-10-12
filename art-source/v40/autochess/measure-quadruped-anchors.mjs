import fs from 'node:fs';
import {decodeNative} from '../../v39/autochess/items-and-fx/inspect-native.mjs';
const report=JSON.parse(fs.readFileSync('art-source/v40/autochess/registration-inspection.json','utf8'));
const choices=JSON.parse(fs.readFileSync('art-source/v40/autochess/selections.json','utf8'));
for(const id of ['ashwolf','lunastag']){
 const record=report.records.find(entry=>entry.id===id),source=choices.find(entry=>entry.id===id).source,{width,pixels}=decodeNative(source);
 const measurements=record.cells.map((cell,index)=>{
  const[x,y,w,h]=cell.crop,footY=record.bodyMeasurement.feet[index][1],xs=[];
  for(let px=Math.ceil(x+w*.06);px<Math.floor(x+w*.94);px++){
   let hits=0;for(let py=Math.max(y,footY-18);py<=footY;py++){const at=(py*width+px)*4;if(pixels[at+3]>=100&&Math.max(pixels[at],pixels[at+1],pixels[at+2])<170)hits++;}
   if(hits>=3)xs.push(px);
  }
  return{index,original:record.bodyMeasurement.feet[index],feetExtent:[Math.min(...xs),Math.max(...xs)],anchor:[(Math.min(...xs)+Math.max(...xs))/2,footY]};
 });
 console.log(JSON.stringify({id,sha256:record.sha256,measurements},null,2));
}
