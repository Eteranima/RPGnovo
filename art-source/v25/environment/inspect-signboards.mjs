// Read-only alpha analysis of the repaired signboard PNG; no image file is modified.
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {writeFileSync} from 'node:fs';
const {data,info}=await sharp('public/assets/v25/environment/signboards.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const {width,height,channels}=info,seen=new Uint8Array(width*height),queue=new Int32Array(width*height),parts=[];
for(let p=0;p<seen.length;p++){
 if(seen[p]||data[p*channels+3]<50)continue;
 let tail=1,head=0,x0=width,y0=height,x1=0,y1=0;seen[p]=1;queue[0]=p;
 while(head<tail){const q=queue[head++],x=q%width,y=Math.floor(q/width);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);for(const n of [x>0?q-1:-1,x<width-1?q+1:-1,y>0?q-width:-1,y<height-1?q+width:-1]){if(n<0||seen[n]||data[n*channels+3]<50)continue;seen[n]=1;queue[tail++]=n;}}
 if(tail>800)parts.push({pixels:tail,x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,anchorX:(x0+x1)/2,anchorY:y1-2});
}
const report={width,height,parts:parts.sort((a,b)=>b.pixels-a.pixels)};
writeFileSync('art-source/v25/environment/signboard-final-bounds.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
