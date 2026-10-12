'use client';

import {RotateCcw} from 'lucide-react';
import {MAPS} from '@/lib/game/data';
import {level} from '@/lib/game/progression';
import {useGameSession} from '@/hooks/use-game-session';
import {GameHeader} from '@/components/game-shell/game-header';
import {GameExploration} from '@/components/game-shell/game-exploration';
import {GameTitle} from '@/components/game-shell/game-title';
import {GameDialogue} from '@/components/game-shell/game-dialogue';
import {GameBattle} from '@/components/game-shell/game-battle';
import {GameNotices,GameSaveConflict} from '@/components/game-shell/game-notices';
import {GamePanels} from '@/components/game-shell/game-panels';
import {CombatParty} from '@/components/combat-party';
import {LoadingScreen} from '@/components/loading-screen';
import {WorldLoadingV32} from '@/components/world-loading-v32';
import {OpeningCinematicV33} from '@/components/opening-cinematic-v33';
import {QuestCinematic} from '@/components/quest-cinematic';
import {Cutscene} from '@/components/cutscene';
import {OriginSelection} from '@/components/origin-selection';
import {GameInstallControl} from '@/components/pwa-install-control';
import battleStyles from '@/components/battle-interface.module.css';

/** The route composes scenes; browser lifecycle and input live in the session hooks. */
export default function Home(){
 const game=useGameSession();
 const {s,engine,ui,patch,audio,fullscreen,actions}=game;
 const currentHero=engine.currentHero();
 return <main className={'game-shell '+(s.mode==='battle'?battleStyles.battleMode:'')} ref={game.shell} tabIndex={-1} data-game-mode={s.mode} data-fullscreen={fullscreen.active} data-music-track={audio.currentTrack} data-music-status={audio.status}>
  <audio ref={audio.channel0} muted={!audio.sound} loop preload="none"/>
  <audio ref={audio.channel1} muted={!audio.sound} loop preload="none"/>
  {ui.opening&&<OpeningCinematicV33 onExit={actions.closeOpening} onPlaybackChange={audio.openingPlayback} onPlaybackGesture={audio.unlock} soundEnabled={audio.sound} audioBlocked={audio.status==='blocked'} onToggleSound={audio.toggle}/>}
  {!game.loaded&&!game.worldLoading&&<LoadingScreen/>}
  {game.worldLoading&&(game.worldLoading.loading||game.worldLoading.error)&&<WorldLoadingV32 status={game.worldLoading} onRetry={game.retryWorld}/>}
  <GameHeader game={game}/>
  <div className="game-body">
   <div className="portrait-tip"><RotateCcw size={17}/><span>Para jogar, vire o celular na horizontal.</span></div>
   <section className="play-column" aria-label="Área de jogo">
    <div className="world" ref={game.setViewport}>
     <canvas ref={game.canvas} role="img" aria-label={`Mapa navegável de ${MAPS[s.map].name}. Use WASD ou as setas. E para interagir. Toque nos pontos de interesse para caminhar até eles.`} onPointerUp={game.pointer.canvasPointerUp}/>
     <GameExploration game={game}/>
     {s.mode==='start'&&<GameTitle game={game}/>}
     {s.mode==='cutscene'&&(s.questCinematic?
      <QuestCinematic key={s.questCinematic.token} questId={s.questCinematic.questId} replay={s.questCinematic.replay} onComplete={()=>actions.finishQuestScene(s.questCinematic!.token)} onSkip={()=>actions.finishQuestScene(s.questCinematic!.token,true)}/>
      :<Cutscene s={s} engine={engine}/>
     )}
     {s.mode==='selection'&&<OriginSelection chosen={ui.chosen} onChoose={chosen=>patch({chosen})} onStart={()=>s.hasSave?patch({confirmReset:true}):engine.start(false,ui.chosen)} onBack={()=>engine.returnToTitle()}/>}
     {s.mode==='dialogue'&&<GameDialogue game={game}/>}
     {s.mode==='battle'&&<GameBattle game={game}/>}
     <GameNotices game={game}/>
    </div>
    {s.mode==='battle'?<CombatParty heroes={s.heroes} activeId={currentHero?.id||s.heroes.find(h=>h.id===(s.battle?.animation?.actor||s.battle?.queue[s.battle.index]))?.id} targetId={ui.target} onSelectTarget={target=>game.patch({target})} selectDisabled={!!s.battle?.result} limits={s.progress.limit} lycan={s.progress.gabrielForm==='lycan'}/>:
     s.mode==='world'?<CombatParty heroes={s.heroes} limits={s.progress.limit} lycan={s.progress.gabrielForm==='lycan'} exploration leaderId={engine.leader().id} selectDisabled={!!ui.panel||!!game.worldLoading?.loading||!!game.worldLoading?.error} onSelectHero={(_id,slot)=>engine.selectPartySlot(slot)} credits={s.progress.masterMode?'∞':s.credits} level={level(s.progress)} saving={s.saving} masterMode={s.progress.masterMode}/>:null
    }
   </section>
  </div>
  <GamePanels game={game} installControl={<GameInstallControl canUpdate={game.canUpdate} onBeforeUpdate={game.prepareUpdate} onUpdatePendingChange={game.setUpdatePending} saveTransfer={game.saveTransfer}/>}/>
  <GameSaveConflict game={game}/>
 </main>;
}
