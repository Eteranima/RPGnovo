// Native portrait copies and face crops: no resize, repaint, alpha masking or filtering.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const entries=JSON.parse(readFileSync(process.argv[2],'utf8'));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
for(const {id,face} of entries){
 const dir=`art-source/v36/variants/${id}`,source=`${dir}/portrait-source.png`,runtimeDir=`public/assets/v36/variants/${id}`,runtime=`${runtimeDir}/portrait.png`;
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.channels,4);
 let edge=0,clear=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const a=data[(y*info.width+x)*4+3];if(!a)clear++;if(a>24&&(x===0||y===0||x===info.width-1||y===info.height-1))edge++;}
 assert.equal(edge,0,id+' visible portrait touching edge');assert.ok(clear>info.width*info.height*.1);
 assert.ok(face.left>=0&&face.top>=0&&face.left+face.width<=info.width&&face.top+face.height<=info.height);
 mkdirSync(runtimeDir,{recursive:true});copyFileSync(source,runtime);
 const faceRuntime=`${runtimeDir}/face.png`;await sharp(source).extract(face).png().toFile(faceRuntime);
 const raw=await sharp(faceRuntime).ensureAlpha().raw().toBuffer();
 for(let y=0;y<face.height;y++)assert.ok(raw.subarray(y*face.width*4,(y+1)*face.width*4).equals(data.subarray(((face.top+y)*info.width+face.left)*4,((face.top+y)*info.width+face.left+face.width)*4)));
 const manifest={id,source,runtime,width:info.width,height:info.height,sourceSha256:hash(source),runtimeSha256:hash(runtime),byteIdenticalSourceCopies:hash(source)===hash(runtime),alphaThresholdForMeasurementOnly:24,visibleEdge:edge,backgroundAlphaZero:clear,face:{...face,runtime:faceRuntime,sha256:hash(faceRuntime),allNativeRgbaPixelsPreserved:true}};
 writeFileSync(`${dir}/portrait-manifest.json`,JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({id,portrait:[info.width,info.height],face,edge}));
}
