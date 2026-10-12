import type {CSSProperties} from 'react';

// Native windows of the approved 1774 x887 RGBA frame. Jewels and corners keep
// their own aspect ratio; only the plain painted rails stretch with the panel.
const pieces=[
 ['nw',23,62,215,215],['ne',1536,62,215,215],
 ['sw',23,590,215,215],['se',1536,590,215,215],
 ['top',260,96,420,21],['bottom',260,747,420,24],
 ['left',45,300,26,100],['right',1701,300,26,100],
 ['ruby',776,42,224,124],['sapphire',780,698,219,128],
] as const;

export function NativeMenuFrame({className=''}:{className?:string}){
 return <span className={`native-menu-frame ${className}`} aria-hidden="true">{pieces.map(([name,x,y,w,h])=><i key={name} data-frame-piece={name} style={{backgroundSize:`${1774/w*100}% ${887/h*100}%`,backgroundPosition:`${x/(1774-w)*100}% ${y/(887-h)*100}%`,aspectRatio:`${w}/${h}`} as CSSProperties}/>)}</span>;
}
