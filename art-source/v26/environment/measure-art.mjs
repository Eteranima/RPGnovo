// Read-only native alpha measurements; never rewrites generated pixels.
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {writeFileSync} from 'node:fs';
const atlas=(xs,ys)=>ys.slice(0,-1).flatMap((y,row)=>xs.slice(0,-1).map((x,col)=>[x,y,xs[col+1]-x,ys[row+1]-y]));
const regions={
 academy: [[0,0,430,442],[430,0,310,442],[740,0,300,442],[1040,0,408,442],...atlas([0,362,724,1086,1448],[442,684,1086])],
 ruins:[...atlas([0,362,724,1086,1448],[0,370,703]),...atlas([0,362,700,1086,1448],[703,1086])],
 utilities:[...atlas([0,362,724,1086,1448],[0,389]),...atlas([0,362,724,1086],[389,731]),[1086,389,362,360],...atlas([0,362,724,1086],[731,1086]),[1086,765,362,321]],
 harbor:[[0,0,551,510],[551,0,547,510],[1098,0,438,510],[0,510,550,514],[550,530,530,494],[1080,530,456,494]],
 boundaries:atlas([0,384,768,1152,1536],[0,365,684,1024]),
 architecture:[[0,0,1536,1024]],
 signboards:atlas([0,362,724,1086,1448],[0,362,724,1086]),
 exits:atlas([0,384,768,1152,1536],[0,512,1024])
};
const files={academy:'scenery-academy.png',ruins:'scenery-ruins.png',utilities:'utilities.png',harbor:'harbor.png',boundaries:'boundaries.png',architecture:'academy.png',signboards:'signboards.png',exits:'exits.png'};
const report={};
for(const[key,rects]of Object.entries(regions)){
 const{data,info}=await sharp('public/assets/v26/environment/'+files[key]).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let transparentPixels=0;for(let i=3;i<data.length;i+=4)if(data[i]===0)transparentPixels++;
 const crops=rects.map(([rx,ry,rw,rh])=>{let x0=rx+rw,y0=ry+rh,x1=rx,y1=ry;for(let y=ry;y<ry+rh;y++)for(let x=rx;x<rx+rw;x++){if(data[(y*info.width+x)*4+3]<20)continue;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,anchorX:(x0+x1)/2,anchorY:y1-2};});
 report[key]={file:files[key],width:info.width,height:info.height,transparentPixels,crops};
}
writeFileSync('art-source/v26/environment/sprite-bounds.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
