// Authorized native crop export: every RGBA pixel is preserved byte-for-byte.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{readFileSync,writeFileSync}from'node:fs';import{createHash}from'node:crypto';import assert from'node:assert/strict';
const faceCrops={carmilla:{left:367,top:7,width:320,height:320},beatriz:{left:439,top:135,width:260,height:260},abel:{left:388,top:70,width:286,height:286}};
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
for(const[id,crop]of Object.entries(faceCrops)){
 const source=`public/assets/v29/${id}/portrait.png`,dst=`public/assets/v29/${id}/face.png`;
 const{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 await sharp(source).extract(crop).png().toFile(dst);const raw=await sharp(dst).ensureAlpha().raw().toBuffer();
 for(let y=0;y<crop.height;y++)assert.ok(raw.subarray(y*crop.width*4,(y+1)*crop.width*4).equals(data.subarray(((crop.top+y)*info.width+crop.left)*4,((crop.top+y)*info.width+crop.left+crop.width)*4)));
 writeFileSync(`art-source/v29/${id}/face-manifest.json`,JSON.stringify({portrait:source,face:dst,faceCrop:crop,sourceSha256:hash(source),faceSha256:hash(dst),allNativeRgbaPixelsPreserved:true},null,2)+'\n');console.log(id,JSON.stringify(crop));
}
