import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFileSync} from 'node:fs';
for(const[id,seed] of Object.entries({carmilla:[255,230],beatriz:[270,235],abel:[280,270]})){
 const m=JSON.parse(readFileSync('art-source/v27/cards/'+id+'/manifest.json'));const{data,info}=await sharp(m.source).ensureAlpha().raw().toBuffer({resolveWithObject:true});const{width:w,height:h}=info,a=(x,y)=>data[(y*w+x)*4+3];const seen=new Uint8Array(w*h),q=new Int32Array(w*h);let end=1,head=0,x0=w,y0=h,x1=0,y1=0;q[0]=seed[1]*w+seed[0];seen[q[0]]=1;
 while(head<end){const p=q[head++],x=p%w,y=Math.floor(p/w);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);for(const[ox,oy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ox,ny=y+oy,n=ny*w+nx;if(nx<0||ny<0||nx>=500||ny>=435||seen[n]||a(nx,ny)>8)continue;seen[n]=1;q[end++]=n;}}
 console.log(JSON.stringify({id,x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,pixels:end,seedAlpha:a(...seed)}));
}
