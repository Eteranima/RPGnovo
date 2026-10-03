import{copyFileSync,existsSync,readFileSync,writeFileSync}from'node:fs';
for(const id of['carmilla','beatriz','abel','orfeu']){const dir='art-source/v27/cards/'+id,card='public/assets/v27/cards/'+id+'/card-frame.png';if(!existsSync(dir+'/card-frame-blue-original.png'))copyFileSync(card,dir+'/card-frame-blue-original.png');if(!existsSync(dir+'/manifest-blue-original.json'))copyFileSync(dir+'/manifest.json',dir+'/manifest-blue-original.json');}
console.log('Four original navy frames and manifests archived without changing the runtime assets.');
