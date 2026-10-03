// Native alpha component audit; read-only.
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
for(const file of ['scenery-academy.png','scenery-ruins.png','utilities.png','harbor.png','academy.png','signboards.png']){
 const{data,info}=await sharp('public/assets/v26/environment/'+file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const{width,height}=info,seen=new Uint8Array(width*height),q=new Int32Array(width*height),parts=[];
 for(let p=0;p<seen.length;p++){if(seen[p]||data[p*4+3]<80)continue;let head=0,tail=1,x0=width,y0=height,x1=0,y1=0;q[0]=p;seen[p]=1;while(head<tail){const n=q[head++],x=n%width,y=Math.floor(n/width);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);for(const other of[x>0?n-1:-1,x<width-1?n+1:-1,y>0?n-width:-1,y<height-1?n+width:-1])if(other>=0&&!seen[other]&&data[other*4+3]>=80){seen[other]=1;q[tail++]=other;}}if(tail>400)parts.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,n:tail});}
 parts.sort((a,b)=>b.n-a.n);console.log(file,JSON.stringify(parts.slice(0,20)));
}
