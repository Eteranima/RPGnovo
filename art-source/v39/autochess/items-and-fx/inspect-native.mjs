import fs from 'node:fs';
import {inflateSync} from 'node:zlib';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function decodeNative(path){
 const bytes=fs.readFileSync(path),width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 if(bytes[24]!==8||bytes[25]!==6)throw Error('Native asset must be RGBA8');
 const chunks=[];for(let at=8;at<bytes.length;){const n=bytes.readUInt32BE(at);if(bytes.toString('ascii',at+4,at+8)==='IDAT')chunks.push(bytes.subarray(at+8,at+8+n));at+=12+n;}
 const raw=inflateSync(Buffer.concat(chunks)),stride=width*4,pixels=Buffer.alloc(stride*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++)for(let x=0;x<stride;x++){const filter=raw[y*(stride+1)],left=x>=4?pixels[y*stride+x-4]:0,up=y?pixels[(y-1)*stride+x]:0,corner=y&&x>=4?pixels[(y-1)*stride+x-4]:0;pixels[y*stride+x]=(raw[y*(stride+1)+x+1]+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):paeth(left,up,corner)))&255;}
 return {bytes,width,height,pixels,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
}
export function inspectNative(path,columns,rows,rowCuts,columnCuts){
 const {bytes,width,height,pixels,sha256}=decodeNative(path),alpha=(x,y)=>pixels[(y*width+x)*4+3];
 const cells=[];let zero=0,opaque=0;for(let i=3;i<pixels.length;i+=4){if(!pixels[i])zero++;if(pixels[i]===255)opaque++;}
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const x=columnCuts?.[row]?.[col]??Math.floor(col*width/columns),y=rowCuts?.[row]??Math.floor(row*height/rows),right=columnCuts?.[row]?.[col+1]??Math.floor((col+1)*width/columns),bottom=rowCuts?.[row+1]??Math.floor((row+1)*height/rows);
  let minX=right,minY=bottom,maxX=-1,maxY=-1,visible=0,edgePixels=0,edgeMaxAlpha=0;
  const hash=crypto.createHash('sha256');
  for(let py=y;py<bottom;py++)for(let px=x;px<right;px++){const a=alpha(px,py);hash.update(pixels.subarray((py*width+px)*4,(py*width+px)*4+4));if(a>=16){visible++;minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);}if(px<x+2||px>=right-2||py<y+2||py>=bottom-2){edgeMaxAlpha=Math.max(edgeMaxAlpha,a);if(a>=16)edgePixels++;}}
  cells.push({index:row*columns+col,crop:[x,y,right-x,bottom-y],visibleBounds:visible?[minX,minY,maxX-minX+1,maxY-minY+1]:null,visiblePixels:visible,edgePixels,edgeMaxAlpha,pixelHash:hash.digest('hex')});
 }
 return {path,width,height,bytes:bytes.length,sha256,alpha:{zero,opaque,total:width*height,corners:[alpha(0,0),alpha(width-1,0),alpha(0,height-1),alpha(width-1,height-1)]},columns,rows,cells};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)&&process.argv[2])console.log(JSON.stringify(inspectNative(process.argv[2],Number(process.argv[3]||6),Number(process.argv[4]||4)),null,2));
