import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';

let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++;};
const eq=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
const readJSON=path=>JSON.parse(readFileSync(path,'utf8'));
function compile(path){
 const exports={};
 new Function('require','exports',ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(id=>{throw Error('Unexpected runtime dependency '+id);},exports);
 return exports;
}
const catalog=compile('lib/game/autoChessCatalogV39.ts');
const art=compile('lib/art/autoChessArtV39.ts');
const manifest=readJSON('art-source/v39/autochess/manifest.json');
const shared=readJSON('art-source/v39/autochess/items-and-fx/manifest.json');
const pieces=art.AUTO_CHESS_PIECE_ART_V39,items=art.AUTO_CHESS_ITEM_ART_V39,effects=art.AUTO_CHESS_EFFECT_ART_V39;
eq(Object.keys(pieces).sort(),catalog.CHESS_PIECES_V39.map(piece=>piece.id).sort(),'every shop, companion and alternate piece has native animation art');
eq(Object.keys(items).sort(),[...catalog.CHESS_COMPONENTS_V39,...catalog.CHESS_ITEMS_V39].map(item=>item.id).sort(),'every component and crafted item has its final native icon');
eq(Object.keys(effects).sort(),['craft','fusion','victory'],'all league feedback animations are registered');
eq(manifest.pixelEditingPerformed,false,'registration preserves generated artwork');
eq(manifest.nativeBytesPreserved,true,'registered source bytes are preserved');

const records=[...manifest.pieces,...manifest.companions,...shared.entries,...manifest.scenes];
const bySource=new Map(records.map(record=>[record.path,record]));
const companionSources=new Set(manifest.companions.map(record=>record.path));
const assets=new Set([art.AUTO_CHESS_SPLASH_V39,...art.AUTO_CHESS_BOARDS_V39.map(board=>board.src),...Object.values(pieces).map(piece=>piece.src),...Object.values(items).map(item=>item.src),...Object.values(effects).map(effect=>effect.src)]);
eq(assets.size,31,'the runtime uses all 31 final native PNGs');
eq(bySource.size,assets.size,'each runtime PNG has provenance and validation metadata');
for(const src of assets){
 const record=bySource.get(src);ok(record,src+': recorded native source');
 const archived=src.replace('/assets/v39/autochess/','').replace(/^pieces\//,companionSources.has(src)?'companions/':'pieces/');
 const bytes=readFileSync('public'+src),source=readFileSync('art-source/v39/autochess/'+archived);
 eq(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]),src+': PNG signature');
 eq([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],[record.width,record.height],src+': dimensions match the measured source');
 eq(createHash('sha256').update(bytes).digest('hex'),record.sha256,src+': validation still applies to the exact runtime bytes');
 ok(bytes.equals(source),src+': archived native and public PNGs are byte-identical');
 if(record.cells){
  eq(bytes[25],6,src+': RGBA PNG');ok(record.alpha.zero>0,src+': genuine fully transparent pixels');
  ok(record.cells.every(cell=>cell.visiblePixels>0&&cell.edgePixels===0),src+': nonempty isolated frames');
  eq(new Set(record.cells.map(cell=>cell.pixelHash)).size,record.cells.length,src+': distinct native frame pixels');
 }
}
function checkCrop(crop,entry,label){
 ok(Object.values(crop).every(Number.isFinite),label+': finite crop and anchor coordinates');
 ok(crop.x>=0&&crop.y>=0&&crop.w>0&&crop.h>0&&crop.x+crop.w<=entry.sheetWidth&&crop.y+crop.h<=entry.sheetHeight,label+': crop is contained in its source');
 ok(crop.anchorX>=crop.x&&crop.anchorX<crop.x+crop.w&&crop.anchorY>=crop.y&&crop.anchorY<crop.y+crop.h,label+': ground anchor is inside its frame');
}
for(const[id,entry]of Object.entries(pieces)){
 const record=bySource.get(entry.src);
 eq([entry.sheetWidth,entry.sheetHeight],[record.width,record.height],id+': registry dimensions match source');
 ok(entry.bodyHeight>30&&entry.bodyHeight<entry.sheetHeight,id+': measured body scale');
 for(const action of ['idle','attack','cast']){eq(entry[action].length,4,id+': four '+action+' keyframes');entry[action].forEach((frame,index)=>checkCrop(frame,entry,id+'/'+action+'/'+index));}
 eq(new Set([...entry.idle,...entry.attack,...entry.cast].map(frame=>JSON.stringify([frame.x,frame.y,frame.w,frame.h]))).size,12,id+': actions reference twelve separate source cells');
}
for(const[id,entry]of Object.entries(items))checkCrop(entry.crop,entry,'item/'+id);
for(const[id,entry]of Object.entries(effects)){
 eq(entry.frames.length,24,id+': complete feedback animation');entry.frames.forEach((frame,index)=>checkCrop(frame,entry,id+'/'+index));
}
for(const board of art.AUTO_CHESS_BOARDS_V39){
 const record=bySource.get(board.src),bounds=board.tileBounds;
 eq(record.width,record.height,board.id+': square orthographic board');
 ok(bounds.x>=0&&bounds.y>=0&&bounds.width>0&&bounds.height>0&&bounds.x+bounds.width<=1&&bounds.y+bounds.height<=1,board.id+': grid lies within the board');
 eq(bounds.width,bounds.height,board.id+': square logical grid');
 eq(bounds,art.AUTO_CHESS_BOARDS_V39[0].tileBounds,board.id+': themes share the same cell geometry');
}
console.log(`Auto Chess native art v39: PASS ${checks} checks; ${Object.keys(pieces).length} pieces, ${Object.keys(items).length} items, ${Object.keys(effects).length} effects, ${assets.size} PNGs`);
