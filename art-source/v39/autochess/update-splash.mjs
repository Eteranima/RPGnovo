import fs from 'node:fs';
import crypto from 'node:crypto';
const root='art-source/v39/autochess/';
const final=JSON.parse(fs.readFileSync(root+'splash-final.json','utf8'));
const bytes=fs.readFileSync(final.source);
for(const target of [root+'splash.png','public/assets/v39/autochess/splash.png'])fs.writeFileSync(target,bytes);
const selections=JSON.parse(fs.readFileSync(root+'selections.json','utf8')).map(row=>row.id==='splash'?final:row);
fs.writeFileSync(root+'selections.json',JSON.stringify(selections,null,2)+'\n');
console.log(JSON.stringify({asset:'splash',bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
