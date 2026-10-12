import sharp from '../../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const results=[];
for(const id of ['seiji-last-script','ophelia-white-equinox','gabriel-solar-oath','max-thunder-requiem']){
 const path=fileURLToPath(new URL('../../'+id+'/portrait-source.png',import.meta.url));
 const file=await readFile(path),{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let zero=0,edgeVisible=0,min=255,max=0,x0=info.width,y0=info.height,x1=-1,y1=-1;
 const probes=[];
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  const a=data[(y*info.width+x)*4+3];min=Math.min(min,a);max=Math.max(max,a);if(a===0)zero++;
  if(a>24){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);if(x===0||y===0||x===info.width-1||y===info.height-1)edgeVisible++;}
 }
 for(const [fx,fy] of [[.03,.03],[.5,.03],[.97,.03],[.03,.5],[.97,.5],[.03,.97],[.5,.97],[.97,.97]]){const x=Math.floor(info.width*fx),y=Math.floor(info.height*fy);probes.push({x,y,alpha:data[(y*info.width+x)*4+3]});}
 results.push({id,path,width:info.width,height:info.height,sha256:createHash('sha256').update(file).digest('hex'),alphaMin:min,alphaMax:max,alphaZero:zero,alphaZeroRatio:zero/(info.width*info.height),visibleOuterEdgePixels:edgeVisible,visibleBBox:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},marginProbes:probes,scope:'Read-only alpha/bounds audit; no character anatomy guarantee.'});
}
await writeFile(new URL('other-portrait-alpha-audit.json',import.meta.url),JSON.stringify(results,null,2)+'\n');console.info(JSON.stringify(results.map(({id,width,height,alphaZeroRatio,visibleOuterEdgePixels,visibleBBox})=>({id,width,height,alphaZeroRatio,visibleOuterEdgePixels,visibleBBox}))));
