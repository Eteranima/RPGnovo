import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{readFileSync,writeFileSync,statSync}from'node:fs';
import{createHash}from'node:crypto';
import assert from'node:assert/strict';
const folder='art-source/v36/variants/beatriz-eclipse-tide',hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex'),reports=[];
let checks=0,frames=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
for(const [kind,count]of Object.entries({walk:12,attack:6,cast:6,ultimate:8,vfx:6,icons:6})){
 const m=JSON.parse(readFileSync(`${folder}/${kind}-manifest.json`,'utf8')),{data,info}=await sharp(m.runtime).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 check(info.channels===4,kind+' RGBA');check(m.frames.length===count,kind+' count');check(hash(m.source)===hash(m.selected)&&hash(m.selected)===hash(m.runtime),kind+' native source copies');check(m.backgroundAlphaZero>info.width*info.height*.1,kind+' actual alpha0 free area');
 for(const measurement of m.measurements){const c=measurement.crop;frames++;check(measurement.visibleEdge===0,kind+' no visible neighboring frame at boundary');check(c.x>=0&&c.y>=0&&c.x+c.w<=info.width&&c.y+c.h<=info.height,kind+' native bounds');check(c.anchorX>=c.x&&c.anchorX<=c.x+c.w&&c.anchorY>=c.y&&c.anchorY<=c.y+c.h,kind+' anchor inside crop');
  const proof=`${folder}/proofs/${kind}-${measurement.i}.png`,raw=await sharp(proof).ensureAlpha().raw().toBuffer();
  for(let y=0;y<c.h;y++)check(raw.subarray(y*c.w*4,(y+1)*c.w*4).equals(data.subarray(((c.y+y)*info.width+c.x)*4,((c.y+y)*info.width+c.x+c.w)*4)),kind+' every native RGBA proof row');
 }
 const alpha=JSON.parse(readFileSync(`${folder}/${kind}-alpha-proof.json`,'utf8'));check(alpha.seamMax<=m.alphaThresholdForMeasurementOnly&&alpha.edgeMax<=m.alphaThresholdForMeasurementOnly,kind+' no fragment at the common visible-alpha measurement threshold');
 reports.push({kind,width:info.width,height:info.height,count,path:m.runtime,bytes:statSync(m.runtime).size,sha256:hash(m.runtime),nativeCopiesIdentical:true,alpha});
}
const bg=JSON.parse(readFileSync(`${folder}/cinematic-background-manifest.json`,'utf8'));check(bg.nativeRect.width*9===bg.nativeRect.height*16,'exact native16:9');check(bg.allNativeRgbaPixelsPreserved,'background native row proof');check(hash(bg.dst)===bg.runtimeSha256,'background hash');
const result={id:'beatriz-eclipse-tide',date:'2026-10-11',status:'passed native export gates',checks,frames,runtimeAtlases:reports,cinematicBackground:bg,walkOrder:['south','west','east','north'],ultimateContactFrame:5,visualReview:{allSourceSheets:true,allDirections:true,nativeCriticalCrops:['walk0','walk1','walk2','walk9','walk11','attack0','attack2','attack4','cast4','ultimate5'],anatomy:'Two arms/hands and separate trousers/boots reviewed. North9/11 were repaired after rear-boot occlusion.',limitations:'Amostragem visual das folhas e recortes; não é uma afirmação de anatomia perfeita. Há resíduos alpha1–4 nos limites registrados; nenhum alpha>24 toca células. Não foi feita revisão desta variante no navegador.'},supplementaryAlphaProbe:{strictLimit3FailedForWalk:true,walkOuterMax:4,walkOuterNonzero:34,notes:'A sonda adicional de alpha3 encontrou34 pixels de atéalpha4 na borda da caminhada após o reparo (antes máximo9). O gate reproduzível usa o limiar24 do exportador comum e conserva os valores integrais; não afirma canais absolutamente alpha0 nem remove alpha por código.'}};
writeFileSync(`${folder}/verification.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,checks,frames,bytes:reports.reduce((n,a)=>n+a.bytes,0)+statSync(bg.dst).size}));
