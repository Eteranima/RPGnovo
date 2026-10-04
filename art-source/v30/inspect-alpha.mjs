import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFileSync} from 'node:fs';
for(const e of JSON.parse(readFileSync('art-source/v30/selected.json','utf8'))){
 const {data,info}=await sharp(e.source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height;let zero=0,visible=0,edge=0;
 const py=new Uint32Array(h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=data[(y*w+x)*4+3];if(a===0)zero++;if(a>24){visible++;py[y]++;if(!x||!y||x===w-1||y===h-1)edge++;}}
 const rows=[];for(let row=0;row<e.rows;row++){const top=Math.round(row*h/e.rows),bottom=Math.round((row+1)*h/e.rows),px=new Uint32Array(w);for(let y=top;y<bottom;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>24)px[x]++;const seams=[];for(let i=1;i<e.cols;i++){const at=w*i/e.cols,radius=w/e.cols*.25;let min=Infinity,minAt=-1,clear=0;for(let x=Math.round(at-radius);x<at+radius;x++){if(px[x]<min){min=px[x];minAt=x;}if(!px[x])clear++;}seams.push({i,min,minAt,clear});}rows.push(seams);}
 const rowSeams=[];for(let i=1;i<e.rows;i++){const at=h*i/e.rows,radius=h/e.rows*.2;let min=Infinity,minAt=-1,clear=0;for(let y=Math.round(at-radius);y<at+radius;y++){if(py[y]<min){min=py[y];minAt=y;}if(!py[y])clear++;}rowSeams.push({i,min,minAt,clear});}
 console.log(JSON.stringify({id:e.id,kind:e.kind,w,h,alphaZero:zero,alphaZeroPercent:Math.round(zero/w/h*100),visible,edge,rowSeams,colSeams:rows}));
}
