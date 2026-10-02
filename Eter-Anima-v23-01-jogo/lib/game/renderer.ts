import { ASSETS, MAPS, COMPANIONS, OBJECTIVES, type Entity } from './data';
import { GameEngine } from './engine';
import {CUTSCENES} from './progression';
import {SPRITE_FRAMES} from './sprites';
import {cosmeticOf} from './cosmetics';
import {drawAura} from './aura';
const T=56;
export class WorldRenderer{
 canvas:HTMLCanvasElement;engine:GameEngine;ctx:CanvasRenderingContext2D;images:Record<string,HTMLImageElement>={};patterns:Record<string,CanvasPattern>={};camera={x:0,y:0,scale:1};width=0;height=0;frame=0;lastPaint=0;raf=0;resize:ResizeObserver;ready=false;disposed=false;
 constructor(canvas:HTMLCanvasElement,engine:GameEngine){this.canvas=canvas;this.engine=engine;this.ctx=canvas.getContext('2d')!;
  this.resize=new ResizeObserver(()=>this.setSize());this.resize.observe(canvas);this.setSize();
 }
 async load(){await Promise.all(Object.entries(ASSETS).filter(([key])=>!key.startsWith('battle_')).map(([key,src])=>new Promise<void>(resolve=>{const img=new Image();img.onload=()=>{this.images[key]=img;resolve();};img.onerror=()=>resolve();img.src=src;})));if(this.disposed)return;this.makePatterns();this.ready=true;this.draw();}
 setSize(){const r=this.canvas.getBoundingClientRect();this.width=r.width;this.height=r.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,r.width*dpr);this.canvas.height=Math.max(1,r.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
 makePatterns(){const atlas=this.images.terrain;if(!atlas)return;const wood=this.images.harbor_floor;if(wood){const cv=document.createElement('canvas');cv.width=112;cv.height=112;cv.getContext('2d')!.drawImage(wood,0,0,112,112);const pat=this.ctx.createPattern(cv,'repeat');if(pat)this.patterns.b=pat;}['g','p','d','w'].forEach((key,i)=>{const cv=document.createElement('canvas');cv.width=336;cv.height=336;cv.getContext('2d')!.drawImage(atlas,(i%2)*atlas.width/2,Math.floor(i/2)*atlas.height/2,atlas.width/2,atlas.height/2,0,0,336,336);const p=this.ctx.createPattern(cv,'repeat');if(p)this.patterns[key]=p;});}
 image(key:string,x:number,y:number,w:number,h:number,atlas?:number,sheet='props'){const img=atlas!==undefined?this.images[sheet]:this.images[key];if(!img)return;
  if(atlas!==undefined){const crop=SPRITE_FRAMES[sheet]?.[atlas];if(crop){this.ctx.drawImage(img,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*w/512,y-(crop.anchorY-crop.y)*h/512,crop.w*w/512,crop.h*h/512);}else{const sw=img.width/3,sh=img.height/2;this.ctx.drawImage(img,(atlas%3)*sw,Math.floor(atlas/3)*sh,sw,sh,x-w/2,y-h,w,h);}}else this.ctx.drawImage(img,x-w/2,y-h,w,h);
 }
 glow(x:number,y:number,r:number,color:string){const c=this.ctx,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
 actor(key:string,x:number,y:number,facing:number,moving=false){const c=this.ctx,img=this.images[key];if(!img)return;const fw=img.width/3,fh=img.height/4,step=Math.floor(this.frame/155)%4;const directions=[[0,1,2,1],[5,8,5,8],[3,4,6,7],[9,10,11,10]];const cell=!['seiji','ophelia'].includes(key)?facing*3+(moving?[0,1,2,1][step]:1):directions[facing][moving?step:1];const h=107,w=h*(fw/fh);
  c.save();c.fillStyle='rgba(2,8,14,.4)';c.beginPath();c.ellipse(x,y+2,18,6,0,0,Math.PI*2);c.fill();
  const bob=moving?Math.sin(this.frame/75)*1:Math.sin(this.frame/600)*.7,crop=SPRITE_FRAMES[key]?.[cell];if(crop){const scale=h/Math.max(1,crop.anchorY-crop.y);c.drawImage(img,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*scale,y-(crop.anchorY-crop.y)*scale+bob,crop.w*scale,crop.h*scale);}else c.drawImage(img,(cell%3)*fw,Math.floor(cell/3)*fh,fw,fh,x-w/2,y-h+bob,w,h);c.restore();
 }
 marker(e:Entity){if(this.engine.state.mode==='battle')return;const c=this.ctx,x=e.x*T,y=e.y*T;const active=OBJECTIVES[this.engine.state.stage].target===e.id;
  if(e.kind==='warp'){const locked=!!e.minStage&&this.engine.state.stage<e.minStage,img=this.images.exits,index={patio:0,arquivo:3,porto:2,domo:6,subsolo:4,camara:5,galeria:5,ashwood:1,ashpyre:7,vigilia:1}[e.to||'patio'],crop=SPRITE_FRAMES.exits?.[index];c.save();this.glow(x,y-32,85,locked?'#9b80b322':'#ffe4a445');c.globalAlpha=locked?.55:1;if(img&&crop){const scale=115/crop.h;c.drawImage(img,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*scale,y-(crop.anchorY-crop.y)*scale,crop.w*scale,crop.h*scale);}c.restore();}

  if(active||['chest','book','rune','sign','event'].includes(e.kind)){const off=e.kind==='npc'?100:e.kind==='boss'?130:e.kind==='book'?95:e.kind==='rune'?115:55;const y2=y-off+Math.sin(this.frame/450)*3;c.save();c.font='bold 24px Georgia';c.textAlign='center';c.shadowColor='#0c1b24';c.shadowBlur=8;c.fillStyle=active?'#edce91':e.kind==='event'?'#d3b3f5':'#b8e0df';c.fillText(active?'◆':e.kind==='book'||e.kind==='event'?'✧':e.kind==='chest'?'◇':'⋄',x,y2);c.restore();}
 }
 entity(e:Entity){const c=this.ctx,x=e.x*T,y=e.y*T;
  if(e.kind==='npc')this.actor(e.asset!,x,y,e.id==='max'?2:0,false);
  if(e.kind==='mob'||e.kind==='boss'){this.glow(x,y-18,e.kind==='boss'?100:50,'rgba(162,64,215,.2)');const h=e.kind==='boss'?150:90;if(['ashwolf','moth','cinder'].includes(e.asset!)){const img=this.images[e.asset!],crop=SPRITE_FRAMES[`battle_${e.asset}_attack`]?.[0];if(img&&crop){const scale=h/(crop.anchorY-crop.y);c.drawImage(img,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*scale,y-(crop.anchorY-crop.y)*scale,crop.w*scale,crop.h*scale);}}else this.image(e.asset!,x,y+Math.sin(this.frame/550)*4,h*.85,h);}
  if(e.kind==='chest'){c.globalAlpha=this.engine.state.opened.includes(e.id)?.45:1;this.image('dungeon',x,y,75,75,1,'dungeon');c.globalAlpha=1;}
  if(e.kind==='shop')this.image('dungeon',x,y,100,100,0,'dungeon');
  if(e.kind==='book')this.image('dungeon',x,y,112,112,0,'dungeon');
  if(e.kind==='rune'){this.glow(x,y-48,90,'rgba(101,187,214,.16)');this.image('dungeon',x,y,134,134,2,'dungeon');}
  if(e.kind==='event'){this.glow(x,y-18,58,'#b692e644');c.save();c.strokeStyle='#ceb2ee';c.lineWidth=2;c.beginPath();c.ellipse(x,y,22+Math.sin(this.frame/650)*3,9,0,0,Math.PI*2);c.stroke();c.restore();}
  if(e.kind==='rune'||e.kind==='boss'){c.save();c.strokeStyle='#937eba';c.lineWidth=2;for(const r of [28,34]){c.beginPath();c.ellipse(x,y,r,r*.45,0,0,Math.PI*2);c.stroke();}c.restore();}
  if(e.kind==='sign'){const img=this.images.signboards,crop=SPRITE_FRAMES.signboards?.[Object.values(MAPS).flatMap(m=>m.entities).filter(v=>v.kind==='sign').findIndex(v=>v.id===e.id)%12];if(img&&crop){const scale=90/crop.h;c.drawImage(img,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*scale,y-(crop.anchorY-crop.y)*scale,crop.w*scale,crop.h*scale);}}
  this.marker(e);
 }
 draw=()=>{this.raf=requestAnimationFrame(this.draw);const time=performance.now(),dt=Math.min((time-this.frame)/1000,.25);this.frame=time;this.engine.update(dt);
  const fps=this.engine.state.mode==='battle'?10:this.engine.state.mode!=='world'||this.engine.paused?24:this.width<650||this.height<420?30:60;if(time-this.lastPaint<1000/fps)return;const paintDt=Math.min((time-this.lastPaint)/1000,.1);this.lastPaint=time;
  const c=this.ctx,{width:w,height:h}=this;if(!w||!h)return;c.clearRect(0,0,w,h);c.fillStyle='#07141d';c.fillRect(0,0,w,h);
  const m=this.engine.map,p=this.engine.state.position,cut=this.engine.state.cutscene,focus=cut?CUTSCENES[cut.id].beats[cut.index].focus:p;const mobile=w<650,compact=w>h&&h<420;const scale=compact?Math.min(.83,Math.max(.55,h/380)):mobile?.83:Math.min(1.18,Math.max(.82,w/1150));this.camera.scale=scale;
  const wantX=Math.max(w/(2*scale),Math.min(m.width*T-w/(2*scale),focus.x*T));const wantY=Math.max(h/(2*scale),Math.min(m.height*T-h/(2*scale),focus.y*T-(compact?20:60)));
  this.camera.x+=(wantX-this.camera.x)*Math.min(1,paintDt*7);this.camera.y+=(wantY-this.camera.y)*Math.min(1,paintDt*7);
  c.save();c.translate(w/2,h/2);c.scale(scale,scale);c.translate(-this.camera.x,-this.camera.y);
  for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){const t=m.rows[y][x];c.fillStyle=this.patterns[t==='#'?'d':t]||({g:'#304a3a',p:'#697c88',d:'#1c2d40',w:'#163e53'}as Record<string,string>)[t]||'#15273a';c.fillRect(x*T-T/2,y*T-T/2,T+1,T+1);
   if(t==='i'){c.fillStyle='#95d5ed88';c.fillRect(x*T-T/2,y*T-T/2,T,T);c.strokeStyle='#bdeaff';c.beginPath();c.moveTo(x*T-20,y*T-12);c.lineTo(x*T+13,y*T+16);c.stroke();}
   if(t==='#'){c.fillStyle=m.id==='patio'?'rgba(2,12,17,.15)':'rgba(3,9,20,.76)';c.fillRect(x*T-T/2,y*T-T/2,T+1,T+1);if(m.id!=='patio'){c.strokeStyle='rgba(135,156,174,.15)';c.strokeRect(x*T-T/2+1,y*T-T/2+1,T-2,T-2);if(m.rows[y+1]?.[x]!=='#'){c.fillStyle='#364351';c.fillRect(x*T-T/2,y*T+T/2-8,T,8);this.glow(x*T,y*T+T/2,38,'rgba(0,0,0,.3)');}}}
  }
  const things:{y:number;draw:()=>void}[]=m.props.map(prop=>({y:prop.y,draw:()=>this.image(prop.asset,prop.x*T,prop.y*T,prop.w*T,prop.h*T,prop.atlas,prop.atlasSheet)}));
  const inBattle=this.engine.state.mode==='battle',entities=this.engine.activeEntities().filter(e=>!inBattle||!['mob','boss'].includes(e.kind));things.push(...entities.map(e=>({y:e.y,draw:()=>this.entity(e)})));
  if(!inBattle){
  things.push({y:p.y,draw:()=>{this.glow(p.x*T,p.y*T,46,'rgba(149,196,215,.12)');c.strokeStyle='rgba(186,216,212,.55)';c.lineWidth=1;c.beginPath();c.ellipse(p.x*T,p.y*T+4,24,8,0,0,Math.PI*2);c.stroke();drawAura(c,cosmeticOf(this.engine.state.progress,this.engine.state.heroes[0].id),p.x*T,p.y*T,time);this.actor(this.engine.state.heroes[0].id==='gabriel'&&this.engine.state.progress.gabrielForm==='lycan'?'gabriel_lycan':this.engine.state.heroes[0].id,p.x*T,p.y*T,this.engine.state.facing,this.engine.state.moving);}});
  this.canvas.dataset.auras=this.engine.state.heroes.map(h=>this.engine.state.progress.cosmeticEquipment[h.id]||'').join(',');
  }
  things.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
  if(!inBattle){for(const e of entities.filter(e=>e.kind==='warp')){const x=e.x*T,y=e.y*T,locked=!!e.minStage&&this.engine.state.stage<e.minStage,label=(locked?'🔒 ':'')+(e.to?MAPS[e.to].name:e.label);c.save();c.font='bold 16px Arial';c.textAlign='center';const width=c.measureText(label).width+28;c.fillStyle='#071725ed';c.fillRect(x-width/2,y-142,width,30);c.strokeStyle=locked?'#8c7b97':'#f3d28f';c.lineWidth=1.5;c.strokeRect(x-width/2,y-142,width,30);c.fillStyle=locked?'#c1b4ce':'#ffe6b2';c.fillText(label,x,y-122);c.fillStyle='#f3d28f';c.beginPath();c.moveTo(x-7,y-106);c.lineTo(x+7,y-106);c.lineTo(x,y-98);c.fill();c.restore();}
  }

  for(const prop of m.props){if(prop.asset==='lantern')this.glow(prop.x*T+8,prop.y*T-78,110,m.safe?'rgba(250,191,104,.19)':'rgba(112,163,218,.18)');if(prop.asset==='crystal')this.glow(prop.x*T,prop.y*T-45,75,'rgba(78,161,238,.2)');}
  const fx=this.engine.state.fieldEffect;if(fx&&Date.now()-fx.started<1800){const t=(Date.now()-fx.started)/1800;this.glow(p.x*T,p.y*T-35,50+t*140,fx.kind==='ink'?'#0b122aaa':fx.kind==='ice'?'#a9e7ff55':fx.kind==='fire'?'#ff903455':fx.kind==='shadow'?'#b066ef55':'#8df3c655');}
  if(this.engine.fieldActive('ember-light'))this.glow(p.x*T,p.y*T-30,230,'#ffc17f30');if(this.engine.fieldActive('shadow-step'))this.glow(p.x*T,p.y*T-30,90,'#a780db33');
  c.restore();const night=c.createLinearGradient(0,0,0,h);night.addColorStop(0,'rgba(6,21,36,.15)');night.addColorStop(1,'rgba(5,15,28,.32)');c.fillStyle=night;c.fillRect(0,0,w,h);
  const vignette=c.createRadialGradient(w/2,h/2,Math.min(w,h)*.25,w/2,h/2,Math.max(w,h)*.65);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'rgba(3,10,18,.5)');c.fillStyle=vignette;c.fillRect(0,0,w,h);
  c.fillStyle='rgba(213,233,217,.5)';for(let i=0;i<16;i++){const x=(i*197+Math.sin(time/3900+i)*32)%w,y=(i*103-time/70+h*50)%h;c.beginPath();c.arc(x,y,i%3===0?1.5:.7,0,Math.PI*2);c.fill();}
 }
 click(clientX:number,clientY:number){const r=this.canvas.getBoundingClientRect();const p={x:((clientX-r.left-this.width/2)/this.camera.scale+this.camera.x)/T,y:((clientY-r.top-this.height/2)/this.camera.scale+this.camera.y)/T};const e=this.engine.activeEntities().filter(e=>Math.abs(e.x-p.x)<(e.kind==='warp'?1.8:.8)&&p.y<e.y+.5&&p.y>e.y-(e.kind==='warp'?3:2.1)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];this.engine.moveTo(e||p,e?.id);}
 destroy(){this.disposed=true;cancelAnimationFrame(this.raf);this.resize.disconnect();}
}
