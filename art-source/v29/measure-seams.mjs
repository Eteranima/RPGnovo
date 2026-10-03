// Read-only per-axis transparency measurements for native crop boundaries.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const[path,colsArg='3',rowsArg='2']=process.argv.slice(2),cols=+colsArg,rows=+rowsArg;
const{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});const{width:w,height:h}=info;
const xx=new Uint32Array(w),yy=new Uint32Array(h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>24){xx[x]++;yy[y]++;}
const gaps=(arr,n)=>{const out=[];for(let i=1;i<n;i++){const e=arr.length*i/n,r=Math.floor(arr.length/n*.24),l=Math.max(0,Math.round(e-r)),b=Math.min(arr.length,Math.round(e+r));let min=Infinity;for(let j=l;j<b;j++)min=Math.min(min,arr[j]);const runs=[];let s=-1;for(let j=l;j<=b;j++){if(j<b&&arr[j]===min){if(s<0)s=j;}else if(s>=0){runs.push([s,j-1]);s=-1;}}runs.sort((a,b)=>(b[1]-b[0])-(a[1]-a[0])||Math.abs((a[0]+a[1])/2-e)-Math.abs((b[0]+b[1])/2-e));out.push({expected:e,min,runs:runs.slice(0,5),suggested:runs.length?Math.round((runs[0][0]+runs[0][1])/2):Math.round(e)});}return out;};
console.log(JSON.stringify({path,w,h,columnSeams:gaps(xx,cols),rowSeams:gaps(yy,rows)},null,2));
