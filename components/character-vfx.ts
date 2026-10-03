import {SPRITE_FRAMES} from '@/lib/game/sprites';
import {characterEffectMotif,isRemadeHero,skillMotifIndex} from '@/lib/game/characterAnimation';
import type {BattleSlot} from '@/lib/game/battleFormation';

/** Generated motifs travel, bloom and settle while the body uses its own pose atlas. */
export function drawCharacterVfx(ctx:CanvasRenderingContext2D,art:Record<string,HTMLImageElement>,hero:string,action:string,origin:BattleSlot,target:BattleSlot,allies:BattleSlot[],t:number,impact:number,size:number){
 action=action==='enemy-hit'?'attack':action==='enemy-ultimate'?'ultimate':action;
 const key=`battle_fx_${hero}`,img=art[key],frames=SPRITE_FRAMES[key];
 if(!isRemadeHero(hero)||!img||!frames?.length||['guard','potion','ether','remedy','frozen','bound'].includes(action))return false;
 const crop=frames[Math.min(frames.length-1,characterEffectMotif(action))];
 const draw=(spot:BattleSlot,scale:number,alpha:number)=>{
  const h=Math.min(size*scale,Math.max(1,spot.y-12)),s=h/Math.max(1,crop.h),w=crop.w*s;
  ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(img,crop.x,crop.y,crop.w,crop.h,spot.x-w/2,spot.y-h,w,h);ctx.restore();
 };
 const motif=skillMotifIndex(action),healing=['mend','cleanse','shadowrest','rekindle','margem','in-aeternum-vive','frost-sanctuary','return-stitch'].includes(action)||action==='ultimate'&&['ophelia','carmilla'].includes(hero);
 const travel=Math.max(0,Math.min(1,(t-.18)/.37));
 if(impact<0){
  const spot=healing||motif===2?target:{...origin,x:origin.x+(target.x-origin.x)*travel,y:origin.y+(target.y-origin.y)*travel};
  draw(spot,.45+travel*.35,Math.min(.85,Math.max(0,(t-.1)*3)));
 }else{
  const settle=Math.max(0,Math.min(1,(t-.55)/.45)),spots=allies.length?allies:[target];
  for(const spot of spots)draw(spot,(action==='ultimate'?1.13:.85)+Math.sin(settle*Math.PI)*.13,Math.max(0,.95-settle*.8));
 }
 return true;
}
