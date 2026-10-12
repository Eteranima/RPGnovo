import fs from 'node:fs';
import crypto from 'node:crypto';
import {inflateSync} from 'node:zlib';

const directory=new URL('./',import.meta.url);
const entries=[];
for(const name of ['archive-canvas','arcane-frame']){
 const bytes=fs.readFileSync(new URL(name+'.png',directory));
 const final=fs.readFileSync(new URL('../../../public/assets/v38/interface/'+name+'.png',directory));
 if(!bytes.equals(final))throw new Error(name+': final differs from native source');
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20),colorType=bytes[25];
 const entry={name,path:'/assets/v38/interface/'+name+'.png',width,height,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),nativeBytesPreserved:true};
 if(name==='arcane-frame'){
  if(colorType!==6||bytes[24]!==8)throw new Error('Frame must be native RGBA8');
  const chunks=[];for(let at=8;at<bytes.length;){const length=bytes.readUInt32BE(at),type=bytes.toString('ascii',at+4,at+8);if(type==='IDAT')chunks.push(bytes.subarray(at+8,at+8+length));at+=12+length;}
  const raw=inflateSync(Buffer.concat(chunks)),stride=width*4,pixels=Buffer.alloc(stride*height);
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<height;y++)for(let x=0;x<stride;x++){const filter=raw[y*(stride+1)],left=x>=4?pixels[y*stride+x-4]:0,up=y?pixels[(y-1)*stride+x]:0,corner=y&&x>=4?pixels[(y-1)*stride+x-4]:0;pixels[y*stride+x]=(raw[y*(stride+1)+x+1]+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):paeth(left,up,corner)))&255;}
  let centerPixels=0,centerMaxAlpha=0,nonzero=0,opaque=0,peak=null;for(let y=200;y<height-200;y++)for(let x=240;x<width-240;x++){centerPixels++;const alpha=pixels[(y*width+x)*4+3];if(alpha)nonzero++;if(alpha===255)opaque++;if(alpha>centerMaxAlpha){centerMaxAlpha=alpha;peak=[x,y];}}
  entry.transparency={centerRect:[240,200,width-480,height-400],centerPixels,centerMaxAlpha,nonzero,opaque,peak};
  if(centerMaxAlpha>1||opaque)throw new Error('Frame has visible fill in its central region');
 }
 entries.push(entry);
}
fs.writeFileSync(new URL('manifest.json',directory),JSON.stringify({generator:'built-in image_gen',date:'2026-10-11',promptFile:'prompts.txt',entries},null,2)+'\n');
console.log(JSON.stringify(entries,null,2));
