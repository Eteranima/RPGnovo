import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{readFileSync,writeFileSync,mkdirSync,existsSync}from'node:fs';
const folder='art-source/v36/variants/beatriz-eclipse-tide';
for(const path of process.argv.slice(2)){
 const{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true}),hist=new Uint32Array(256);
 for(let i=3;i<data.length;i+=4)hist[data[i]]++;
 console.log(JSON.stringify({path,w:info.width,h:info.height,zero:hist[0],alpha1to24:hist.slice(1,25).reduce((a,b)=>a+b,0),corners:[data[3],data[(info.width-1)*4+3],data[(info.width*(info.height-1))*4+3],data.at(-1)]}));
}
for(const kind of ['walk','attack','cast','ultimate','vfx','icons']){
 const p=`${folder}/${kind}-manifest.json`;if(!existsSync(p))continue;
 const m=JSON.parse(readFileSync(p,'utf8')), {data,info}=await sharp(m.runtime).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let seamMax=0,seamNonZero=0,edgeMax=0,edgeNonZero=0;
 for(const cell of m.measurements.map(a=>a.cell))for(let y=cell.y;y<cell.y+cell.h;y++)for(let x=cell.x;x<cell.x+cell.w;x++){
  if(x!==cell.x&&x!==cell.x+cell.w-1&&y!==cell.y&&y!==cell.y+cell.h-1)continue;
  const a=data[(y*info.width+x)*4+3],outer=x===0||y===0||x===info.width-1||y===info.height-1;
  if(outer){edgeMax=Math.max(edgeMax,a);if(a)edgeNonZero++;}else{seamMax=Math.max(seamMax,a);if(a)seamNonZero++;}
 }
 const result={kind,seamMax,seamNonZero,edgeMax,edgeNonZero};writeFileSync(`${folder}/${kind}-alpha-proof.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 const candidates=[];
 for(const y of m.rowCuts.slice(1,-1)){let min=info.width,best=-1;for(let p=Math.max(1,y-25);p<=Math.min(info.height-2,y+25);p++){let count=0;for(let x=0;x<info.width;x++)if(data[(p*info.width+x)*4+3])count++;if(count<min){min=count;best=p;}}candidates.push({axis:'row',near:y,best,minNonzero:min});}
 for(let row=0;row<m.rows;row++)for(let col=1;col<m.cols;col++){const cell=m.measurements[row*m.cols+col].cell,x=cell.x;let min=info.height,best=-1;for(let p=Math.max(1,x-25);p<=Math.min(info.width-2,x+25);p++){let count=0;for(let y=cell.y;y<cell.y+cell.h;y++)if(data[(y*info.width+p)*4+3])count++;if(count<min){min=count;best=p;}}candidates.push({axis:'column',row,near:x,best,minNonzero:min});}
 console.log(JSON.stringify({kind,candidates}));
 if(kind==='walk'){mkdirSync(`${folder}/proofs`,{recursive:true});for(const i of [0,1,2,4,7,10]){const f=m.frames[i];await sharp(m.runtime).extract({left:f.x,top:f.y,width:f.w,height:f.h}).png().toFile(`${folder}/proofs/walk-${i}.png`);}}
}
