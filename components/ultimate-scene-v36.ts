import {SPRITE_FRAMES} from '@/lib/game/sprites';
import {characterPoseFrame,characterCamera,hasCharacterBattleArt} from '@/lib/game/characterAnimation';
import {battleActorCropV36,battleBodyHeightV36} from '@/lib/game/battleFormation';
import {ABEL_BODY_METRICS_V36} from '@/lib/game/abelBodyArtV36';
import {drawLegendaryWorldV36,drawLegendaryLayersV36,legendarySceneV36} from '@/lib/game/legendarySceneV36';
import {enemyPoseFrame} from '@/lib/game/enemyArtV30';
import {combatImpact,ELEMENT_COLORS,type CombatElement} from '@/lib/game/data';

type UltimateSceneInputV36={art:Record<string,HTMLImageElement>;id:string;key:string;family:string;enemy:boolean;recruitDuel:boolean;width:number;height:number;age:number;duration:number;impactAt:number;speed:number;reduced:boolean;element:CombatElement;canvas:HTMLCanvasElement};
/** All layers follow the real battle action, including speed and contact. */
export function drawUltimateSceneV36(ctx:CanvasRenderingContext2D,input:UltimateSceneInputV36){
 const {art,id,key,family,enemy,recruitDuel,width:w,height:h,age,duration,impactAt,speed,reduced,element,canvas}=input;
 const time=Math.max(0,Math.min(1,age/duration)),contact=impactAt/duration;
 const legendary=legendarySceneV36(id,time,contact,reduced),beat=age<900/speed?'focus':age<1800/speed?'charge':age<impactAt?'release':'impact';
 canvas.dataset.cameraBeat=legendary?.stage||beat;
 canvas.dataset.legendaryScene=legendary?id:'';
 ctx.clearRect(0,0,w,h);
 if(!drawLegendaryWorldV36(ctx,art,id,w,h,time,contact,reduced)){
  const hue=ELEMENT_COLORS[element],grad=ctx.createRadialGradient(w*.56,h*.5,8,w*.5,h*.5,w*.65);
  grad.addColorStop(0,hue+'70');grad.addColorStop(1,'#040914e8');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
 }
 drawLegendaryLayersV36(ctx,art,SPRITE_FRAMES,id,w,h,time,contact,reduced,'back');
 const image=art[key];
 if(image){
  const frames=SPRITE_FRAMES[key],count=frames?.length||1,onset=hasCharacterBattleArt(id)?700:900;
  const phase=Math.max(0,age-onset/speed)/Math.max(1,duration-onset/speed);
  const frame=reduced?Math.min(5,count-1):enemy&&!recruitDuel?enemyPoseFrame(family,'ultimate',phase,count):characterPoseFrame(id,'ultimate',phase,count);
  const crop=battleActorCropV36(key,frame),focus=beat==='focus'&&!reduced&&!enemy,camera=characterCamera(id,beat,time,reduced);
  const body=battleBodyHeightV36(key,frame),size=enemy?Math.min(w*.8,h*.92):focus?h*1.65:h*.79;
  const preferred=size*camera.zoom/body,x=w*(focus?.55:camera.x),y=focus?h*.08+body*preferred:h*.88;
  const above=Math.max(1,crop.anchorY-crop.y),below=Math.max(1,crop.y+crop.h-crop.anchorY),side=Math.max(crop.anchorX-crop.x,crop.x+crop.w-crop.anchorX);
  const anatomy=ABEL_BODY_METRICS_V36[key]?.[frame],bodySide=anatomy?Math.max(anatomy.anchorX-anatomy.left,anatomy.right-anatomy.anchorX):side;
  const scale=focus?preferred:anatomy?Math.max(.01,Math.min(preferred,(y-h*.075)/body,(Math.min(x,w-x)-16)/Math.max(1,bodySide))):Math.max(.01,Math.min(preferred,(y-h*.075)/above,(h*.94-y)/below,(Math.min(x,w-x)-16)/side));
  ctx.save();ctx.globalAlpha=camera.alpha;
  if(!reduced&&age>=impactAt&&age<impactAt+180/speed)ctx.translate(Math.sin(age/19)*4,Math.cos(age/22)*2);
  ctx.drawImage(image,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*scale,y-(crop.anchorY-crop.y)*scale,crop.w*scale,crop.h*scale);
  ctx.restore();canvas.dataset.ultimateFrame=String(frame);if(anatomy)canvas.dataset.bodyHeightabel=(body*scale).toFixed(2);
 }
 if(legendary){
  drawLegendaryLayersV36(ctx,art,SPRITE_FRAMES,id,w,h,time,contact,reduced,'front');
 }else{
  const ownKey=`battle_fx_${id}`,ownCrop=hasCharacterBattleArt(id)?SPRITE_FRAMES[ownKey]?.[5]:undefined;
  const impact=ownCrop?{asset:ownKey,columns:1,rows:1,row:0,frames:[ownCrop]}:enemy&&!recruitDuel?undefined:combatImpact(element),fx=impact?art[impact.asset]:undefined;
  if(fx&&impact&&age>1800/speed){
   const fw=fx.width/impact.columns,fh=fx.height/impact.rows,count=impact.frames?.length||impact.columns;
   const frame=Math.min(count-1,Math.max(0,Math.floor((age-1800/speed)/Math.max(1,duration-1800/speed)*count)));
   const crop=impact.frames?.[frame]||{x:frame*fw,y:impact.row*fh,w:fw,h:fh},scale=Math.min(w*(ownCrop?.38:.64)/crop.w,h*.74/crop.h),ew=crop.w*scale,eh=crop.h*scale;
   ctx.save();ctx.globalAlpha=.88;ctx.drawImage(fx,crop.x,crop.y,crop.w,crop.h,w*(ownCrop?.78:element==='earth'?.74:.58)-ew/2,h*.86-eh,ew,eh);ctx.restore();
  }
 }
 if(!reduced&&age>=impactAt&&age<impactAt+90/speed){ctx.fillStyle=ELEMENT_COLORS[element]+'38';ctx.fillRect(0,0,w,h);}
 ctx.fillStyle='#020611';ctx.fillRect(0,0,w,h*.065);ctx.fillRect(0,h*.94,w,h*.06);
}
