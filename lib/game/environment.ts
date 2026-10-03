import type {MapData,MapId,Prop} from './data';
import {ENVIRONMENT_CROPS,FLOOR_ROWS,type EnvironmentCrop} from './environmentArt';
export {ENVIRONMENT_CROPS,FLOOR_ROWS} from './environmentArt';

// Generated anime cel-shaded PNGs; original pixel bytes and alpha are preserved.
export const ENVIRONMENT_ASSETS:Record<string,string>={
 env_floor_academy:'/assets/v26/environment/floor-academy.png',
 env_floor_depths:'/assets/v26/environment/floor-depths.png',
 env_floor_wilds:'/assets/v26/environment/floor-wilds.png',
 env_floor_water:'/assets/v26/environment/floor-water-docks.png',
 env_scenery_academy:'/assets/v26/environment/scenery-academy.png',
 env_scenery_ruins:'/assets/v26/environment/scenery-ruins.png',
 env_utilities:'/assets/v26/environment/utilities.png',
 env_harbor:'/assets/v26/environment/harbor.png',
 env_boundaries:'/assets/v26/environment/boundaries.png',
 env_architecture:'/assets/v26/environment/academy.png',
 env_signboards:'/assets/v26/environment/signboards.png',
 env_exits:'/assets/v26/environment/exits.png',
 env_wallcaps:'/assets/v26/environment/wall-caps.png',
};
type Material={sheet:string;row:number;span:number};
type Theme={floor:Record<string,Material>;boundary:number;edge:string;atmosphere:[string,string];particle:string};
const material=(sheet:string,row:number,span=4):Material=>({sheet:`env_floor_${sheet}`,row,span});
const lawn=material('academy',1,5),court=material('academy',0),slate=material('depths',1),sea=material('water',0,6),deepWater=material('water',1,6),dock=material('water',2,3),ice=material('water',3,3);
const common={g:lawn,p:court,d:slate,w:sea,b:dock,i:ice};
export const ENVIRONMENT_THEMES:Record<MapId,Theme>={
 patio:{floor:{...common,'#':lawn},boundary:1,edge:'#bbc79a',atmosphere:['#b6d6db00','#42584d09'],particle:'#e2f2bf'},
 arquivo:{floor:{...common,d:material('depths',0,5),'#':material('depths',0,5)},boundary:0,edge:'#c9b088',atmosphere:['#ddc68c02','#614e460c'],particle:'#f2dca7'},
 subsolo:{floor:{...common,w:deepWater,'#':slate},boundary:0,edge:'#a1b6c9',atmosphere:['#233d6005','#0e223d18'],particle:'#b5d9e9'},
 camara:{floor:{...common,d:material('depths',2,5),'#':material('depths',2,5)},boundary:0,edge:'#b4a9cd',atmosphere:['#7975b308','#30295818'],particle:'#d8c6f7'},
 porto:{floor:{...common,p:material('academy',2),'#':material('academy',2)},boundary:0,edge:'#d5c8aa',atmosphere:['#aacddb00','#3f677907'],particle:'#c9ebf0'},
 domo:{floor:{...common,p:material('academy',3,5),'#':lawn},boundary:1,edge:'#c8d7ad',atmosphere:['#b6d4a500','#4c785508'],particle:'#e2f3c6'},
 galeria:{floor:{...common,d:material('depths',3,5),w:deepWater,'#':material('depths',3,5)},boundary:2,edge:'#8ab9bf',atmosphere:['#55959f05','#173b521a'],particle:'#80d4df'},
 ashwood:{floor:{...common,g:material('wilds',0,5),p:material('wilds',1,4),'#':material('wilds',0,5)},boundary:2,edge:'#aaa17e',atmosphere:['#b6a7c108','#4a3c5312'],particle:'#e1c6ac'},
 vigilia:{floor:{...common,g:material('wilds',0,5),p:material('wilds',2,5),w:deepWater,'#':material('wilds',2,5)},boundary:2,edge:'#bac2af',atmosphere:['#a6b5c108','#414b6012'],particle:'#c8d2c1'},
 ashpyre:{floor:{...common,d:material('wilds',3,5),'#':material('wilds',3,5)},boundary:2,edge:'#aa8e79',atmosphere:['#b5785108','#52374c16'],particle:'#f3b580'},
};
/** Choices are stable in world space and never change with camera/time. */
export function environmentVariant(map:MapId,x:number,y:number,row=0):number{
 let seed=0;for(const ch of map)seed=(Math.imul(seed,31)+ch.charCodeAt(0))|0;
 let hash=seed^Math.imul(x+1,73856093)^Math.imul(y+1,19349663)^Math.imul(row+1,83492791);
 hash=Math.imul(hash^(hash>>>16),0x45d9f3b);return (hash^(hash>>>16))>>>0;
}
export function paintEnvironmentTile(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement>,patterns:Record<string,CanvasPattern>,map:MapData,x:number,y:number,tileSize:number){
 const tile=map.rows[y][x],theme=ENVIRONMENT_THEMES[map.id],surface=theme.floor[tile]||slate,img=images[surface.sheet];
 const dx=x*tileSize-tileSize/2,dy=y*tileSize-tileSize/2;
 if(img){
  const rows=FLOOR_ROWS[surface.sheet],sw=img.width/4,pad=4,sy=rows[surface.row],sh=rows[surface.row+1]-sy;
  const variant=environmentVariant(map.id,Math.floor(x/surface.span),Math.floor(y/surface.span),surface.row)%4;
  const pw=(sw-pad*2)/surface.span,ph=(sh-pad*2)/surface.span;
  c.drawImage(img,variant*sw+pad+(x%surface.span)*pw,sy+pad+(y%surface.span)*ph,pw,ph,dx,dy,tileSize+1,tileSize+1);
 }else if(patterns[tile==='#'?'d':tile]){c.fillStyle=patterns[tile==='#'?'d':tile];c.fillRect(dx,dy,tileSize+1,tileSize+1);}
 // Blocked cells use real illustrated masonry/hedge/rock modules. No opaque wall fill or rectangular shadow.
 if(tile==='#'&&theme.boundary!==1&&images.env_wallcaps){
  const caps=images.env_wallcaps,sw=caps.width/4,sh=caps.height/2,pad=5,row=theme.boundary===2?1:0,span=3;
  const variant=environmentVariant(map.id,Math.floor(x/span),Math.floor(y/span),row)%4,pw=(sw-pad*2)/span,ph=(sh-pad*2)/span;
  c.drawImage(caps,variant*sw+pad+(x%span)*pw,row*sh+pad+(y%span)*ph,pw,ph,dx,dy,tileSize+1,tileSize+1);
 }else if(tile==='#'&&images.env_boundaries){
  const crop=ENVIRONMENT_CROPS.boundaries[theme.boundary*4+environmentVariant(map.id,x,y)%4],size=Math.min(crop.w,crop.h);
  // Horizontal boundary modules intentionally repeat their center section; no adjacent sprite enters the source crop.
  c.drawImage(images.env_boundaries,crop.x+(crop.w-size)/2,crop.y,size,crop.h,dx,dy,tileSize+1,tileSize+1);
 }
}
/** Thin shore and paving curbs stay aligned with the original navigation grid. */
export function paintEnvironmentEdges(c:CanvasRenderingContext2D,map:MapData,x:number,y:number,tileSize:number,images?:Record<string,HTMLImageElement>){
 const tile=map.rows[y][x],theme=ENVIRONMENT_THEMES[map.id],left=x*tileSize-tileSize/2,top=y*tileSize-tileSize/2;
 if(tile==='#'&&theme.boundary!==1){
  // A single exposed facade below a continuous raised cap; no repeated front face on interior rows.
  if(map.rows[y+1]?.[x]!=='#'&&images?.env_boundaries){const crop=ENVIRONMENT_CROPS.boundaries[theme.boundary*4+environmentVariant(map.id,x,y)%4],height=Math.min(tileSize*.55,tileSize*crop.h/crop.w);c.drawImage(images.env_boundaries,crop.x,crop.y,crop.w,crop.h,left,top+tileSize-height,tileSize+1,height);}
  if(map.rows[y-1]?.[x]!=='#'){c.fillStyle='#a9bdd279';c.fillRect(left,top,tileSize,2);}
  if(map.rows[y]?.[x-1]!=='#'){c.fillStyle='#adc1d08a';c.fillRect(left,top,2,tileSize);}
  if(map.rows[y]?.[x+1]!=='#'){c.fillStyle='#344456a0';c.fillRect(left+tileSize-2,top,2,tileSize);}
 }
 if(tile==='p'||tile==='w'||tile==='i'){
  const neighbors=[[0,-1],[1,0],[0,1],[-1,0]];
  for(let side=0;side<neighbors.length;side++){
   const [ox,oy]=neighbors[side],other=map.rows[y+oy]?.[x+ox];
   if(!other||other===tile||other==='#'||(tile==='p'&&!['g','w'].includes(other))||(tile==='w'&&other==='b'))continue;
   c.fillStyle=tile==='i'?'#dbf7fa95':tile==='w'?`${theme.edge}85`:`${theme.edge}65`;
   if(side===0)c.fillRect(left,top,tileSize,2);if(side===1)c.fillRect(left+tileSize-2,top,2,tileSize);if(side===2)c.fillRect(left,top+tileSize-2,tileSize,2);if(side===3)c.fillRect(left,top,2,tileSize);
  }
 }
 if(tile==='b'){c.fillStyle='#ead5b533';c.fillRect(left,top,tileSize,1);}
}
/** Blend organic patch boundaries once in the cached map painting, leaving source PNGs untouched. */
export function blendEnvironmentSeams(c:CanvasRenderingContext2D,canvas:HTMLCanvasElement,map:MapData,tileSize:number):number{
 const strip=document.createElement('canvas'),layer=document.createElement('canvas');let count=0;
 const blend=(ax:number,ay:number,bx:number,by:number,dx:number,dy:number,horizontal:boolean)=>{
  const width=horizontal?tileSize:tileSize*2,height=horizontal?tileSize*2:tileSize;
  strip.width=layer.width=width;strip.height=layer.height=height;
  const s=strip.getContext('2d')!,l=layer.getContext('2d')!;
  s.drawImage(canvas,ax,ay,tileSize,tileSize,0,0,width,height);
  l.drawImage(canvas,bx,by,tileSize,tileSize,0,0,width,height);
  const mask=l.createLinearGradient(0,0,horizontal?0:width,horizontal?height:0);mask.addColorStop(0,'#ffffff00');mask.addColorStop(1,'#ffffffff');
  l.globalCompositeOperation='destination-in';l.fillStyle=mask;l.fillRect(0,0,width,height);l.globalCompositeOperation='source-over';
  s.drawImage(layer,0,0);c.drawImage(strip,dx-tileSize/2,dy-tileSize/2);count++;
 };
 const organic=(tile:string)=>tile==='w'||tile==='g',floor=ENVIRONMENT_THEMES[map.id].floor;
 // Vertical seams first; horizontal strips read the already blended painting so crossings stay smooth.
 for(let y=0;y<map.height;y++)for(let x=1;x<map.width;x++){const tile=map.rows[y][x],span=floor[tile]?.span;if(organic(tile)&&x%span===0&&map.rows[y][x-1]===tile)blend((x-1)*tileSize,y*tileSize,x*tileSize,y*tileSize,(x-1)*tileSize,y*tileSize,false);}
 for(let y=1;y<map.height;y++)for(let x=0;x<map.width;x++){const tile=map.rows[y][x],span=floor[tile]?.span;if(organic(tile)&&y%span===0&&map.rows[y-1][x]===tile)blend(x*tileSize,(y-1)*tileSize,x*tileSize,y*tileSize,x*tileSize,(y-1)*tileSize,true);}
 return count;
}
export type EnvironmentArt={sheet:string;crop:EnvironmentCrop};
const art=(sheet:string,index:number):EnvironmentArt=>({sheet:`env_${sheet}`,crop:ENVIRONMENT_CROPS[sheet.replace('scenery_','')][index]});
export function environmentScenery(map:MapId,prop:Prop,index:number):EnvironmentArt|undefined{
 const variant=index%4;
 if(prop.asset==='tree')return art('scenery_academy',variant);
 if(prop.asset==='flowers')return art('scenery_academy',4+variant);
 if(prop.asset==='shelf')return art('scenery_academy',8+variant);
 if(prop.asset==='dungeon'&&[3,4].includes(prop.atlas??-1))return art('scenery_ruins',(prop.atlas===3?4:0)+variant);
 if(prop.asset==='expedition'&&prop.atlas===0&&['ashwood','vigilia'].includes(map))return art('scenery_ruins',8+variant);
 return undefined;
}
/** Fixed story object identities retain their coordinates and interaction semantics. */
export function environmentObject(key:string,atlas?:number,sheet='props'):EnvironmentArt|undefined{
 if(key==='academy')return art('architecture',0);
 if(key==='stairs')return art('utilities',6);
 if(key==='lantern')return art('utilities',0);
 if(key==='crystal')return art('utilities',1);
 if(key==='harbor'||sheet==='harbor')return art('harbor',atlas??0);
 if(key==='expedition'||sheet==='expedition'){
  const utility:{[index:number]:number}={1:9,3:8,4:7};const selected=utility[atlas??-1];
  if(selected!==undefined)return art('utilities',selected);
 }
 if(key==='dungeon'||sheet==='dungeon'){
  const utility:{[index:number]:number}={0:2,1:3,2:5,5:4};const selected=utility[atlas??-1];
  if(selected!==undefined)return art('utilities',selected);
 }
 return undefined;
}
