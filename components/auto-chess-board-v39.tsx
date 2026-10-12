'use client';

import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ASSETS,combatImpact,type CombatElement} from '@/lib/game/data';
import {SPRITE_FRAMES,type SpriteCrop} from '@/lib/game/sprites';
import {COMPANION_ART_V31,type CompanionId} from '@/lib/art/companionsV31';
import {chessPieceByIdV39,type ChessPieceV39} from '@/lib/game/autoChessCatalogV39';
import type {ChessFightV39,ChessFightUnitV39} from '@/lib/game/autoChessCombatV39';
import {chessReplayUnits,chessReplayPose,chessReplayEffects,chessReplayImpact,chessReplayZones} from '@/lib/art/chessReplayTimeline';
import styles from './auto-chess-v39.module.css';

export type ChessNativePieceArtV39={src:string;sheetWidth?:number;sheetHeight?:number;bodyHeight?:number;facing?:'left'|'right';idle:SpriteCrop[];attack:SpriteCrop[];cast:SpriteCrop[]};
export type ChessNativeEffectArtV39={src:string;frames:SpriteCrop[];sheetWidth?:number;sheetHeight?:number};
export type ChessBoardArtV39={id:string;name:string;src:string;tileBounds?:{x:number;y:number;width:number;height:number}};
export type ChessVisualArtV39={pieces?:Record<string,ChessNativePieceArtV39>;effects?:Partial<Record<CombatElement|'fusion'|'craft'|'victory',ChessNativeEffectArtV39>>};

/** This is a view of the stored fight. Seeking never executes the battle again. */
export function chessReplayUnitsV39(fight:ChessFightV39,tick:number):ChessFightUnitV39[]{
 return chessReplayUnits(fight,tick);
}
export function chessCellPointV39(cell:number,size:number){return {x:(cell%8+.5)*size/8,y:(Math.floor(cell/8)+.5)*size/8};}
export function chessPieceMirroredV40(side:'ally'|'enemy',facing:'left'|'right'='right'){return (side==='enemy')!==(facing==='left');}
export const CHESS_PAINT_PADDING_V39=.04;
export function chessPaintGeometryV39(paintSize:number){const logicalSize=paintSize/(1+2*CHESS_PAINT_PADDING_V39);return {paintSize,logicalSize,origin:logicalSize*CHESS_PAINT_PADDING_V39,cellSize:logicalSize/8};}
export function chessPieceVerticalV39(centerY:number,cellSize:number,bodyHeight:number,scale:number){const feetY=centerY+cellSize*.32,headY=feetY-bodyHeight*scale;return {feetY,headY,barY:headY-cellSize*.10,shieldY:headY-cellSize*.112,starsY:feetY+cellSize*.15};}
export function chessKeyboardCellV39(cell:number,key:string){const row=Math.floor(cell/8),col=cell%8;return key==='ArrowLeft'?row*8+Math.max(0,col-1):key==='ArrowRight'?row*8+Math.min(7,col+1):key==='ArrowUp'?Math.max(0,row-1)*8+col:key==='ArrowDown'?Math.min(7,row+1)*8+col:cell;}
export function chessPlacementAllowedV39(cell:number){return Number.isInteger(cell)&&cell>=32&&cell<64;}

const images=new Map<string,Promise<HTMLImageElement|null>>(),resolvedImages=new Set<string>(),activeScopes=new Set<Set<string>>(),queue:Array<()=>void>=[];let pending=0;
const pump=()=>{while(pending<6&&queue.length){pending++;queue.shift()!();}};
/** A queued image gets its full deadline only after it actually starts loading. */
export function loadChessNativeImageV39(src:string):Promise<HTMLImageElement|null>{
 if(images.has(src))return images.get(src)!;
 let settle!:(image:HTMLImageElement|null)=>void;const promise=new Promise<HTMLImageElement|null>(resolve=>{settle=resolve;});images.set(src,promise);
 queue.push(()=>{const image=new Image();let finished=false;const done=(value:HTMLImageElement|null)=>{if(finished)return;finished=true;clearTimeout(timer);image.onload=null;image.onerror=null;pending--;if(!value){images.delete(src);resolvedImages.delete(src);image.removeAttribute('src');}else resolvedImages.add(src);settle(value);pump();};const timer=setTimeout(()=>done(null),15000);image.onload=()=>done(image);image.onerror=()=>done(null);image.src=src;});pump();return promise;
}
function releaseChessArtScopeV39(scope:Set<string>){activeScopes.delete(scope);const retained=new Set([...activeScopes].flatMap(item=>[...item]));for(const src of resolvedImages)if(!retained.has(src)){resolvedImages.delete(src);images.delete(src);}}
function fallbackPieceKeys(pieceId:string,pieceById:(id:string)=>Pick<ChessPieceV39,'id'|'name'|'artId'|'element'>|undefined=chessPieceByIdV39){const piece=pieceById(pieceId);if(!piece)return [];
 if(piece.artId.startsWith('companion_'))return [COMPANION_ART_V31[piece.id as CompanionId]?.fullbody].filter(Boolean);
 return [...new Set(['attack','cast'].map(kind=>ASSETS[`battle_${piece.artId}_${kind}`]).filter(Boolean))];
}
function pieceSources(pieceId:string,art:ChessVisualArtV39,pieceById:BoardProps['pieceById']){return art.pieces?.[pieceId]?[art.pieces[pieceId].src]:fallbackPieceKeys(pieceId,pieceById);}
function elementSources(element:CombatElement,art:ChessVisualArtV39){if(art.effects?.[element])return [art.effects[element]!.src];const impact=combatImpact(element);return impact&&ASSETS[impact.asset]?[ASSETS[impact.asset]]:[];}

type BoardProps={pieceById?:(id:string)=>Pick<ChessPieceV39,'id'|'name'|'artId'|'element'>|undefined;units:ChessFightUnitV39[];fight?:ChessFightV39|null;tick?:number;board:ChessBoardArtV39;art?:ChessVisualArtV39;selectedUid?:string|null;selectedCell?:number;editable:boolean;reducedMotion:boolean;onCell:(cell:number)=>void;onInspect:(uid:string)=>void;onReady:(ready:boolean)=>void};
export function AutoChessBoardV39({pieceById=chessPieceByIdV39,units,fight,tick=0,board,art={},selectedUid,selectedCell=56,editable,reducedMotion,onCell,onInspect,onReady}:BoardProps){
 const canvas=useRef<HTMLCanvasElement>(null),live=useRef({units,fight,tick,art,selectedUid,reducedMotion,board}),[loading,setLoading]=useState(true),[failures,setFailures]=useState<string[]>([]),[retry,setRetry]=useState(0);live.current={units,fight,tick,art,selectedUid,reducedMotion,board};
 const scope=[...new Set(units.map(unit=>unit.pieceId))].sort().join('|'),artSignature=Object.entries(art.pieces||{}).map(([id,item])=>id+':'+item.src).join('|')+Object.entries(art.effects||{}).map(([id,item])=>id+':'+item.src).join('|');
 useEffect(()=>{
  let disposed=false,frame=0;setLoading(true);setFailures([]);onReady(false);
  const pieceIds=scope.split('|').filter(Boolean),sources=[...new Set([board.src,...pieceIds.flatMap(id=>pieceSources(id,art,pieceById)),...pieceIds.flatMap(id=>elementSources(pieceById(id)!.element,art))])],retained=new Set(sources);activeScopes.add(retained);
  void Promise.all(sources.map(async src=>[src,await loadChessNativeImageV39(src)] as const)).then(result=>{
   if(disposed){releaseChessArtScopeV39(retained);return;}const missing=result.filter(([,image])=>!image).map(([src])=>src);setFailures(missing);setLoading(false);onReady(!missing.length);if(canvas.current)canvas.current.dataset.artFailures=JSON.stringify(missing);if(missing.length){console.warn('[Éter Anima] Artes do Circuito indisponíveis:',missing);return;}
   const loaded=Object.fromEntries(result) as Record<string,HTMLImageElement>,cv=canvas.current!,ctx=cv.getContext('2d')!;cv.dataset.artSources=JSON.stringify(sources);cv.dataset.artFailures='[]';
   let lastPaintAt=0,lastStatic:{units:ChessFightUnitV39[];tick:number;selected?:string|null;width:number;dpr:number}|null=null,paintFrames=0;
   const paint=()=>{if(disposed)return;frame=requestAnimationFrame(paint);const rect=cv.getBoundingClientRect(),geometry=chessPaintGeometryV39(rect.width),size=geometry.logicalSize,dpr=Math.min(devicePixelRatio||1,2),state=live.current,now=performance.now();if(!size)return;const sameSize=lastStatic?.width===rect.width&&lastStatic.dpr===dpr;if(state.reducedMotion&&sameSize&&lastStatic?.units===state.units&&lastStatic.tick===state.tick&&lastStatic.selected===state.selectedUid)return;if(sameSize&&now-lastPaintAt<1000/30)return;lastPaintAt=now;lastStatic={units:state.units,tick:state.tick,selected:state.selectedUid,width:rect.width,dpr};if(cv.width!==Math.round(rect.width*dpr)||cv.height!==Math.round(rect.width*dpr)){cv.width=Math.round(rect.width*dpr);cv.height=Math.round(rect.width*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.width);ctx.translate(geometry.origin,geometry.origin);cv.dataset.paintOrigin=JSON.stringify({x:geometry.origin,y:geometry.origin,logicalSize:size,paintSize:rect.width});
    const cellSize=size/8,nowTick=state.tick,cellRecords:Record<string,{cell:number;x:number;y:number;frame:number;source:string}>={};
    for(const unit of [...state.units].sort((a,b)=>Math.floor(a.cell/8)-Math.floor(b.cell/8)||a.cell%8-b.cell%8)){
     const piece=pieceById(unit.pieceId)!;if(!piece)continue;const poseState=state.fight?chessReplayPose(state.fight,unit.uid,nowTick):{death:undefined,movement:undefined,action:undefined},death=unit.hp<=0?poseState.death:undefined,deathAge=death?(nowTick-death.tick)/10:0;if(unit.hp<=0&&(state.reducedMotion||!death||deathAge>=.45))continue;const point=chessCellPointV39(unit.cell,size),movement=poseState.movement;
     if(movement&&!state.reducedMotion){const from=chessCellPointV39(movement.fromCell,size),to=chessCellPointV39(movement.toCell,size),travel=Math.min(1,Math.max(0,(nowTick-movement.tick)/3));point.x=from.x+(to.x-from.x)*travel;point.y=from.y+(to.y-from.y)*travel;}
     const action=poseState.action,kind=action?.kind==='skill'?'cast':action?'attack':'idle',phase=action?Math.min(1,Math.max(0,(nowTick-action.tick+2)/4)):0,native=state.art.pieces?.[piece.id];let image:HTMLImageElement|undefined,crop:SpriteCrop|undefined,source='',pose=0;
     if(native){source=native.src;image=loaded[source];const frames=native[kind],animationTime=state.fight?nowTick*100:now;pose=state.reducedMotion?Math.min(frames.length-1,kind==='idle'?0:Math.floor(frames.length/2)):kind==='idle'?Math.floor((animationTime/420+unit.cell)%frames.length):Math.min(frames.length-1,Math.floor(phase*frames.length));crop=frames[pose];}
     else if(piece.artId.startsWith('companion_')){source=COMPANION_ART_V31[piece.id as CompanionId]?.fullbody;image=loaded[source];if(image)crop={x:0,y:0,w:image.width,h:image.height,anchorX:image.width/2,anchorY:image.height};}
     else {const key=`battle_${piece.artId}_${kind==='cast'?'cast':'attack'}`;source=ASSETS[key];image=loaded[source];const frames=SPRITE_FRAMES[key]||[];pose=state.reducedMotion?Math.min(frames.length-1,action?2:0):action?Math.min(frames.length-1,Math.floor(phase*frames.length)):0;crop=frames[pose];}
     if(!image||!crop)continue;const height=cellSize*(piece.id==='dante'?1.03:1.25),scale=native?.bodyHeight&&native.bodyHeight>0?Math.min(cellSize*(piece.id==='dante'?.9:1.02)/native.bodyHeight,cellSize*1.65/Math.max(1,...[...native.idle,...native.attack,...native.cast].map(frame=>frame.w))):Math.min(height/crop.h,cellSize*.75/crop.w),vertical=chessPieceVerticalV39(point.y,cellSize,native?.bodyHeight||height/scale,scale),feetY=vertical.feetY,feetX=point.x,drawWidth=crop.w*scale,drawHeight=crop.h*scale;
     ctx.save();ctx.globalAlpha=unit.hp>0?1:Math.max(0,1-deathAge/.45);ctx.fillStyle=unit.side==='ally'?'#84d5c82f':'#ec8c9c30';ctx.beginPath();ctx.ellipse(feetX,feetY,cellSize*.3,cellSize*.095,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=unit.uid===state.selectedUid?'#ffdf8a':unit.side==='ally'?'#8eeed3':'#e690a3';ctx.lineWidth=unit.uid===state.selectedUid?2:1;ctx.stroke();
     if(chessPieceMirroredV40(unit.side,native?.facing)){ctx.translate(2*feetX,0);ctx.scale(-1,1);}ctx.drawImage(image,crop.x,crop.y,crop.w,crop.h,feetX-(crop.anchorX-crop.x)*scale,feetY-(crop.anchorY-crop.y)*scale,drawWidth,drawHeight);ctx.restore();cellRecords[unit.uid]={cell:unit.cell,x:point.x,y:point.y,frame:pose,source};
     if(unit.hp>0){const barWidth=Math.max(12,cellSize*.68),barX=point.x-barWidth/2,barY=vertical.barY,edge=cellSize*.006;ctx.fillStyle='#081421df';ctx.fillRect(barX-edge,barY-edge,barWidth+2*edge,cellSize*.092);ctx.fillStyle=unit.side==='ally'?'#88e3c7':'#ef9eac';ctx.fillRect(barX,barY,barWidth*Math.max(0,unit.hp/unit.maxHp),cellSize*.045);ctx.fillStyle='#81bff0';ctx.fillRect(barX,barY+cellSize*.055,barWidth*Math.max(0,unit.mana/unit.maxMana),cellSize*.025);if(unit.shield){ctx.fillStyle='#f6da91';ctx.fillRect(barX,vertical.shieldY,barWidth*Math.min(1,unit.shield/unit.maxHp),cellSize*.006);}ctx.fillStyle='#f6e6b1';ctx.font=`bold ${Math.max(7,cellSize*.15)}px Arial`;ctx.textAlign='center';ctx.fillText('★'.repeat(unit.star),point.x,vertical.starsY);}
    }
    for(const zone of state.fight?chessReplayZones(state.fight,nowTick):[]){const center=chessCellPointV39(zone.toCell,size),row=Math.floor(zone.toCell/8),column=zone.toCell%8;ctx.save();ctx.strokeStyle='#ffb36a99';ctx.fillStyle='#ed86461c';ctx.lineWidth=Math.max(1,cellSize*.02);for(const [dr,dc]of [[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const rr=row+dr,cc=column+dc;if(rr<0||rr>=8||cc<0||cc>=8)continue;const target=chessCellPointV39(rr*8+cc,size);ctx.beginPath();ctx.ellipse(target.x,target.y+cellSize*.31,cellSize*.37,cellSize*.13,0,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.restore();}
    for(const event of state.fight?chessReplayEffects(state.fight,nowTick):[]){const age=(nowTick-event.tick)/10;if(age<0||age>.55||!['attack','skill','heal','shield','status'].includes(event.kind)||!event.value&&event.kind!=='skill')continue;const target=chessCellPointV39(event.targetCell,size),effect=state.art.effects?.[event.element],phase=state.reducedMotion?.5:age/.55;let image:HTMLImageElement|undefined,crop:SpriteCrop|undefined;
     if(effect){image=loaded[effect.src];crop=effect.frames[Math.min(effect.frames.length-1,Math.floor(phase*effect.frames.length))];}else{const impact=combatImpact(event.element);if(impact){image=loaded[ASSETS[impact.asset]];if(image){const col=Math.min(impact.columns-1,Math.floor(phase*impact.columns));const selected=impact.frames?.[col]||{x:col*image.width/impact.columns,y:impact.row*image.height/impact.rows,w:image.width/impact.columns,h:image.height/impact.rows};crop={...selected,anchorX:selected.x+selected.w/2,anchorY:selected.y+selected.h};}}}
     if(image&&crop){const fxSize=cellSize*(event.kind==='skill'?1.45:.9);ctx.save();ctx.globalAlpha=state.reducedMotion?.5:Math.max(0,1-age/.65);ctx.drawImage(image,crop.x,crop.y,crop.w,crop.h,target.x-fxSize/2,target.y-fxSize/2,fxSize,fxSize);ctx.restore();}
     const displayedImpact=state.fight?chessReplayImpact(state.fight,event):0;if(displayedImpact){ctx.save();ctx.globalAlpha=Math.max(0,1-age/.65);ctx.fillStyle=event.kind==='heal'?'#afffe2':event.kind==='shield'?'#ffe6a2':'#fff7eb';ctx.shadowColor='#0b1724';ctx.shadowBlur=3;ctx.font=`bold ${Math.max(9,cellSize*.22)}px Arial`;ctx.textAlign='center';ctx.fillText((event.kind==='heal'||event.kind==='shield'?'+':'−')+displayedImpact,target.x,target.y-cellSize*.2-(state.reducedMotion?0:age*13));ctx.restore();}
    }
    cv.dataset.paintFrames=String(++paintFrames);cv.dataset.cells=JSON.stringify(cellRecords);cv.dataset.tick=nowTick.toFixed(2);cv.dataset.alive=String(state.units.filter(unit=>unit.hp>0).length);
   };paint();
  });return()=>{disposed=true;cancelAnimationFrame(frame);releaseChessArtScopeV39(retained);};
 },[scope,board.src,artSignature,retry,onReady,pieceById]);
 const unitAt=(cell:number)=>units.find(unit=>unit.cell===cell&&unit.hp>0);
 const bounds=board.tileBounds||{x:0,y:0,width:1,height:1},boardStyle={backgroundImage:`url(${board.src})`,'--grid-left':bounds.x*100+'%','--grid-top':bounds.y*100+'%','--grid-width':bounds.width*100+'%','--grid-height':bounds.height*100+'%','--paint-left':(bounds.x-bounds.width*CHESS_PAINT_PADDING_V39)*100+'%','--paint-top':(bounds.y-bounds.height*CHESS_PAINT_PADDING_V39)*100+'%','--paint-width':bounds.width*(1+2*CHESS_PAINT_PADDING_V39)*100+'%','--paint-height':bounds.height*(1+2*CHESS_PAINT_PADDING_V39)*100+'%'} as CSSProperties;
 return <div className={styles.board} style={boardStyle} data-chess-board data-board-theme={board.id} data-art-ready={!loading&&!failures.length}>
  <div className={styles.tiles} role="grid" aria-label="Tabuleiro de oito por oito casas" aria-rowcount={8} aria-colcount={8}>{Array.from({length:64},(_,cell)=>{const unit=unitAt(cell),piece=unit&&pieceById(unit.pieceId),legal=editable&&chessPlacementAllowedV39(cell);return <button key={cell} type="button" role="gridcell" tabIndex={cell===selectedCell?0:-1} className={styles.tile} data-cell={cell} data-legal={legal&&!!selectedUid||undefined} data-selected={unit?.uid===selectedUid||undefined} aria-rowindex={Math.floor(cell/8)+1} aria-colindex={cell%8+1} aria-label={`Casa ${String.fromCharCode(65+cell%8)}${8-Math.floor(cell/8)}${piece?` · ${piece.name} ${unit!.star} estrelas · ${unit!.hp}/${unit!.maxHp} HP`:': vazia'}${legal&&selectedUid?' · posicionar a peça selecionada':''}`} onKeyDown={event=>{if(event.key.startsWith('Arrow')){event.preventDefault();event.stopPropagation();const next=chessKeyboardCellV39(cell,event.key);event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus();}}} onClick={()=>legal?onCell(cell):unit&&onInspect(unit.uid)}/>;})}</div>
  <canvas ref={canvas} role="img" aria-label={fight?'Combate automático registrado, com posições, vida, mana e ataques das peças.':'Peças completas posicionadas sobre as casas do tabuleiro.'}/>
  {(loading||failures.length>0)&&<div className={styles.boardLoading} role="status">{loading?<p>Preparando o tabuleiro e as peças…</p>:<><p>A arte desta formação não carregou.</p><button onClick={()=>setRetry(value=>value+1)}>Carregar novamente</button></>}</div>}
 </div>;
}
