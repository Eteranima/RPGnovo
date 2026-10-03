// Read-only atlas measurements. Alpha >24 counts visible art; alpha0 is separately measured.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const[path,colsArg='3',rowsArg='2']=process.argv.slice(2),cols=+colsArg,rows=+rowsArg;
const{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});const{width:w,height:h}=info;
const report=[];
for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const l=Math.round(col*w/cols),t=Math.round(row*h/rows),r=Math.round((col+1)*w/cols),b=Math.round((row+1)*h/rows);let x0=r,y0=b,x1=l,y1=t,n=0,edges=0,zero=0;
 for(let y=t;y<b;y++)for(let x=l;x<r;x++){const a=data[(y*w+x)*4+3];if(a===0)zero++;if(a<=24)continue;n++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);if(x===l||x===r-1||y===t||y===b-1)edges++;}
 report.push({i:row*cols+col,row,col,cell:[l,t,r-l,b-t],bounds:[x0,y0,x1-x0+1,y1-y0+1],gutters:[x0-l,y0-t,r-1-x1,b-1-y1],visible:n,visibleEdge:edges,alphaZero:zero});
}
console.log(JSON.stringify({path,width:w,height:h,cols,rows,frames:report},null,2));
