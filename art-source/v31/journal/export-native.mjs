import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';

const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../..');
const require=createRequire(import.meta.url),wranglerRequire=createRequire(require.resolve('wrangler'));
const sharp=createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const source=resolve(here,'quest-emblems-source.png'),buffer=readFileSync(source);
const {data,info}=await sharp(buffer).raw().toBuffer({resolveWithObject:true});
if(info.channels!==4)throw Error('Generated source must already contain native RGBA.');
const output=resolve(root,'public/assets/v31/journal');mkdirSync(output,{recursive:true});
const names=['tutorial','short','medium','long'],manifest=[];
for(let i=0;i<4;i++){
 const x=Math.floor(i%2*info.width/2),y=Math.floor(Math.floor(i/2)*info.height/2);
 const right=Math.floor((i%2+1)*info.width/2),bottom=Math.floor((Math.floor(i/2)+1)*info.height/2);
 let minX=right,minY=bottom,maxX=x,maxY=y,visible=0,borderVisible=0;
 for(let py=y;py<bottom;py++)for(let px=x;px<right;px++){
  const alpha=data[(py*info.width+px)*4+3];
  if(alpha>24){visible++;minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);
   if(px===x||py===y||px===right-1||py===bottom-1)borderVisible++;
  }
 }
 if(!visible||borderVisible)throw Error(`${names[i]}: empty or clipped source cell (${borderVisible}).`);
 const crop={left:Math.max(x,minX-12),top:Math.max(y,minY-12),width:0,height:0};
 crop.width=Math.min(right,maxX+13)-crop.left;crop.height=Math.min(bottom,maxY+13)-crop.top;
 const target=resolve(output,`quest-${names[i]}.png`);
 await sharp(buffer).extract(crop).png().toFile(target);
 const exported=await sharp(target).raw().toBuffer({resolveWithObject:true});
 let mismatches=0;
 for(let py=0;py<crop.height;py++)for(let px=0;px<crop.width;px++)for(let c=0;c<4;c++){
  if(exported.data[(py*crop.width+px)*4+c]!==data[((py+crop.top)*info.width+px+crop.left)*4+c])mismatches++;
 }
 if(mismatches)throw Error('Native pixel preservation failed.');
 manifest.push({id:names[i],sourceCell:{x,y,w:right-x,h:bottom-y},crop,visible,borderVisible,nativePixelMismatches:mismatches,
  sourceHash:createHash('sha256').update(buffer).digest('hex'),runtime:`/assets/v31/journal/quest-${names[i]}.png`});
}
writeFileSync(resolve(here,'manifest.json'),JSON.stringify({source:'quest-emblems-source.png',width:info.width,height:info.height,channels:info.channels,exports:manifest},null,2)+'\n');
console.log('4 native RGBA quest emblems: crops, alpha borders and exact pixel preservation approved.');
