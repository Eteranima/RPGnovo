import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {writeFileSync} from 'node:fs';
const source=process.argv[2],cols=Number(process.argv[3]),rows=Number(process.argv[4]);
const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const {width:w,height:h}=info;
function corridors(count,length,score){return Array.from({length:count-1},(_,i)=>{const expected=(i+1)*length/count,lo=Math.floor(expected-length/count*.24),hi=Math.ceil(expected+length/count*.24);let best={index:lo,nonzero:Infinity};for(let j=lo;j<hi;j++){const value=score(j);if(value<best.nonzero||value===best.nonzero&&Math.abs(j-expected)<Math.abs(best.index-expected))best={index:j,nonzero:value};}return best;});}
const horizontal=corridors(rows,h,y=>{let n=0;for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>0)n++;return n;});
const rowCuts=[0,...horizontal.map(v=>v.index),h],vertical=[];
for(let row=0;row<rows;row++)vertical.push(corridors(cols,w,x=>{let n=0;for(let y=rowCuts[row];y<rowCuts[row+1];y++)if(data[(y*w+x)*4+3]>0)n++;return n;}));
const edges={top:0,bottom:0,left:0,right:0};let alphaZero=0;
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=data[(y*w+x)*4+3];if(a===0)alphaZero++;else{if(y===0)edges.top++;if(y===h-1)edges.bottom++;if(x===0)edges.left++;if(x===w-1)edges.right++;}}
function stats(values){let max=0,over24=0,over210=0;for(const a of values){max=Math.max(max,a);if(a>24)over24++;if(a>210)over210++;}return {max,over24,over210};}
horizontal.forEach(v=>v.alpha=stats(Array.from({length:w},(_,x)=>data[(v.index*w+x)*4+3])));
vertical.forEach((line,row)=>line.forEach(v=>v.alpha=stats(Array.from({length:rowCuts[row+1]-rowCuts[row]},(_,i)=>data[((rowCuts[row]+i)*w+v.index)*4+3]))));
const edgeAlpha={top:stats(Array.from({length:w},(_,x)=>data[x*4+3])),bottom:stats(Array.from({length:w},(_,x)=>data[((h-1)*w+x)*4+3])),left:stats(Array.from({length:h},(_,y)=>data[y*w*4+3])),right:stats(Array.from({length:h},(_,y)=>data[(y*w+w-1)*4+3]))};
const report={source,width:w,height:h,alphaZero,allPixels:w*h,strictAlphaZeroCorridors:horizontal.every(v=>v.nonzero===0)&&vertical.flat().every(v=>v.nonzero===0),horizontal,vertical,edges,edgeAlpha};
if(process.argv[5])writeFileSync(process.argv[5],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
