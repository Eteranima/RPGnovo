import {battleCrop,SPRITE_FRAMES,type SpriteCrop} from './sprites';
import {VARIANT_BODY_TOPS_V36,VARIANT_FRAMES_V36} from './variantArtV36';
import {ABEL_BODY_METRICS_V36} from './abelBodyArtV36';

export type BattleSlot={x:number;y:number;labelY:number;cellWidth:number;height:number};

/** Horizontal lanes keep every actor and its ground label in a separate column. */
export function battleFormation(width:number,height:number,count:number){
 const n=Math.max(1,Math.min(5,count)),left=width*.045,partyWidth=width*.59,cell=partyWidth/n;
 const ground=Math.max(22,height-34),actorHeight=Math.max(12,Math.min(225,height*.76,cell*1.32));
 const heroes:BattleSlot[]=Array.from({length:n},(_,i)=>{
  const y=ground-(i%2===0?4:0);
  return{x:left+cell*(i+.5),y,labelY:Math.min(height-8,y+25),cellWidth:cell,height:actorHeight};
 });
 const enemy:BattleSlot={x:width*.82,y:ground-5,labelY:height-8,cellWidth:width*.27,height:Math.max(12,Math.min(240,height*.80,width*.26))};
 return{heroes,enemy};
}

export function battleFrameMetrics(key:string){
 const reference=battleCrop(key,0),frames=SPRITE_FRAMES[key]||[reference];
 return{reference,above:Math.max(1,...frames.map(f=>f.anchorY-f.y)),below:Math.max(0,...frames.map(f=>f.y+f.h-f.anchorY)),left:Math.max(1,...frames.map(f=>f.anchorX-f.x)),right:Math.max(1,...frames.map(f=>f.x+f.w-f.anchorX))};
}

/** Presentation anchors use Abel's two boots; native RGBA and crop rectangles stay intact. */
export function battleActorCropV36(key:string,frame=0):SpriteCrop{
 const crop=battleCrop(key,frame),body=ABEL_BODY_METRICS_V36[key]?.[frame];
 return body?{...crop,anchorX:body.anchorX,anchorY:body.soleY}:crop;
}

/** Anatomical bounds exclude the staff, trailing cape and independently drawn fire. */
export function battleBodyBoundsV36(key:string,frame:number,x:number,y:number,scale:number,flip=false){
 const body=ABEL_BODY_METRICS_V36[key]?.[frame];
 if(!body)return battleCropBounds(battleActorCropV36(key,frame),x,y,scale,flip);
 const left=(flip?body.right-body.anchorX:body.anchorX-body.left)*scale;
 return{x:x-left,y:y-(body.soleY-body.headTop)*scale,width:(body.right-body.left)*scale,height:(body.soleY-body.headTop)*scale};
}

/** Raised weapons and mineral halos do not change the actor's measured body height. */
export function battleBodyHeightV36(key:string,frame=0){
 const body=ABEL_BODY_METRICS_V36[key]?.[frame];if(body)return Math.max(1,body.soleY-body.headTop);
 const crop=battleCrop(key,frame),top=VARIANT_BODY_TOPS_V36[key]?.[frame]??crop.y;
 return Math.max(1,crop.anchorY-top);
}

/** Native head-to-foot anchor and frame bounds replace per-character 512px guesses. */
export function battleActorScale(key:string,slot:BattleSlot,flip=false,frame=0){
 const anatomy=ABEL_BODY_METRICS_V36[key]?.[frame];
 if(anatomy){
  const bodyHeight=anatomy.soleY-anatomy.headTop;
  const left=flip?anatomy.right-anatomy.anchorX:anatomy.anchorX-anatomy.left,right=flip?anatomy.anchorX-anatomy.left:anatomy.right-anatomy.anchorX;
  // Native head/boots exclude the staff and fire; the shared lane still limits
  // adult height so the professor does not tower over a five-member formation.
  const adultHeight=Math.min(slot.height,slot.cellWidth*.98);
  return Math.max(.001,Math.min(adultHeight/bodyHeight,(slot.y-10)/bodyHeight,slot.cellWidth*.48/Math.max(1,left),slot.cellWidth*.48/Math.max(1,right)));
 }
 const metrics=battleFrameMetrics(key),referenceHeight=battleBodyHeightV36(key,frame);
 const idleKey=key.replace(/_(cast|ultimate)$/,'_attack'),idle=battleCrop(idleKey,0),idleHeight=battleBodyHeightV36(idleKey);
 const idleLeft=idle.anchorX-idle.x,idleRight=idle.x+idle.w-idle.anchorX;
 const left=(flip?idleRight:idleLeft)/idleHeight,right=(flip?idleLeft:idleRight)/idleHeight;
 // Long weapons and generated spell reach belong to the action, not the body size.
 const bodyHeight=Math.min(slot.height,slot.cellWidth*.44/Math.max(.01,left),slot.cellWidth*.44/Math.max(.01,right));
 if(!VARIANT_FRAMES_V36[key])return Math.max(.01,Math.min(bodyHeight/referenceHeight,(slot.y-10)/metrics.above));
 const frames=SPRITE_FRAMES[key]||[metrics.reference],normalized=frames.map((crop,i)=>{
  const body=battleBodyHeightV36(key,i);
  return {above:(crop.anchorY-crop.y)/body,below:(crop.y+crop.h-crop.anchorY)/body,left:(flip?crop.x+crop.w-crop.anchorX:crop.anchorX-crop.x)/body,right:(flip?crop.anchorX-crop.x:crop.x+crop.w-crop.anchorX)/body};
 });
 const reach=(side:'above'|'below'|'left'|'right')=>Math.max(.001,...normalized.map(item=>item[side]));
 const fittedBody=Math.min(bodyHeight,(slot.y-10)/reach('above'),Math.max(1,slot.labelY-slot.y-13)/reach('below'),slot.cellWidth*.48/reach('left'),slot.cellWidth*.48/reach('right'));
 return Math.max(.001,fittedBody/referenceHeight);
}

export function battleCropBounds(crop:SpriteCrop,x:number,y:number,scale:number,flip=false){
 const left=(flip?crop.x+crop.w-crop.anchorX:crop.anchorX-crop.x)*scale;
 return{x:x-left,y:y-(crop.anchorY-crop.y)*scale,width:crop.w*scale,height:crop.h*scale};
}

/** Keep the attack advance inside its existing lane, including wide native poses. */
export function battleActorAdvanceV36(bounds:{x:number;width:number},slot:BattleSlot,requested:number){
 return Math.min(Math.max(0,requested),Math.max(0,slot.x+slot.cellWidth*.49-bounds.x-bounds.width));
}
