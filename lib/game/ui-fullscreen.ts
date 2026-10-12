type WebkitElement=HTMLElement&{webkitRequestFullscreen?:()=>Promise<void>|void};
type WebkitDocument=Document&{webkitFullscreenElement?:Element;webkitExitFullscreen?:()=>Promise<void>|void};
export type FullscreenEnvironment={document:WebkitDocument;window:Pick<Window,'matchMedia'>;screen:Screen};
const environment=():FullscreenEnvironment=>({document,window,screen});
export function isGameFullscreen(doc:WebkitDocument){return !!(doc.fullscreenElement||doc.webkitFullscreenElement);}
export function subscribeGameFullscreen(onChange:(active:boolean)=>void,env=environment()){
 const sync=()=>onChange(isGameFullscreen(env.document));
 env.document.addEventListener('fullscreenchange',sync);env.document.addEventListener('webkitfullscreenchange',sync);
 sync();
 return()=>{env.document.removeEventListener('fullscreenchange',sync);env.document.removeEventListener('webkitfullscreenchange',sync);};
}
export async function toggleGameFullscreen(game:HTMLElement|null,callbacks:{clearMovement:()=>void;toast:(text:string)=>void},env=environment()){
 if(!game)return;
 callbacks.clearMovement();callbacks.toast('');
 try{
  const doc=env.document;
  if(isGameFullscreen(doc)){
   if(doc.exitFullscreen)await doc.exitFullscreen();else await doc.webkitExitFullscreen?.();
   return;
  }
  if(game.requestFullscreen)await game.requestFullscreen();
  else if((game as WebkitElement).webkitRequestFullscreen)await (game as WebkitElement).webkitRequestFullscreen!();
  else throw new Error('unsupported');
  const orientation=env.screen.orientation as ScreenOrientation&{lock?:(mode:string)=>Promise<void>};
  if(env.window.matchMedia('(pointer:coarse)').matches)try{await orientation?.lock?.('landscape');}catch{/* Rotation remains the player's choice. */}
 }catch{callbacks.toast('Tela cheia indisponível aqui. Abra o jogo no Chrome ou Safari e vire o celular na horizontal.');}
}
