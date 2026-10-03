// Native crop exports only. Generated RGBA pixels are never resized, repainted or recolored.
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {copyFileSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base='C:/Users/Diego/.codex/generated_images/01a1028e-5be8-7663-82a1-e9f4a5e52f9d/';
const kits={
 carmilla:{file:'exec-c313c6d9-de9d-452c-89ad-a6b174b5077d.png',split:464,right:510,bar:710,ring:[266,720],hp:[1000,590],mp:[1000,830]},
 beatriz:{file:'exec-36367d09-01e6-458d-a67a-32f0af8f1431.png',split:433,right:522,bar:700,ring:[276,715],hp:[1000,590],mp:[1000,806]},
 abel:{file:'exec-b8890814-3caf-4461-90ca-10f39c50bc5f.png',split:444,right:520,bar:717,ring:[274,735],hp:[1000,625],mp:[1000,850]},
 orfeu:{file:'exec-ea97ea63-0c27-4c1c-9a62-70006743d1b6.png',split:440,right:506,bar:707,ring:[260,715],hp:[1000,590],mp:[1000,822]},
};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');let exported=0;
for(const[id,kit]of Object.entries(kits)){
 const artDir='art-source/v27/cards/'+id,assetDir='public/assets/v27/cards/'+id;mkdirSync(artDir,{recursive:true});mkdirSync(assetDir,{recursive:true});
 const src=base+kit.file,selected=artDir+'/atlas-selected.png';copyFileSync(src,selected);
 const{data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height;
 assert.equal(w,1536);assert.equal(h,1024);
 const alpha=(x,y)=>data[(y*w+x)*4+3];
 let clear=0,partial=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;else if(data[i]<255)partial++;}
 const regions={'card-frame':[0,0,w,kit.split],'portrait-ring':[0,kit.split,kit.right,h-kit.split],'hp-vessel':[kit.right,kit.split,w-kit.right,kit.bar-kit.split],'mp-vessel':[kit.right,kit.bar,w-kit.right,h-kit.bar]};
 const emptyBounds=(seed,region)=>{const[rx,ry,rw,rh]=region,[sx,sy]=seed,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,end=1,x0=w,y0=h,x1=0,y1=0;queue[0]=sy*w+sx;seen[queue[0]]=1;
  assert.ok(alpha(sx,sy)<=8);
  while(head<end){const p=queue[head++],x=p%w,y=Math.floor(p/w);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
   for(const[ox,oy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ox,ny=y+oy,n=ny*w+nx;if(nx<rx||ny<ry||nx>=rx+rw||ny>=ry+rh||seen[n]||alpha(nx,ny)>8)continue;seen[n]=1;queue[end++]=n;}
  }return{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,pixels:end,centerAlpha:alpha(sx,sy),threshold:8};
 };
 const crops={};for(const[name,region]of Object.entries(regions)){
  const[rx,ry,rw,rh]=region;let x0=rx+rw,y0=ry+rh,x1=rx,y1=ry;
  for(let y=ry;y<ry+rh;y++)for(let x=rx;x<rx+rw;x++)if(alpha(x,y)>=16){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  x0=Math.max(rx,x0-3);y0=Math.max(ry,y0-3);x1=Math.min(rx+rw-1,x1+3);y1=Math.min(ry+rh-1,y1+3);
  const crop={left:x0,top:y0,width:x1-x0+1,height:y1-y0+1},dest=assetDir+'/'+name+'.png';
  await sharp(src).extract(crop).png().toFile(dest);
  const raw=await sharp(dest).ensureAlpha().raw().toBuffer();for(let y=0;y<crop.height;y++)assert.ok(raw.subarray(y*crop.width*4,(y+1)*crop.width*4).equals(data.subarray(((crop.top+y)*w+crop.left)*4,((crop.top+y)*w+crop.left+crop.width)*4)),'Native RGBA pixels preserved');
  const seed=name==='portrait-ring'?kit.ring:name==='hp-vessel'?kit.hp:name==='mp-vessel'?kit.mp:null;
  let opening;if(seed){const empty=emptyBounds(seed,region);opening={...empty,x:empty.x-crop.left,y:empty.y-crop.top};}
  const textRect=name==='card-frame'?{x:500-crop.left,y:145-crop.top,w:810,h:185}:undefined;
  crops[name]={sourceCrop:crop,path:dest,width:crop.width,height:crop.height,sha256:digest(readFileSync(dest)),nativePixelsPreserved:true,opening,textRect};exported++;
 }
 const manifest={character:id,tool:'built-in image_gen',source:src,selected,width:w,height:h,sourceSha256:digest(readFileSync(src)),selectedIsByteIdentical:readFileSync(src).equals(readFileSync(selected)),transparentPixels:clear,partialAlphaPixels:partial,alphaMeasurementThreshold:16,export:'native crop only, no resize, no repaint, original RGBA pixels preserved',crops};
 writeFileSync(artDir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({id,clear,crops}));
}
console.log(exported+' native RGBA crop exports verified.');
await import('./frame-portrait-slots.mjs');
