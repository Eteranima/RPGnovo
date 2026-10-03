import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const sources={carmilla:'exec-c313c6d9-de9d-452c-89ad-a6b174b5077d.png',beatriz:'exec-36367d09-01e6-458d-a67a-32f0af8f1431.png',abel:'exec-b8890814-3caf-4461-90ca-10f39c50bc5f.png',orfeu:'exec-ea97ea63-0c27-4c1c-9a62-70006743d1b6.png'},base='C:/Users/Diego/.codex/generated_images/01a1028e-5be8-7663-82a1-e9f4a5e52f9d/';
for(const [id,file]of Object.entries(sources)){
 const{data,info}=await sharp(base+file).ensureAlpha().raw().toBuffer({resolveWithObject:true});const {width:w,height:h}=info,seen=new Uint8Array(w*h),queue=new Int32Array(w*h),parts=[];
 for(let p=0;p<w*h;p++){
  if(seen[p]||data[p*4+3]<32)continue;let head=0,end=1,x0=w,y0=h,x1=0,y1=0;queue[0]=p;seen[p]=1;
  while(head<end){const q=queue[head++],x=q%w,y=Math.floor(q/w);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
   for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const nx=x+ox,ny=y+oy,n=ny*w+nx;if(nx<0||ny<0||nx>=w||ny>=h||seen[n]||data[n*4+3]<32)continue;seen[n]=1;queue[end++]=n;}
  }
  if(end>12)parts.push({pixels:end,x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});
 }
 parts.sort((a,b)=>b.pixels-a.pixels);console.log(JSON.stringify({id,parts:parts.slice(0,16)}));
}
