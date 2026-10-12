import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const source=process.argv[2];
if(!source) throw new Error('Provide native generated source path');
const folder=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,''));
const root=path.resolve(folder,'../../../..');
const output=path.join(root,'public/assets/v36/variants/orfeu-unwritten-archon/cinematic-background.png');
const selected=path.join(folder,'cinematic-background-source.png');
const original=await fs.readFile(source);
const {data,info}=await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
let notOpaque=0;for(let i=3;i<data.length;i+=4) if(data[i]!==255)notOpaque++;
if(notOpaque) throw new Error('Background must be fully opaque; regenerate rather than edit alpha');
const multiple=Math.floor(Math.min(info.width/16,info.height/9));
const crop={left:Math.floor((info.width-multiple*16)/2),top:Math.floor((info.height-multiple*9)/2),width:multiple*16,height:multiple*9};
const native=await sharp(original).extract(crop).png().toBuffer();
const check=await sharp(native).ensureAlpha().raw().toBuffer();
for(let y=0;y<crop.height;y++){
 const a=data.subarray(((y+crop.top)*info.width+crop.left)*4,((y+crop.top)*info.width+crop.left+crop.width)*4);
 const b=check.subarray(y*crop.width*4,(y+1)*crop.width*4);
 if(!a.equals(b))throw new Error('Native crop changed RGBA pixels');
}
await fs.writeFile(selected,original);await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,native);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest={kind:'cinematic-background',source,selectedSource:path.relative(root,selected).replaceAll('\\','/'),runtime:path.relative(root,output).replaceAll('\\','/'),sourceSize:{width:info.width,height:info.height},nativeCrop:crop,outputSize:{width:crop.width,height:crop.height},aspectRatio:'16:9',alphaNonOpaque:notOpaque,sourceSha256:hash(original),runtimeSha256:hash(native),rgbaPixelsUnchanged:true,notes:'Native centered exact16:9 extract only. No resize, paint, filtering or alpha edits. Neutral stone-page hall, no characters or elemental energy.'};
await fs.writeFile(path.join(folder,'cinematic-background-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest));
