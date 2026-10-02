'use client';
import {useEffect,useRef} from 'react';
/** Eight generated poses are interpolated on a canvas; background is a separate layer. */
export function TitleAnimation(){const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const cv=canvas.current!,c=cv.getContext('2d')!,img=new Image();let raf=0,stopped=false,last=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  img.onload=()=>{if(stopped)return;cv.dataset.artReady='true';const started=performance.now();const draw=(now:number)=>{if(stopped)return;raf=requestAnimationFrame(draw);if(now-last<1000/30)return;last=now;const {width:w,height:h}=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(!w||!h)return;if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);const phase=reduced?0:(now-started)/420,frame=Math.floor(phase)%8,next=(frame+1)%8,blend=reduced?0:phase%1,scale=Math.min(w/384,h/485);const x=w/2-192*scale,y=h-466*scale;
   for(const [index,alpha] of [[frame,1-blend],[next,blend]]){if(!alpha)continue;c.globalAlpha=alpha;c.drawImage(img,(index%4)*384,Math.floor(index/4)*512,384,512,x,y,384*scale,512*scale);}c.globalAlpha=1;cv.dataset.frame=String(frame);const seen=new Set((cv.dataset.paintedFrames||'').split(',').filter(Boolean));seen.add(String(frame));cv.dataset.paintedFrames=[...seen].join(',');};draw(performance.now());};
  img.src='/assets/characters/title-pair-v13.webp';return()=>{stopped=true;cancelAnimationFrame(raf);img.onload=null;};
 },[]);
 return <canvas ref={canvas} className="title-animation" role="img" aria-label="Seiji e Ophelia: cabelos e roupas ao vento, Tinta e Gelo em uma animação de oito frames"/>;
}
