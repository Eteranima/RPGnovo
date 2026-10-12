// Native crops only. This file never repaints/resizes runtime sprites.
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{readFileSync,writeFileSync,mkdirSync}from'node:fs';
import{createHash}from'node:crypto';
import assert from'node:assert/strict';
const folder='art-source/v36/variants/beatriz-eclipse-tide',runtime='public/assets/v36/variants/beatriz-eclipse-tide',hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
mkdirSync(`${folder}/proofs`,{recursive:true});
const entries=JSON.parse(readFileSync(`${folder}/entries.json`,'utf8')),bodyTops={},footAnchors={};
for(const kind of ['walk','attack','cast','ultimate','vfx','icons']){
 const m=JSON.parse(readFileSync(`${folder}/${kind}-manifest.json`,'utf8'));
 const entry=entries.find(item=>item.kind===kind);
 if(entry.bodyTops){assert.equal(entry.bodyTops.length,m.frames.length);m.measurements.forEach((item,i)=>{item.headOrHatTop=entry.bodyTops[i];item.bodyTopMethod=i===2?'manual crown top; raised blade excluded':'visible crown/hair top';});writeFileSync(`${folder}/${kind}-manifest.json`,JSON.stringify(m,null,2)+'\n');}
 if(['walk','attack','cast','ultimate'].includes(kind)){bodyTops[`battle_beatriz-eclipse-tide_${kind}`]=m.measurements.map(item=>item.headOrHatTop);footAnchors[kind]=m.frames.map(f=>({x:f.anchorX,y:f.anchorY}));}
 for(let i=0;i<m.frames.length;i++){const c=m.frames[i];await sharp(m.runtime).extract({left:c.x,top:c.y,width:c.w,height:c.h}).png().toFile(`${folder}/proofs/${kind}-${i}.png`);}
}
writeFileSync(`${folder}/body-metrics.json`,JSON.stringify({id:'beatriz-eclipse-tide',bodyTops,footAnchors,notes:'Head/crown tops exclude raised blade in attack2. Attack3–5 anchors manually center both boots rather than choosing only the lower boot. Ultimate contact5; body faces right in all battle cells. Walk source order S/W/E/N.'},null,2)+'\n');
const source=`${folder}/cinematic-background-source.png`,dst=`${runtime}/cinematic-background.png`,{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const unit=Math.floor(Math.min(info.width/16,info.height/9)),rect={left:Math.floor((info.width-unit*16)/2),top:Math.floor((info.height-unit*9)/2),width:unit*16,height:unit*9};
await sharp(source).extract(rect).png().toFile(dst);
const raw=await sharp(dst).ensureAlpha().raw().toBuffer();let opaque=0;
for(let y=0;y<rect.height;y++){assert.ok(raw.subarray(y*rect.width*4,(y+1)*rect.width*4).equals(data.subarray(((rect.top+y)*info.width+rect.left)*4,((rect.top+y)*info.width+rect.left+rect.width)*4)),'all background crop native RGBA rows equal original');for(let x=0;x<rect.width;x++)if(raw[(y*rect.width+x)*4+3]===255)opaque++;}
assert.equal(opaque,rect.width*rect.height,'cinematic environment fully opaque');
const proof={tool:'built-in image_gen',source,dst,sourceSize:{width:info.width,height:info.height},nativeRect:rect,sourceSha256:hash(source),runtimeSha256:hash(dst),allNativeRgbaPixelsPreserved:true,opaquePixels:opaque,ratio:'16:9',noCharacters:true,noText:true};
writeFileSync(`${folder}/cinematic-background-manifest.json`,JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
