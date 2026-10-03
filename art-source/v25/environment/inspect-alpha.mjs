// Reads PNG pixels only to measure alpha bounds; preserves generated image bytes.
import {readFileSync, writeFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {resolve} from 'node:path';

function pixels(path) {
 const png=readFileSync(path),parts=[];let width,height,depth,type;
 for(let offset=8;offset<png.length;){const size=png.readUInt32BE(offset),kind=png.toString('ascii',offset+4,offset+8),data=png.subarray(offset+8,offset+8+size);if(kind==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);depth=data[8];type=data[9];}if(kind==='IDAT')parts.push(data);offset+=size+12;}
 if(depth!==8||type!==6)throw new Error(`Expected 8-bit RGBA PNG: ${path}`);
 const raw=inflateSync(Buffer.concat(parts)),stride=width*4,out=Buffer.alloc(height*stride);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[y*(stride+1)];for(let x=0;x<stride;x++){const a=x>=4?out[y*stride+x-4]:0,b=y?out[(y-1)*stride+x]:0,c=y&&x>=4?out[(y-1)*stride+x-4]:0;let value=raw[y*(stride+1)+1+x];if(filter===1)value+=a;else if(filter===2)value+=b;else if(filter===3)value+=Math.floor((a+b)/2);else if(filter===4)value+=paeth(a,b,c);out[y*stride+x]=value&255;}}
 return {width,height,out};
}
function bounds(path,rects){const {width,height,out}=pixels(path);let alphaPixels=0;for(let i=3;i<out.length;i+=4)if(out[i]===0)alphaPixels++;const crops=rects.map(([rx,ry,rw,rh])=>{let x0=rx+rw,y0=ry+rh,x1=rx,y1=ry;for(let y=ry;y<ry+rh;y++)for(let x=rx;x<rx+rw;x++){if(out[(y*width+x)*4+3]<20)continue;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return {x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,anchorX:(x0+x1)/2,anchorY:y1-2};});return {width,height,transparentPixels:alphaPixels,crops};}
const academyRects=[[0,0,400,420],[400,0,340,420],[740,0,335,420],[1075,0,373,420],...[0,362,724,1086].map(x=>[x,420,362,246]),...[0,362,724,1086].map(x=>[x,666,362,420])];
const ruinsRects=[...[0,362,724,1086].map(x=>[x,0,362,400]),...[0,362,724,1086].map(x=>[x,400,362,321]),[0,721,402,365],[402,721,327,365],[729,721,376,365],[1105,721,343,365]];
const report={academy:bounds(resolve('public/assets/v25/environment/scenery-academy.png'),academyRects),ruins:bounds(resolve('public/assets/v25/environment/scenery-ruins.png'),ruinsRects)};
writeFileSync(resolve('art-source/v25/environment/sprite-bounds.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
