// Export native Mika crops only; every RGBA row is compared to the approved sheet.
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='art-source/v36/variants/ophelia-white-equinox',manifest=JSON.parse(readFileSync(`${root}/companion-manifest.json`,'utf8'));
const source=manifest.selected,{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const full=manifest.frames[0],pose=manifest.frames[2];
// Event crop includes the cap, face, both hands and ice flower; lower boots belong to the full-body crop.
const jobs=[{name:'companion-fullbody-preview',frame:0,crop:full},{name:'companion-event-preview',frame:2,crop:{x:pose.x,y:pose.y,w:pose.w,h:Math.min(pose.h,Math.round(pose.h*.68))}}];
const exports=[];
for(const job of jobs){const {x,y,w,h}=job.crop,path=`public/assets/v36/variants/ophelia-white-equinox/${job.name}.png`;
 await sharp(source).extract({left:x,top:y,width:w,height:h}).png().toFile(path);
 const raw=await sharp(path).ensureAlpha().raw().toBuffer();for(let row=0;row<h;row++)assert.ok(raw.subarray(row*w*4,(row+1)*w*4).equals(data.subarray(((y+row)*info.width+x)*4,((y+row)*info.width+x+w)*4)),'Native RGBA crop differs');
 exports.push({...job,path,sha256:hash(path),allNativeRgbaPixelsPreserved:true});
}
writeFileSync(`${root}/companion-crops.json`,JSON.stringify({source,sourceSha256:hash(source),exports},null,2)+'\n');console.log(JSON.stringify(exports));
