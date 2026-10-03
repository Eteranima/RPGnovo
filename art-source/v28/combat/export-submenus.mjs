// Native alpha bounding-box crop only. No image repaint, resize or recolor.
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{mkdirSync,readFileSync,writeFileSync,copyFileSync}from'node:fs';import{createHash}from'node:crypto';import assert from'node:assert/strict';
const files={"skills":"exec-5fb0639a-adc3-4e92-8689-38738034f400.png","items":"exec-e82a8029-f48b-42b5-b0e4-06885a6d6e65.png","flee":"exec-9f2f775c-2d0d-48bf-9ff3-b8d4d1d2cd0e.png"},base='C:/Users/Diego/.codex/generated_images/01a1028e-5be8-7663-82a1-e9f4a5e52f9d/',hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');mkdirSync('public/assets/v28/combat',{recursive:true});
for(const[id,file]of Object.entries(files)){const source=base+file,dir='art-source/v28/combat/'+id,selected=dir+'/source.png';copyFileSync(source,selected);
 const{data,info}=await sharp(selected).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{width:w,height:h}=info;let x0=w,y0=h,x1=0,y1=0,clear=0,edge=0;const alpha=(x,y)=>data[(y*w+x)*4+3];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=alpha(x,y);if(a===0)clear++;if(a<=24)continue;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);if(x===0||y===0||x===w-1||y===h-1)edge++;}
 const crop={left:Math.max(0,x0-8),top:Math.max(0,y0-8),width:Math.min(w,x1+9)-Math.max(0,x0-8),height:Math.min(h,y1+9)-Math.max(0,y0-8)},dst='public/assets/v28/combat/'+id+'.png';
 await sharp(selected).extract(crop).png().toFile(dst);
 const raw=await sharp(dst).ensureAlpha().raw().toBuffer();for(let y=0;y<crop.height;y++)assert.ok(raw.subarray(y*crop.width*4,(y+1)*crop.width*4).equals(data.subarray(((crop.top+y)*w+crop.left)*4,((crop.top+y)*w+crop.left+crop.width)*4)),'Every cropped RGBA row is identical to generated source');
 const corners=[[0,0],[crop.width-1,0],[0,crop.height-1],[crop.width-1,crop.height-1]].map(([x,y])=>raw[(y*crop.width+x)*4+3]);assert.ok(corners.every(a=>a===0),'True exterior alpha');
 const center=[Math.floor(crop.width*.62),Math.floor(crop.height*.5)],centerAlpha=raw[(center[1]*crop.width+center[0])*4+3];assert.ok(centerAlpha>=250,'Opaque painted text interior');
 const report={sprite:id,tool:'built-in image_gen',generatedSource:source,selected,sourceSha256:hash(source),selectedSha256:hash(selected),sourceCopyByteIdentical:hash(source)===hash(selected),sourceSize:{width:w,height:h},sourceTransparentPixels:clear,sourceVisibleEdgePixels:edge,alphaCropThreshold:24,cropMargin:8,crop,path:dst,width:crop.width,height:crop.height,ratio:crop.width/crop.height,sha256:hash(dst),allNativeRgbaPixelsPreserved:true,cornersAlpha:corners,paintedInteriorAlpha:centerAlpha,textSafeArea:{x:Math.round(crop.width*.32),y:Math.round(crop.height*.25),w:Math.round(crop.width*.56),h:Math.round(crop.height*.5)}};
 writeFileSync(dir+'/manifest.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}

