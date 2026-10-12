import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const records=[];
for(const name of process.argv.slice(2)){
 const path=new URL(name,import.meta.url),file=await readFile(path),{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{width:w,height:h}=info;
 const yy=new Uint32Array(h),xx=new Uint32Array(w);let zero=0,opaque=0,outerEdge=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=data[(y*w+x)*4+3];if(a===0)zero++;if(a>=250)opaque++;if(a>24){yy[y]++;xx[x]++;if(x===0||y===0||x===w-1||y===h-1)outerEdge++;}}
 const rowRuns=[];let start=-1;for(let y=0;y<=h;y++){if(y<h&&yy[y]===0){if(start<0)start=y;}else if(start>=0){rowRuns.push([start,y-1]);start=-1;}}
 records.push({name,width:w,height:h,sha256:createHash('sha256').update(file).digest('hex'),alphaZero:zero,alphaZeroRatio:zero/(w*h),opaquePixels:opaque,visibleOuterEdge:outerEdge,emptyRowRuns:rowRuns});
}
await writeFile(new URL('native-alpha-audit.json',import.meta.url),JSON.stringify(records,null,2)+'\n');console.info(JSON.stringify(records));
