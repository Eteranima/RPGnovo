import fs from 'node:fs';
import {decodeNative} from './items-and-fx/inspect-native.mjs';
const choices=JSON.parse(fs.readFileSync(new URL('./piece-selections.json',import.meta.url),'utf8'));
const results=[];
for(const choice of choices){
 const d=decodeNative(choice.source),{width:w,height:h,pixels}=d;
 const a=(x,y)=>pixels[(y*w+x)*4+3];
 const seam=(axis,target,radius)=>{const size=axis==='x'?w:h,other=axis==='x'?h:w;let best=target,score=Infinity;for(let pos=Math.max(2,target-radius);pos<=Math.min(size-3,target+radius);pos++){let n=0;for(let off=-1;off<=1;off++)for(let j=0;j<other;j++){const v=axis==='x'?a(pos+off,j):a(j,pos+off);if(v>=16)n+=v;}const s=n+Math.abs(pos-target)*.001;if(s<score){score=s;best=pos;}}return {pos:best,strongAlpha:Math.floor(score)};};
 const sx=[1,2,3].map(i=>seam('x',Math.round(w*i/4),Math.floor(w/4*.12))),sy=[1,2].map(i=>seam('y',Math.round(h*i/3),Math.floor(h/3*.13)));
 const xs=[0,...sx.map(s=>s.pos),w],ys=[0,...sy.map(s=>s.pos),h],cells=[];
 let zeros=0;for(let at=3;at<pixels.length;at+=4)if(pixels[at]===0)zeros++;
 for(let row=0;row<3;row++)for(let col=0;col<4;col++){const x=xs[col],y=ys[row],right=xs[col+1],bottom=ys[row+1];let minX=right,minY=bottom,maxX=-1,maxY=-1,edge=0;for(let py=y;py<bottom;py++)for(let px=x;px<right;px++)if(a(px,py)>=16){minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);if(px<x+2||px>=right-2||py<y+2||py>=bottom-2)edge++;}cells.push({i:row*4+col,crop:[x,y,right-x,bottom-y],bounds:[minX,minY,maxX-minX+1,maxY-minY+1],edge});}
 results.push({id:choice.id,width:w,height:h,zeroAlphaPercent:+(100*zeros/(w*h)).toFixed(1),sx,sy,cells});
}
fs.writeFileSync(new URL('./piece-inspection.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results.map(({id,width,height,zeroAlphaPercent,sx,sy,cells})=>({id,width,height,zeroAlphaPercent,sx,sy,edges:cells.map(c=>c.edge)})),null,2));

