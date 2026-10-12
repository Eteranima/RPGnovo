'use client';
import type {GameSession} from '@/hooks/use-game-session';
import {OpeningGallery} from '../opening-gallery';
import {TitleAtmosphere} from '../title-atmosphere';
import {HudIcon} from '../hud-icon';
import {NativeMenuFrame} from '../native-menu-frame';
export function GameTitle({game}:{game:GameSession}){
 const {engine,s,ui,actions}=game,{titleArmed}=ui;
 const loaded=game.loaded,musicStatus=game.audio.status,activateTitle=game.activateTitle,showOpening=actions.showOpening,setGameSound=game.audio.setEnabled;
 return <div className="start-screen animated-title"><OpeningGallery/><div className="title-shade"/><TitleAtmosphere/><div className="start-copy">
  <span className="eyebrow">STONE REACH</span><h1>Éter <em>Anima</em></h1><div className="title-rule"/><h2>O que o selo lembra</h2>
  <div className="start-actions">
   {!titleArmed?<button className="primary-button press-start" onClick={activateTitle} disabled={!loaded}><NativeMenuFrame/>{loaded?'PRESS START':'Preparando Stone Reach…'}<small>Enter ou toque</small></button>:<>
    {s.hasSave&&<button className="primary-button" onClick={()=>engine.start(true)} disabled={!loaded}><NativeMenuFrame/><HudIcon name="journal"/>Continuar aventura</button>}
    <button className={s.hasSave?'secondary-button':'primary-button'} onClick={()=>engine.selectProtagonist()} disabled={!loaded}><NativeMenuFrame/><HudIcon name="party"/>Começar aventura</button>
   </>}
   <button type="button" className="secondary-button" onClick={showOpening} disabled={!loaded} data-watch-opening="v33"><NativeMenuFrame/><HudIcon name="scenes"/>Assistir abertura</button>
   <button type="button" className="text-button" onClick={game.openSystem} disabled={!loaded}><HudIcon name="settings"/>Instalar / transferir progresso</button>
  </div>
  <div className="start-meta">{titleArmed?(musicStatus==='playing'?<><HudIcon name="audioOn"/>Press Start Screen · em loop</>:<button className="text-button" onClick={()=>setGameSound(true)}>Ativar trilha de abertura</button>):<><HudIcon name="help"/>Teclado, mouse ou toque</>}</div>
 </div></div>;
}
