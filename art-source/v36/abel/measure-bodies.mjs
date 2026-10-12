import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),wrangler=createRequire(require.resolve('wrangler'));
const sharp=createRequire(wrangler.resolve('miniflare'))('sharp');
// Native coordinates reviewed in all twenty isolated crops: head top, anatomy left/right,
// approximate sole band and separate left/right boots. Cape, staff and fire are excluded.
const measured={
 attack:[
  [78,136,402,505,[[136,177],[296,365]]],
  [112,571,925,505,[[571,619],[813,884]]],
  [118,1001,1322,502,[[1001,1059],[1243,1322]]],
  [618,68,444,987,[[68,117],[370,444]]],
  [578,690,1021,990,[[690,744],[950,1021]]],
  [571,1171,1439,995,[[1171,1223],[1367,1405]]],
 ],
 cast:[
  [96,169,402,477,[[169,212],[313,379]]],
  [95,653,915,478,[[654,696],[844,898]]],
  [98,1120,1426,478,[[1120,1166],[1336,1395]]],
  [604,70,414,931,[[70,112],[352,414]]],
  [578,708,960,954,[[708,749],[874,932]]],
  [579,1193,1418,956,[[1193,1238],[1345,1402]]],
 ],
 ultimate:[
  [51,103,303,435,[[103,146],[236,303]]],
  [80,528,805,435,[[539,580],[739,805]]],
  [62,991,1248,435,[[991,1032],[1180,1240]]],
  [85,1445,1707,435,[[1445,1485],[1645,1707]]],
  [520,35,352,844,[[35,76],[283,346]]],
  [507,551,795,870,[[551,601],[726,795]]],
  [502,1008,1260,871,[[1008,1059],[1182,1252]]],
  [497,1444,1660,875,[[1444,1491],[1596,1660]]],
 ],
};
const registry={},sources=[];
for(const [kind,poses] of Object.entries(measured)){
 const source=`public/assets/v29/abel/${kind}.png`,bytes=readFileSync(source),manifest=JSON.parse(readFileSync(`art-source/v29/abel/${kind}-manifest.json`,'utf8'));
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(sha256!==manifest.runtimeSha256)throw Error(`${kind}: approved source changed`);
 const key=`battle_abel_${kind}`;
 registry[key]=poses.map(([headTop,left,right,approximateSole,boots],frame)=>{
  let soleY=-1,footLeft=Infinity,footRight=-Infinity;
  for(const [start,end] of boots)for(let y=approximateSole-14;y<=Math.min(info.height-1,approximateSole+10);y++)for(let x=start;x<=end;x++)if(data[(y*info.width+x)*4+3]>24){soleY=Math.max(soleY,y);}
  if(soleY<0)throw Error(`${kind}/${frame}: no boot alpha`);
  for(const [start,end] of boots)for(let y=soleY-8;y<=soleY;y++)for(let x=start;x<=end;x++)if(data[(y*info.width+x)*4+3]>24){footLeft=Math.min(footLeft,x);footRight=Math.max(footRight,x);}
  const anchorX=(footLeft+footRight)/2;
  return{frame,headTop,soleY,anchorX,left,right,crouched:kind==='cast'&&frame===3||kind==='attack'&&frame===3||kind==='ultimate'&&frame===4,wideStance:kind==='attack'&&(frame===1||frame===3)||kind==='cast'&&frame===3||kind==='ultimate'&&frame===4,sourceCrop:manifest.frames[frame],boots,footBand:{left:footLeft,right:footRight,y:soleY-8,height:9},bodyHeight:soleY-headTop};
 });
 sources.push({key,source,sha256,width:info.width,height:info.height});
}
const proof={version:36,id:'abel',method:'Individual native pose review: hair/head top and anatomy lateral limits; alpha>24 sole and midpoint of two isolated boot bands. Staff, cape edges, fire and lion excluded from body metrics.',sources,poses:registry,rendering:'Native RGBA/crop rectangles remain unchanged. Only body metrics and foot presentation anchors are used by the canvas. Complete artwork may extend beyond the body lane; body fits stage/own lane. Natural wide crouches may constrain anatomical scale.'};
writeFileSync('art-source/v36/abel/body-measurements.json',JSON.stringify(proof,null,2)+'\n');
const slim=Object.fromEntries(Object.entries(registry).map(([key,poses])=>[key,poses.map(({headTop,soleY,anchorX,left,right,crouched,wideStance})=>({headTop,soleY,anchorX,left,right,crouched,wideStance}))]));
writeFileSync('lib/game/abelBodyArtV36.ts',`/** Native body coordinates; provenance and boot bands: art-source/v36/abel/body-measurements.json. */\nexport type AbelBodyMetricV36={headTop:number;soleY:number;anchorX:number;left:number;right:number;crouched:boolean;wideStance:boolean};\nexport const ABEL_BODY_METRICS_V36:Record<string,readonly AbelBodyMetricV36[]>=${JSON.stringify(slim,null,2)};\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(registry).map(([key,poses])=>[key,poses.map(({headTop,soleY,anchorX,bodyHeight})=>({headTop,soleY,anchorX,bodyHeight}))])),null,2));
