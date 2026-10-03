import {readFileSync} from 'node:fs';

// Read the shipped PNG/WebP headers; archive-only source PNGs are not required
// in a clean checkout. This does not decode, resize or modify image content.
export function imageDimensions(path){
 const bytes=readFileSync(path);
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
 if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'){
  for(let offset=12;offset+8<=bytes.length;){
   const kind=bytes.toString('ascii',offset,offset+4),length=bytes.readUInt32LE(offset+4),data=offset+8;
   if(kind==='VP8X')return {width:bytes.readUIntLE(data+4,3)+1,height:bytes.readUIntLE(data+7,3)+1};
   if(kind==='VP8 ')return {width:bytes.readUInt16LE(data+6)&16383,height:bytes.readUInt16LE(data+8)&16383};
   if(kind==='VP8L')return {width:1+(bytes[data+1]|(bytes[data+2]&63)<<8),height:1+((bytes[data+2]>>6)|(bytes[data+3]<<2)|(bytes[data+4]&15)<<10)};
   offset=data+length+(length%2);
  }
 }
 throw new Error(`Unsupported shipped image format: ${path}`);
}
