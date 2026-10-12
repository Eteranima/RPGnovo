import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';

let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++;};
const eq=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
const json=path=>JSON.parse(readFileSync(path,'utf8'));
function compile(path){const exports={};new Function('require','exports',ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(id=>{throw Error('Unexpected runtime dependency '+id);},exports);return exports;}
const catalog=compile('lib/game/autoChessCatalogV40.ts');
const legacy=compile('lib/art/autoChessArtV39.ts');
const art=compile('lib/art/autoChessArtV40.ts');
const manifest=json('art-source/v40/autochess/manifest.json');
const briefs=json('art-source/v40/autochess/briefs.json');
const selections=json('art-source/v40/autochess/selections.json');
const manual=json('art-source/v40/autochess/manual-anchor-measurements.json');
const references=json('art-source/v40/autochess/references.json');
const pieces=art.AUTO_CHESS_PIECE_ART_V40,portraits=art.AUTO_CHESS_PORTRAIT_ART_V40;
eq(manifest.complete,true,'the expansion registration is complete, rather than an intermediate staged registry');
eq(Object.keys(pieces).sort(),briefs.map(brief=>brief.id).sort(),'all eight canonical expansion characters have native animation art');
eq(Object.keys(portraits).sort(),Object.keys(pieces).sort(),'every new piece has a measured portrait crop');
eq(Object.keys({...legacy.AUTO_CHESS_PIECE_ART_V39,...pieces}).sort(),catalog.CHESS_PIECES_V40.map(piece=>piece.id).sort(),'all 31 playable pieces have final native animation art');
eq(manifest.pieces.length,8,'eight selected native sprite sheets');
eq(manifest.pixelEditingPerformed,false,'registration preserves native generated pixels');
eq(manifest.nativeBytesPreserved,true,'native PNG bytes were preserved');

function checkCrop(crop,entry,label){
 ok(Object.values(crop).every(Number.isFinite),label+': finite coordinates');
 ok(crop.x>=0&&crop.y>=0&&crop.w>0&&crop.h>0&&crop.x+crop.w<=entry.sheetWidth&&crop.y+crop.h<=entry.sheetHeight,label+': crop is inside the source');
 ok(crop.anchorX>=crop.x&&crop.anchorX<crop.x+crop.w&&crop.anchorY>=crop.y&&crop.anchorY<crop.y+crop.h,label+': anchor is inside its measured frame');
}
for(const record of manifest.pieces){
 const id=record.id,entry=pieces[id],portrait=portraits[id],piece=catalog.CHESS_PIECES_V40.find(piece=>piece.id===id),selection=selections.find(choice=>choice.id===id);
 ok(entry&&portrait&&piece&&selection,id+': complete runtime/provenance records');
 eq(record.brief.element,piece.element,id+': artwork element follows the canonical combat kit');
 eq(record.problems,[],id+': no native inspection failures');
 eq([record.columns,record.rows],[4,3],id+': twelve-pose atlas layout');
 const bytes=readFileSync('public'+entry.src),archive=readFileSync('art-source/v40/autochess/pieces/'+id+'.png');
 eq(entry.src,'/assets/v40/autochess/pieces/'+id+'.png',id+': independent v40 asset');
 eq(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]),id+': PNG signature');
 eq([bytes[24],bytes[25]],[8,6],id+': native RGBA8 PNG');
 eq([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],[entry.sheetWidth,entry.sheetHeight],id+': registry source dimensions');
 eq([record.width,record.height],[entry.sheetWidth,entry.sheetHeight],id+': measured source dimensions');
 eq(createHash('sha256').update(bytes).digest('hex'),record.sha256,id+': inspection still applies to the exact served bytes');
 ok(bytes.equals(archive),id+': public and archived native PNGs are byte-identical');
 ok(record.alpha.zero>0,id+': genuine fully transparent pixels');
 ok(record.cells.every(cell=>cell.visiblePixels>0&&cell.edgePixels===0),id+': all frames are nonempty and isolated');
 eq(new Set(record.cells.map(cell=>cell.pixelHash)).size,12,id+': all twelve native frames are distinct');
 ok(entry.bodyHeight>30&&entry.bodyHeight<entry.sheetHeight,id+': measured body scale');
 ok(entry.facing==='left'||entry.facing==='right',id+': explicit source direction for correct ally/enemy rendering');
 eq(entry.facing,record.facing,id+': visual direction is recorded in provenance');
 for(const action of ['idle','attack','cast']){eq(entry[action].length,4,id+': four '+action+' phases');entry[action].forEach((frame,index)=>checkCrop(frame,entry,id+'/'+action+'/'+index));}
 const frames=[...entry.idle,...entry.attack,...entry.cast];
 eq(new Set(frames.map(frame=>JSON.stringify([frame.x,frame.y,frame.w,frame.h]))).size,12,id+': separate source cells for all actions');
 eq(portrait.src,entry.src,id+': portrait uses the final native atlas');
 eq([portrait.sheetWidth,portrait.sheetHeight],[entry.sheetWidth,entry.sheetHeight],id+': portrait source dimensions');
 checkCrop(portrait.crop,entry,id+'/portrait');
 const first=entry.idle[0],crop=portrait.crop;
 ok(crop.x>=first.x&&crop.y>=first.y&&crop.x+crop.w<=first.x+first.w&&crop.y+crop.h<=first.y+first.h,id+': portrait is contained in idle frame zero');
 ok(record.prompt&&record.referencePaths.length>0,id+': recorded generation prompt and references');
 for(const path of record.referencePaths)ok(readFileSync(path).length>0,id+': generation reference is available in the repository');
 if(manual[id]){eq(manual[id].sha256,record.sha256,id+': manually measured quadruped anchors are bound to the exact source');eq(frames.map(frame=>[frame.anchorX,frame.anchorY]),selection.anchors,id+': runtime retains the measured quadruped body axis');}
}
for(const reference of references){eq(createHash('sha256').update(readFileSync(reference.path)).digest('hex'),reference.sha256,reference.name+': preparatory reference native bytes');ok(reference.nativeBytesPreserved&&reference.usedForGenerationOnly,reference.name+': reference is archived without becoming player artwork');}
console.log(`Auto Chess native art v40: PASS ${checks} checks; 8 new pieces, 96 frames, 8 measured portraits, 31 playable native pieces`);
