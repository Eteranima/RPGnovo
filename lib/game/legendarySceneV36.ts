import type {SpriteCrop} from './sprites';

export const LEGENDARY_SCENE_IDS_V36=['ava-worldroot-sovereign','beatriz-eclipse-tide','orfeu-unwritten-archon'] as const;
type LegendarySceneIdV36=typeof LEGENDARY_SCENE_IDS_V36[number];
type LayerV36={motif:number;x:number;y:number;size:number;alpha:number;rotation:number};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
export function legendarySceneV36(id:string,time:number,impactTime=.68,reduced=false){
 if(!LEGENDARY_SCENE_IDS_V36.includes(id as LegendarySceneIdV36))return null;
 const t=clamp(time),contact=Math.max(.35,Math.min(.85,impactTime)),charge=ease((t-.16)/Math.max(.1,contact-.16)),burst=ease((t-contact)/.09),settle=ease((t-contact-.15)/Math.max(.01,1-contact-.15));
 const stage=t<.18?'focus':t<contact-.16?'charge':t<contact?'release':t<contact+.14?'impact':'settle';
 const front:LayerV36[]=[],back:LayerV36[]=[],visible=reduced?1:charge*(1-settle*.38);
 if(id==='ava-worldroot-sovereign'){
  for(let i=0;i<3;i++)back.push({motif:i===1?3:2,x:.15+i*.34,y:.98-(reduced?.05:charge*.1),size:.30+(i===1?.08:0),alpha:visible*.62,rotation:0});
  front.push({motif:5,x:.77,y:.95,size:.42,alpha:reduced?.7:burst*(1-settle*.55),rotation:0});
 }else if(id==='beatriz-eclipse-tide'){
  for(let i=0;i<2;i++)back.push({motif:i===0?2:4,x:.16+i*.66+(reduced?0:Math.sin(t*Math.PI*2+i)*.035),y:.87,size:.38,alpha:visible*.60,rotation:reduced?0:(i?1:-1)*charge*.06});
  front.push({motif:5,x:.75,y:.96,size:.47,alpha:reduced?.7:burst*(1-settle*.45),rotation:0});
 }else{
  for(let i=0;i<2;i++)back.push({motif:i===0?3:4,x:.2+i*.60+(reduced?0:(i?1:-1)*burst*.03),y:.87,size:.32,alpha:visible*.56,rotation:reduced?0:(i?1:-1)*burst*.10});
  front.push({motif:5,x:.77,y:.97,size:.42,alpha:reduced?.7:burst*(1-settle*.6),rotation:0});
 }
 return {stage,zoom:reduced?1:1.015+charge*.035,panX:reduced?0:(id==='beatriz-eclipse-tide'?Math.sin(t*Math.PI)*.014:(t-.5)*.012),panY:reduced?0:-charge*.008,back,front};
}

/** Camera and generated native sprites share the action clock; no extra timers or combat effects. */
export function drawLegendaryWorldV36(ctx:CanvasRenderingContext2D,art:Record<string,HTMLImageElement>,id:string,width:number,height:number,time:number,impactTime:number,reduced:boolean){
 const scene=legendarySceneV36(id,time,impactTime,reduced),image=art[`battle_${id}_cinematic_background`];
 if(!scene||!image)return false;
 const scale=Math.max(width/image.width,height/image.height)*scene.zoom,w=image.width*scale,h=image.height*scale;
 ctx.drawImage(image,(width-w)/2+scene.panX*width,(height-h)/2+scene.panY*height,w,h);
 return true;
}
export function drawLegendaryLayersV36(ctx:CanvasRenderingContext2D,art:Record<string,HTMLImageElement>,frames:Record<string,SpriteCrop[]>,id:string,width:number,height:number,time:number,impactTime:number,reduced:boolean,layer:'back'|'front'){
 const scene=legendarySceneV36(id,time,impactTime,reduced),key=`battle_fx_${id}`,image=art[key];if(!scene||!image)return;
 for(const item of scene[layer]){
  const crop=frames[key]?.[item.motif];if(!crop||item.alpha<=0)continue;
  const scale=Math.min(width*item.size/crop.w,height*.65/crop.h),w=crop.w*scale,h=crop.h*scale;
  ctx.save();ctx.globalAlpha=item.alpha;ctx.translate(width*item.x,height*item.y);ctx.rotate(item.rotation);ctx.drawImage(image,crop.x,crop.y,crop.w,crop.h,-w/2,-h,w,h);ctx.restore();
 }
}
