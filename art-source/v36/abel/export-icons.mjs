import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,copyFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const require=createRequire(import.meta.url),sharp=createRequire(createRequire(require.resolve('wrangler')).resolve('miniflare'))('sharp');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const source=resolve(root,'art-source/v36/abel/skills-atlas.png'),runtime=resolve(root,'public/assets/v36/abel/icons');
await mkdir(runtime,{recursive:true});
if(process.argv[2])await copyFile(process.argv[2],source);
const sourceBytes=await readFile(source),{data,info}=await sharp(sourceBytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
assert.deepEqual([info.width,info.height],[1774,887],'Measured native atlas');
const ids=['primordial-spark','ember-mantle','hearth-rest','lion-fang','cinder-interdict','crucible-break','primordial-oath','ultimate'];
const xs=[0,444,887,1331,1774],ys=[0,434,887],icons=[];let rows=0;
for(let i=0;i<ids.length;i++){
 const x=xs[i%4],y=ys[i>>2],w=xs[i%4+1]-x,h=ys[(i>>2)+1]-y;
 let boundaryMax=0,visible=0,transparent=0;
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
  const a=data[(yy*info.width+xx)*4+3];if(a===0)transparent++;if(a>24)visible++;
  if(xx===x||xx===x+w-1||yy===y||yy===y+h-1)boundaryMax=Math.max(boundaryMax,a);
 }
 assert.ok(boundaryMax<=24,'Transparent measured separation');assert.ok(visible>w*h*.4&&transparent>w*h*.1,'Real icon and real alpha');
 const output=resolve(runtime,ids[i]+'.png');await sharp(sourceBytes).extract({left:x,top:y,width:w,height:h}).png().toFile(output);
 const decoded=await sharp(output).ensureAlpha().raw().toBuffer();
 for(let yy=0;yy<h;yy++){assert.ok(decoded.subarray(yy*w*4,(yy+1)*w*4).equals(data.subarray(((y+yy)*info.width+x)*4,((y+yy)*info.width+x+w)*4)),'Every RGBA row preserved');rows++;}
 icons.push({id:ids[i],key:'skill_icon_abel_'+ids[i],runtime:'public/assets/v36/abel/icons/'+ids[i]+'.png',crop:{x,y,w,h},boundaryMax,visible,transparent,sha256:sha(await readFile(output))});
}
const manifest={date:'2026-10-11',source:'art-source/v36/abel/skills-atlas.png',sourceSha256:sha(sourceBytes),width:info.width,height:info.height,mode:'native-crop-only',rowsCompared:rows,icons};
await writeFile(resolve(root,'art-source/v36/abel/icons-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const assets=Object.fromEntries(icons.map(i=>[i.key,'/'+i.runtime.replace(/^public\//,'')]));
await writeFile(resolve(root,'lib/game/abelArtV36.ts'),'// Generated from eight measured native icon crops. See art-source/v36/abel/icons-manifest.json.\nexport const ABEL_SKILL_ASSETS_V36 = '+JSON.stringify(assets,null,2)+' as const;\n');
console.log('Abel native icons PASS: '+icons.length+' distinct crops, '+rows+' exact RGBA rows.');
