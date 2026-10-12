import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(),file=path.join(root,'art-source/v40/autochess/references.json');
const references=JSON.parse(fs.readFileSync(file,'utf8'));
for(const reference of references){
 if(!/^[a-z-]+$/.test(reference.name))throw Error('Invalid native reference name');
 const bytes=fs.readFileSync(reference.source),target=path.resolve(root,reference.path),directory=path.resolve(root,'art-source/v40/autochess/references');
 if(path.dirname(target)!==directory)throw Error('Reference destination outside its archive');
 fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(target,bytes);
 if(!bytes.equals(fs.readFileSync(target)))throw Error('Native reference bytes changed');
 reference.sha256=crypto.createHash('sha256').update(bytes).digest('hex');reference.nativeBytesPreserved=true;
}
fs.writeFileSync(file,JSON.stringify(references,null,2)+'\n');
console.log(JSON.stringify({archivedReferences:references.length,nativeBytesPreserved:true}));
