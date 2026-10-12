import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const kinds=process.argv.slice(2),records=[];
for(const kind of kinds){
 const manifest=JSON.parse(await readFile(new URL(kind+'-manifest.json',import.meta.url),'utf8'));
 await mkdir(new URL('review/'+kind+'/',import.meta.url),{recursive:true});
 const {data,info}=await sharp(manifest.selected).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let i=0;i<manifest.frames.length;i++){
  const f=manifest.frames[i],rect={left:f.x,top:f.y,width:f.w,height:f.h},dst=new URL('review/'+kind+'/'+String(i).padStart(2,'0')+'.png',import.meta.url);
  await sharp(manifest.selected).extract(rect).png().toFile(dst.pathname.replace(/^\/([A-Z]:)/,'$1'));
  const raw=await sharp(dst.pathname.replace(/^\/([A-Z]:)/,'$1')).ensureAlpha().raw().toBuffer();
  for(let y=0;y<f.h;y++)if(!raw.subarray(y*f.w*4,(y+1)*f.w*4).equals(data.subarray(((f.y+y)*info.width+f.x)*4,((f.y+y)*info.width+f.x+f.w)*4)))throw new Error('Native crop RGBA changed');
  records.push({kind,i,path:'review/'+kind+'/'+String(i).padStart(2,'0')+'.png',nativeRgbaPreserved:true});
 }
}
await writeFile(new URL('review/native-crops.json',import.meta.url),JSON.stringify(records,null,2)+'\n');console.info('Verified '+records.length+' native review crops.');
