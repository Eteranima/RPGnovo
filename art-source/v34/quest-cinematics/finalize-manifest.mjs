import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd(),base='art-source/v34/quest-cinematics';
const sources={
 'long-tinta':{service:'Gemini included video generation',url:'https://gemini.google.com/app/8413f3d5ee4e4746',keyframe:'long-tinta.png',prompt:'long-tinta-video-prompt.txt'},
 'long-geada':{service:'Gemini included video generation',url:'https://gemini.google.com/app/8432dbf4cb25b763',keyframe:'long-geada.png',prompt:'long-geada-video-prompt.txt'},
 'long-brasa':{service:'Gemini included video generation',url:'https://gemini.google.com/app/5a0b33b7cf84269c',keyframe:'long-brasa-corrected.png',prompt:'long-brasa-corrected-video-prompt.txt'},
 'long-trovao':{service:'Google Flow, requested Veo 3.1 Fast, 20 included credits',url:'https://flow.google.com/project/90e01ebe-d74c-4587-897e-c072f44fa1d9/edit/39a9fdc4-b1d5-44c6-935e-065f410cdf90',keyframe:'long-trovao.png',prompt:'long-trovao-video-prompt.txt'},
 'long-nulo':{service:'Google Flow, requested Veo 3.1 Fast, 20 included credits',url:'https://flow.google.com/project/90e01ebe-d74c-4587-897e-c072f44fa1d9/edit/1e28d87a-1842-4dd2-af6e-148e4e9cfbb4',keyframe:'long-nulo.png',prompt:'long-nulo-video-prompt.txt'}
};
const hash=filename=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,filename))).digest('hex');
const films=Object.entries(sources).map(([id,source])=>{
 const verification=JSON.parse(fs.readFileSync(path.join(root,'docs/qa-v34/media',id+'-verification.json'),'utf8'));
 const keyframe=base+'/keyframes/'+source.keyframe,prompt=base+'/'+source.prompt;
 if(fs.statSync(path.join(root,prompt)).size<100)throw new Error('Missing source prompt: '+id);
 return {id,...source,keyframe,keyframeSHA256:hash(keyframe),prompt,promptSHA256:hash(prompt),verification:'docs/qa-v34/media/'+id+'-verification.json',...verification};
});
const manifest={version:34,created:'2026-10-04',project:'Éter Anima — Missões longas 24 fps',films,
 production:{keyframes:'Six original image generations/edits with canonical references; prompts in image-prompts.json and long-brasa-corrected-image-prompt.txt.',sourceDelivery:'Downloads through visible Gemini/Flow controls only. Original encoded sources retained.',export:'Native1280x720 H26424fps; stream copy, audio removed, faststart. No duplication/interpolation/retiming. Full decoded source/runtime frame equality verified.',runtimeTotalBytes:films.reduce((sum,f)=>sum+f.bytes,0),runtimeTotalFrames:films.reduce((sum,f)=>sum+f.frames,0),runtimeTotalSeconds:films.reduce((sum,f)=>sum+f.durationSeconds,0)},
 includedQuota:{flowCreditsBefore:70,flowGenerations:3,flowCreditsUsed:60,flowCreditsAfter:10,flowCosts:[{id:'long-brasa-original-rejected',credits:20},{id:'long-trovao',credits:20},{id:'long-nulo',credits:20}],geminiGenerations:3,purchases:0,upgrades:0,flowRemainingObserved:'10 credits in account panel after final download'},
 rejected:[{id:'long-brasa-original',source:base+'/rejected/long-brasa-wings-fire.mp4',sourceSHA256:hash(base+'/rejected/long-brasa-wings-fire.mp4'),url:'https://flow.google.com/project/90e01ebe-d74c-4587-897e-c072f44fa1d9/edit/7965abbf-4a86-49c0-a91e-3525557b5437',reason:'Dante opened wings beyond framing and brazier intensified. Replaced with new restrained keyframe and native10s film.',verification:base+'/rejected/long-brasa-wings-fire-verification.json'}]};
fs.writeFileSync(path.join(root,base,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({films:films.length,frames:manifest.production.runtimeTotalFrames,seconds:manifest.production.runtimeTotalSeconds,bytes:manifest.production.runtimeTotalBytes}));
