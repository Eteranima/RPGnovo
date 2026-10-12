import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';

const compile=file=>{const exports={};new Function('require','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(id=>{throw Error('Unexpected runtime dependency '+id);},exports);return exports;};
const old=compile('lib/art/autoChessArtV39.ts').AUTO_CHESS_PIECE_ART_V39,newArt=compile('lib/art/autoChessArtV40.ts').AUTO_CHESS_PIECE_ART_V40,pieces={...old,...newArt};
const legacy=JSON.parse(fs.readFileSync('art-source/v39/autochess/manifest.json','utf8')),expansion=JSON.parse(fs.readFileSync('art-source/v40/autochess/manifest.json','utf8'));
const records=new Map([...legacy.pieces,...legacy.companions,...expansion.pieces].map(record=>[record.path,record]));
const result={},measurements=[],margin=10;
let checks=0;const check=(value,message)=>{if(!value)throw Error(message);checks++;};
check(Object.keys(pieces).length===31,'Need all 31 native playable pieces');
for(const[id,entry]of Object.entries(pieces)){
 const record=records.get(entry.src),frame=entry.idle[0];check(record&&record.cells[0].visibleBounds,id+': native idle source measurement');
 const bytes=fs.readFileSync('public'+entry.src);check(crypto.createHash('sha256').update(bytes).digest('hex')===record.sha256,id+': measurements require unchanged native bytes');
 const[x,y,w,h]=record.cells[0].visibleBounds;
 const left=Math.max(frame.x,x-margin),top=Math.max(frame.y,y-margin),right=Math.min(frame.x+frame.w,x+w+margin),bottom=Math.min(frame.y+frame.h,y+h+margin);
 const crop={x:left,y:top,w:right-left,h:bottom-top,anchorX:Math.max(left,Math.min(right-1,frame.anchorX)),anchorY:Math.max(top,Math.min(bottom-1,frame.anchorY))};
 check(crop.x<=x&&crop.y<=y&&crop.x+crop.w>=x+w&&crop.y+crop.h>=y+h,id+': full native silhouette remains visible');
 check(crop.x>=frame.x&&crop.y>=frame.y&&crop.x+crop.w<=frame.x+frame.w&&crop.y+crop.h<=frame.y+frame.h,id+': never include a neighboring pose');
 result[id]={src:entry.src,sheetWidth:entry.sheetWidth,sheetHeight:entry.sheetHeight,crop};
 measurements.push({id,path:entry.src,sha256:record.sha256,visibleBounds:record.cells[0].visibleBounds,sourceCell:frame,crop,margin,alphaVisibilityThreshold:16,widthReduction:1-crop.w/frame.w,heightReduction:1-crop.h/frame.h,nativeBytesPreserved:true});
}
const registry='lib/art/autoChessIdleArtV41.ts';
fs.writeFileSync(registry,"import type {AutoChessItemArtV39} from './autoChessArtV39';\n\n// Compact idle[0] viewports preserve the complete native silhouette plus up to 10px transparent margin. PNGs are unchanged.\nexport const AUTO_CHESS_IDLE_ART_V41:Record<string,AutoChessItemArtV39>="+JSON.stringify(result,null,2)+';\n');
fs.writeFileSync('art-source/v41/autochess/idle-crops.json',JSON.stringify({date:'2026-10-12',checks,registry,pieces:measurements,margin,alphaVisibilityThreshold:16,pixelEditingPerformed:false,nativeBytesPreserved:true},null,2)+'\n');
console.log(JSON.stringify({registered:true,checks,compactIdleCrops:Object.keys(result).length,registry,pixelEditingPerformed:false}));
