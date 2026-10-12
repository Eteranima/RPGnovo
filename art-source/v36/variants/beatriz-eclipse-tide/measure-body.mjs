import{readFileSync}from'node:fs';
const folder='art-source/v36/variants/beatriz-eclipse-tide';
for(const kind of ['walk','attack','cast','ultimate']){
 const m=JSON.parse(readFileSync(`${folder}/${kind}-manifest.json`,'utf8'));
 console.log(JSON.stringify({kind,frames:m.measurements.map(a=>({i:a.i,crop:a.crop,head:a.headOrHatTop,sole:a.groundSole}))}));
}
