import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const sources={"carmilla":"exec-c313c6d9-de9d-452c-89ad-a6b174b5077d.png","beatriz":"exec-36367d09-01e6-458d-a67a-32f0af8f1431.png","abel":"exec-b8890814-3caf-4461-90ca-10f39c50bc5f.png","orfeu":"exec-ea97ea63-0c27-4c1c-9a62-70006743d1b6.png"},base='C:/Users/Diego/.codex/generated_images/01a1028e-5be8-7663-82a1-e9f4a5e52f9d/';
for(const [id,file] of Object.entries(sources)){
 const img=sharp(base+file),meta=await img.metadata();const {data,info}=await img.ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let clear=0,partial=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;else if(data[i]<255)partial++;}
 const alpha=(x,y)=>data[(y*info.width+x)*4+3];
 console.log(JSON.stringify({id,width:info.width,height:info.height,hasAlpha:meta.hasAlpha,clear,partial,cornerAlpha:alpha(0,0),ringCenter:alpha(270,725),hpTrack:alpha(1000,590),mpTrack:alpha(1000,820)}));
}
