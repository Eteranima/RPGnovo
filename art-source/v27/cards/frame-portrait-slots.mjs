import {readFileSync,writeFileSync} from 'node:fs';
const slots={
 carmilla:{x:120,y:104,w:271,h:266,method:'native alpha<=8 connected opening; corner threads may overlap edge',alphaOpening:true},
 beatriz:{x:167,y:100,w:249,h:252,method:'native alpha<=8 connected opening; wave ornament occupies left portion of circle',alphaOpening:true},
 abel:{x:174,y:120,w:220,h:234,method:'native alpha<=8 connected opening; lion ornament occupies left portion of circle',alphaOpening:true},
 orfeu:{x:142,y:128,w:198,h:221,method:'manual visible inner gold-rim bounds; painted fist covers the center, no transparent opening',alphaOpening:false},
};
for(const[id,slot]of Object.entries(slots)){const path='art-source/v27/cards/'+id+'/manifest.json',m=JSON.parse(readFileSync(path,'utf8')),crop=m.crops['card-frame'].sourceCrop;const opening={...slot,x:slot.x-crop.left,y:slot.y-crop.top,centerX:slot.x-crop.left+slot.w/2,centerY:slot.y-crop.top+slot.h/2};m.framePortraitOpening=opening;m.crops['card-frame'].framePortraitOpening=opening;writeFileSync(path,JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({id,...opening}));}
