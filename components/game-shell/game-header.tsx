'use client';
import type {GameSession} from '@/hooks/use-game-session';
import {HudButton,HudIcon} from '../hud-icon';
import {QUESTS,ACHIEVEMENTS,BESTIARY} from '@/lib/game/progression';
import {pendingChessRewardsV39} from '@/lib/game/autoChessProgressV39';
export function GameHeader({game}:{game:GameSession}){const {engine,s,ui,actions,patch}=game; const {panel,activeMenuTab}=ui; const openMenu=actions.openMenu,setPanel=(panel:typeof ui.panel)=>patch({panel});
const {audio,fullscreen}=game,sound=audio.sound,fullScreen=fullscreen.active,toggleMusic=audio.toggle,toggleFullscreen=fullscreen.toggle;
const rewards=pendingChessRewardsV39(s.progress.autoChessV39,s.progress.eventActivitiesV38)+engine.questJournalV31().filter(q=>q.status==='complete').length+QUESTS.filter(q=>q.value(s)>=q.goal&&!s.progress.questClaims.includes(q.id)&&(!q.request||s.progress.requests.includes(q.request))).length+ACHIEVEMENTS.filter(a=>a.test(s)&&!s.progress.achievementClaims.includes(a.id)).length+BESTIARY.reduce((n,m)=>n+(m.set?[5,25,50]:[1]).filter(goal=>(s.progress.kills[m.id]||0)>=goal&&!s.progress.bestiaryClaims.includes(`${m.id}-${goal}`)).length,0);
return <header className="game-header">
   <div className="brand"><HudIcon name="emblem"/><span>ÉTER <em>ANIMA</em></span><small>STONE REACH</small></div>
   <div className="chapter-label"><HudIcon name="events"/><span>O que o selo lembra</span><i>01</i></div>
   <nav aria-label="Menu do jogo">
    <HudButton icon="journal" label="Abrir diário de missão" caption="Diário" shortcut="L" active={panel==='menu'&&activeMenuTab==='quests'} onClick={()=>openMenu('quests')} disabled={s.mode!=='world'}/>
    <HudButton icon="mail" label="Abrir MAIL · presente inicial" caption="MAIL" active={panel==='menu'&&activeMenuTab==='mail'} badge={!s.progress.starterMailClaimed||s.progress.starterSelectorPending?1:0} badgeLabel="Presente inicial disponível" onClick={()=>openMenu('mail')} disabled={s.mode!=='world'}/>
    <HudButton icon="menu" label="Abrir menu de aventura" caption="Aventura" shortcut="Enter" active={panel==='menu'&&!['quests','mail','skills','gear','bag','settings'].includes(activeMenuTab)} badge={rewards} badgeLabel={`${rewards} recompensas disponíveis`} onClick={()=>openMenu(rewards?'rewards':'party')} disabled={s.mode!=='world'}/>
    <HudButton icon="skills" label="Abrir habilidades" caption="Técnicas" shortcut="K" active={panel==='menu'&&activeMenuTab==='skills'} onClick={()=>openMenu('skills')} disabled={s.mode!=='world'}/>
    <HudButton icon="gear" label={s.progress.unseenGear.length?`Ver ${s.progress.unseenGear.length} equipamentos novos`:'Abrir equipamentos'} caption="Equipar" active={panel==='menu'&&activeMenuTab==='gear'} badge={s.progress.unseenGear.length} badgeLabel={`${s.progress.unseenGear.length} equipamentos novos`} onClick={()=>openMenu('gear',s.progress.unseenGear[0])} disabled={s.mode!=='world'}/>
    <HudButton icon="bag" label="Abrir bolsa" caption="Bolsa" shortcut="I" active={panel==='menu'&&activeMenuTab==='bag'} onClick={()=>openMenu('bag')} disabled={s.mode!=='world'}/>
    <HudButton icon={fullScreen?'fullscreenExit':'fullscreenEnter'} label={fullScreen?'Sair da tela cheia':'Entrar em tela cheia'} caption="Tela cheia" active={fullScreen} onClick={()=>void toggleFullscreen()}/>
    <HudButton icon={sound?'audioOn':'audioOff'} label={sound?'Desativar som':'Ativar som'} caption={sound?'Som ativo':'Sem som'} shortcut="P" active={sound} onClick={toggleMusic}/>
    <HudButton icon="help" label="Abrir controles e sistema" caption="Controles" active={panel==='help'||panel==='menu'&&activeMenuTab==='settings'} onClick={()=>s.mode==='world'?openMenu('settings'):setPanel('help')} disabled={s.mode==='battle'||s.mode==='dialogue'||s.mode==='cutscene'}/>
   </nav>
  </header>;}
