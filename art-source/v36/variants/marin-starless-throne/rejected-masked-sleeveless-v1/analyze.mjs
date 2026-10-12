import sharp from '../../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const result=[];
for(const name of ['walk-source.png','attack-source.png','reference-portrait.png']){
 const path=fileURLToPath(new URL(name,import.meta.url));
 const file=await readFile(path),{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let zero=0,opaque=0,edgeVisible=0,min=255,max=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  const a=data[(y*info.width+x)*4+3];min=Math.min(min,a);max=Math.max(max,a);if(a===0)zero++;if(a>=250)opaque++;if(a>24&&(x===0||y===0||x===info.width-1||y===info.height-1))edgeVisible++;
 }
 result.push({name,width:info.width,height:info.height,sha256:createHash('sha256').update(file).digest('hex'),alphaMin:min,alphaMax:max,alphaZero:zero,opaquePixels:opaque,visibleOuterEdgePixels:edgeVisible});
}
await writeFile(new URL('rejected-analysis.json',import.meta.url),JSON.stringify({status:'rejected',runtimeIntegrated:false,sources:result},null,2)+'\n');
console.info(JSON.stringify(result));
