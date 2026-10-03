import type {MapData,MapId,Prop} from './data';

// Versioned, generated art. The original PNG files retain their generated alpha.
export const ENVIRONMENT_ASSETS:Record<string,string>={
 env_floor_academy:'/assets/v25/environment/floor-academy.png',
 env_floor_depths:'/assets/v25/environment/floor-depths.png',
 env_floor_wilds:'/assets/v25/environment/floor-wilds.png',
 env_floor_water:'/assets/v25/environment/floor-water-docks.png',
 env_scenery_academy:'/assets/v25/environment/scenery-academy.png',
 env_scenery_ruins:'/assets/v25/environment/scenery-ruins.png',
 env_signboards:'/assets/v25/environment/signboards.png',
};

type Material={sheet:string;row:number;span:number};
type Theme={floor:Record<string,Material>;wall:string;edge:string;shade:string;atmosphere:[string,string];particle:string};
const material=(sheet:string,row:number,span=4):Material=>({sheet:`env_floor_${sheet}`,row,span});
const lawn=material('academy',1,5),court=material('academy',0),slate=material('depths',1),sea=material('water',0,6),deepWater=material('water',1,6),dock=material('water',2,3),ice=material('water',3,3);
const common={g:lawn,p:court,d:slate,w:sea,b:dock,i:ice};

export const ENVIRONMENT_THEMES:Record<MapId,Theme>={
 patio:{floor:{...common,'#':lawn},wall:'#162b2690',edge:'#9aab9a',shade:'#23392c08',atmosphere:['#10273508','#071f2626'],particle:'#d9f4c5'},
 arquivo:{floor:{...common,d:material('depths',0,5),'#':material('depths',0,5)},wall:'#211d28d9',edge:'#927e65',shade:'#b3844210',atmosphere:['#251d3208','#1c172332'],particle:'#f2dca7'},
 subsolo:{floor:{...common,w:deepWater,'#':slate},wall:'#0e172be3',edge:'#4d657d',shade:'#1523351a',atmosphere:['#12213e22','#09112146'],particle:'#b5d9e9'},
 camara:{floor:{...common,d:material('depths',2,5),'#':material('depths',2,5)},wall:'#11152ce3',edge:'#747098',shade:'#351f4c12',atmosphere:['#25234b25','#0b102443'],particle:'#d8c6f7'},
 porto:{floor:{...common,p:material('academy',2),'#':material('academy',2)},wall:'#27394bba',edge:'#adac90',shade:'#2a5f7706',atmosphere:['#284c6206','#082e3d25'],particle:'#c9ebf0'},
 domo:{floor:{...common,p:material('academy',3,5),'#':lawn},wall:'#16312d9c',edge:'#b7c3a1',shade:'#50735708',atmosphere:['#1c3a2408','#15352724'],particle:'#e2f3c6'},
 galeria:{floor:{...common,d:material('depths',3,5),w:deepWater,'#':material('depths',3,5)},wall:'#0b1927e3',edge:'#4e6b78',shade:'#0f3b4910',atmosphere:['#17354022','#07121d50'],particle:'#80d4df'},
 ashwood:{floor:{...common,g:material('wilds',0,5),p:material('wilds',1,4),'#':material('wilds',0,5)},wall:'#241f28bd',edge:'#746b53',shade:'#3c283116',atmosphere:['#27223512','#19152338'],particle:'#e1c6ac'},
 vigilia:{floor:{...common,g:material('wilds',0,5),p:material('wilds',2,5),w:deepWater,'#':material('wilds',2,5)},wall:'#242634db',edge:'#7f8579',shade:'#30313210',atmosphere:['#20294012','#141a283d'],particle:'#c8d2c1'},
 ashpyre:{floor:{...common,d:material('wilds',3,5),'#':material('wilds',3,5)},wall:'#261c28e3',edge:'#7e5b57',shade:'#702d1510',atmosphere:['#3e242312','#22142238'],particle:'#f3b580'},
};

/** Stable world-space choices: no visual randomness changes as the camera moves. */
export function environmentVariant(map:MapId,x:number,y:number,row=0):number{
 let seed=0;for(const ch of map)seed=(Math.imul(seed,31)+ch.charCodeAt(0))|0;
 let hash=seed^Math.imul(x+1,73856093)^Math.imul(y+1,19349663)^Math.imul(row+1,83492791);
 hash=Math.imul(hash^(hash>>>16),0x45d9f3b);return (hash^(hash>>>16))>>>0;
}

export function paintEnvironmentTile(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement>,patterns:Record<string,CanvasPattern>,map:MapData,x:number,y:number,tileSize:number){
 const tile=map.rows[y][x],theme=ENVIRONMENT_THEMES[map.id],surface=theme.floor[tile]||slate,img=images[surface.sheet];
 const dx=x*tileSize-tileSize/2,dy=y*tileSize-tileSize/2;
 if(img){
  const sw=img.width/4,sh=img.height/4,pad=2,variant=environmentVariant(map.id,Math.floor(x/surface.span),Math.floor(y/surface.span),surface.row)%4;
  const pw=(sw-pad*2)/surface.span,ph=(sh-pad*2)/surface.span;
  c.drawImage(img,variant*sw+pad+(x%surface.span)*pw,surface.row*sh+pad+(y%surface.span)*ph,pw,ph,dx,dy,tileSize+1,tileSize+1);
 }else{c.fillStyle=patterns[tile==='#'?'d':tile]||'#233544';c.fillRect(dx,dy,tileSize+1,tileSize+1);}
 c.fillStyle=theme.shade;c.fillRect(dx,dy,tileSize+1,tileSize+1);
 if(tile==='#'){c.fillStyle=theme.wall;c.fillRect(dx,dy,tileSize+1,tileSize+1);}
}

/** Structural borders remain exactly on the original collision grid. */
export function paintEnvironmentEdges(c:CanvasRenderingContext2D,map:MapData,x:number,y:number,tileSize:number){
 const tile=map.rows[y][x],theme=ENVIRONMENT_THEMES[map.id],left=x*tileSize-tileSize/2,top=y*tileSize-tileSize/2;
 if(tile==='#'&&map.rows[y+1]?.[x]&&map.rows[y+1][x]!=='#'){
  c.fillStyle=theme.edge;c.fillRect(left,top+tileSize-7,tileSize,7);
  const shadow=c.createLinearGradient(0,top+tileSize,0,top+tileSize+12);shadow.addColorStop(0,'#02081360');shadow.addColorStop(1,'#02081300');c.fillStyle=shadow;c.fillRect(left,top+tileSize,tileSize,12);
 }
 if(tile==='p'||tile==='w'||tile==='i'){
  const neighbors=[[0,-1],[1,0],[0,1],[-1,0]];
  for(let side=0;side<neighbors.length;side++){
   const [ox,oy]=neighbors[side],other=map.rows[y+oy]?.[x+ox];
   if(!other||other===tile||other==='#'||(tile==='p'&&!['g','w'].includes(other))||(tile==='w'&&other==='b'))continue;
   c.fillStyle=tile==='i'?'#bce8f2b3':tile==='w'?`${theme.edge}a8`:`${theme.edge}75`;
   if(side===0)c.fillRect(left,top,tileSize,3);if(side===1)c.fillRect(left+tileSize-3,top,3,tileSize);if(side===2)c.fillRect(left,top+tileSize-3,tileSize,3);if(side===3)c.fillRect(left,top,3,tileSize);
  }
 }
 if(tile==='b'){
  c.fillStyle='#d3c3a24d';c.fillRect(left,top,tileSize,2);
  if(map.rows[y]?.[x-1]!=='b'){c.fillStyle='#17213099';c.fillRect(left,top,4,tileSize);}
  if(map.rows[y]?.[x+1]!=='b'){c.fillStyle='#d9c7a371';c.fillRect(left+tileSize-3,top,3,tileSize);}
 }
}

type SceneryCrop={x:number;y:number;w:number;h:number;anchorX:number;anchorY:number};
const sceneryAcademy:SceneryCrop[]=[
 {x:39,y:39,w:338,h:366,anchorX:207.5,anchorY:402},{x:437,y:35,w:276,h:368,anchorX:574.5,anchorY:400},{x:818,y:35,w:172,h:376,anchorX:903.5,anchorY:408},{x:1081,y:44,w:331,h:363,anchorX:1246,anchorY:404},
 {x:46,y:446,w:297,h:206,anchorX:194,anchorY:649},{x:412,y:444,w:296,h:205,anchorX:559.5,anchorY:646},{x:757,y:457,w:286,h:194,anchorX:899.5,anchorY:648},{x:1109,y:450,w:300,h:199,anchorX:1258.5,anchorY:646},
 {x:84,y:675,w:214,h:352,anchorX:190.5,anchorY:1024},{x:454,y:675,w:208,h:352,anchorX:557.5,anchorY:1024},{x:794,y:678,w:218,h:348,anchorX:902.5,anchorY:1023},{x:1136,y:678,w:256,h:349,anchorX:1263.5,anchorY:1024},
];
const sceneryRuins:SceneryCrop[]=[
 {x:133,y:31,w:133,h:347,anchorX:199,anchorY:375},{x:491,y:31,w:125,h:348,anchorX:553,anchorY:376},{x:843,y:31,w:131,h:347,anchorX:908,anchorY:375},{x:1196,y:31,w:130,h:347,anchorX:1260.5,anchorY:375},
 {x:50,y:414,w:273,h:289,anchorX:186,anchorY:700},{x:411,y:404,w:293,h:307,anchorX:557,anchorY:708},{x:771,y:410,w:279,h:299,anchorX:910,anchorY:706},{x:1122,y:421,w:280,h:290,anchorX:1261.5,anchorY:708},
 {x:29,y:729,w:335,h:324,anchorX:196,anchorY:1050},{x:409,y:725,w:298,h:328,anchorX:557.5,anchorY:1050},{x:740,y:729,w:340,h:326,anchorX:909.5,anchorY:1052},{x:1111,y:730,w:303,h:324,anchorX:1262,anchorY:1051},
];

export function environmentScenery(map:MapId,prop:Prop,index:number):{sheet:string;crop:SceneryCrop}|undefined{
 const variant=index%4;
 if(prop.asset==='tree')return {sheet:'env_scenery_academy',crop:sceneryAcademy[variant]};
 if(prop.asset==='flowers')return {sheet:'env_scenery_academy',crop:sceneryAcademy[4+variant]};
 if(prop.asset==='shelf')return {sheet:'env_scenery_academy',crop:sceneryAcademy[8+variant]};
 if(prop.asset==='dungeon'&&[3,4].includes(prop.atlas??-1))return {sheet:'env_scenery_ruins',crop:sceneryRuins[(prop.atlas===3?4:0)+variant]};
 if(prop.asset==='expedition'&&prop.atlas===0&&['ashwood','vigilia'].includes(map))return {sheet:'env_scenery_ruins',crop:sceneryRuins[8+variant]};
 return undefined;
}
