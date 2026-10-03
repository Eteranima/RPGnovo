import {battleCrop,SPRITE_FRAMES,type SpriteCrop} from './sprites';

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

/** Native head-to-foot anchor and frame bounds replace per-character 512px guesses. */
export function battleActorScale(key:string,slot:BattleSlot,flip=false){
 const metrics=battleFrameMetrics(key),referenceHeight=Math.max(1,metrics.reference.anchorY-metrics.reference.y);
 const idle=battleCrop(key.replace(/_(cast|ultimate)$/,'_attack'),0),idleHeight=Math.max(1,idle.anchorY-idle.y);
 const idleLeft=idle.anchorX-idle.x,idleRight=idle.x+idle.w-idle.anchorX;
 const left=(flip?idleRight:idleLeft)/idleHeight,right=(flip?idleLeft:idleRight)/idleHeight;
 // Long weapons and generated spell reach belong to the action, not the body size.
 const bodyHeight=Math.min(slot.height,slot.cellWidth*.44/Math.max(.01,left),slot.cellWidth*.44/Math.max(.01,right));
 return Math.max(.01,Math.min(bodyHeight/referenceHeight,(slot.y-10)/metrics.above));
}

export function battleCropBounds(crop:SpriteCrop,x:number,y:number,scale:number,flip=false){
 const left=(flip?crop.x+crop.w-crop.anchorX:crop.anchorX-crop.x)*scale;
 return{x:x-left,y:y-(crop.anchorY-crop.y)*scale,width:crop.w*scale,height:crop.h*scale};
}
