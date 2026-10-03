// Read-only pixel measurements. Never paints, filters, rescales or rewrites art.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
for (const path of process.argv.slice(2)) {
  const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h}=info;let clear=0,opaque=0,visibleEdge=0;
  for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]===255)opaque++;}
  for(let x=0;x<w;x++){if(data[x*4+3]>24)visibleEdge++;if(data[((h-1)*w+x)*4+3]>24)visibleEdge++;}for(let y=1;y<h-1;y++){if(data[(y*w)*4+3]>24)visibleEdge++;if(data[(y*w+w-1)*4+3]>24)visibleEdge++;}
  const points=[[0,0],[.5,.01],[.01,.5],[.99,.5],[.1,.1],[.9,.1],[.1,.9],[.9,.9],[.5,.5]];
  console.log(JSON.stringify({path,width:w,height:h,clear,opaque,visibleEdge,clearPercent:clear/(w*h)*100,samples:points.map(([x,y])=>({xy:[x,y],rgba:[...data.subarray((Math.floor(y*(h-1))*w+Math.floor(x*(w-1)))*4,(Math.floor(y*(h-1))*w+Math.floor(x*(w-1)))*4+4)]}))}));
}
