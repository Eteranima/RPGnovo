// Preserve generated rejected variants and their exact prompts; no image processing.
import{readFileSync,writeFileSync,copyFileSync,mkdirSync}from'node:fs';import{createHash}from'node:crypto';
const variants=JSON.parse(readFileSync('art-source/v30/rejected-variants.json','utf8'));
for(const[v,a]of variants.entries()){const dir='art-source/v30/'+a.group+'/'+a.id+'/rejected';mkdirSync(dir,{recursive:true});const name=a.kind+'-'+v;copyFileSync(a.source,dir+'/'+name+'.png');writeFileSync(dir+'/'+name+'-prompt.txt',a.prompt+'\n');const hash=createHash('sha256').update(readFileSync(a.source)).digest('hex');writeFileSync(dir+'/'+name+'-manifest.json',JSON.stringify({...a,archive:dir+'/'+name+'.png',sourceSha256:hash},null,2)+'\n');}
console.log(variants.length+' rejected variants archived without pixel changes');
