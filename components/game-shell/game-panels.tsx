'use client';
import type {ReactNode} from 'react';
import type {GameSession} from '@/hooks/use-game-session';
import {DialogHeader,DialogTitle,DialogDescription} from '../ui/dialog';
import {GameDialog} from '../game-dialog';
import {GameMenu} from '../game-menu';
import {GameJournal} from './game-journal';
import {GameSettings,GameHelp} from './game-system';
import {GameBag} from './game-bag';
export function GamePanels({game,installControl}:{game:GameSession;installControl?:ReactNode}){
 const {engine,s,ui,patch,shell,actions}=game;
 const {panel,menuTab,menuFocus,chosen,confirmReset}=ui;
 const setPanel=(panel:typeof ui.panel)=>patch({panel}),setConfirmReset=(confirmReset:boolean)=>patch({confirmReset}),setActiveMenuTab=(activeMenuTab:string)=>patch({activeMenuTab});
 const titleSystem=['start','selection'].includes(s.mode),replayQuestScene=actions.replayQuestScene,settings=<GameSettings game={game} installControl={installControl}/>;
 return <><GameDialog container={shell.current} open={!!panel} locked={ui.updating} onClose={actions.closePanel} className={panel==='menu'?'menu-modal':''}><DialogHeader><DialogTitle>{panel==='menu'?titleSystem?'Sistema':'Menu de aventura':panel==='help'?'Controles e regras':panel==='bag'?'Grupo e bolsa':'Diário de Stone Reach'}</DialogTitle><DialogDescription>{panel==='menu'?titleSystem?'Instale o jogo ou leve seu progresso para este navegador.':`Stone Reach · ${s.heroes.map(h=>h.name).join(' e ')}`:panel==='help'?'Escolha como explorar e conduzir o grupo.':panel==='bag'?'Os recursos acompanham o grupo durante o capítulo.':'O que o selo lembra'}</DialogDescription></DialogHeader>
   {panel==='menu'&&titleSystem&&settings}
   {panel==='menu'&&!titleSystem&&<GameMenu key={menuTab} s={s} engine={engine} initialTab={menuTab} onTabChange={setActiveMenuTab} initialFocus={menuFocus} onReplayQuestCinematic={replayQuestScene} journal={<GameJournal s={s} engine={engine} onGo={id=>{engine.paused=false;setPanel(null);engine.approach(id);}}/>} settings={settings} onClose={()=>{engine.paused=false;setPanel(null);}} onGo={id=>{engine.paused=false;setPanel(null);engine.approach(id);}}/>}
   {panel==='journal'&&<div className="journal-modal"><GameJournal s={s} engine={engine} onGo={id=>{engine.paused=false;setPanel(null);engine.approach(id);}}/><button className="primary-button" onClick={()=>setPanel(null)}>Voltar à aventura</button></div>}
   <GameBag game={game}/>
   <GameHelp game={game}/>
  </GameDialog>
  <GameDialog container={shell.current} open={confirmReset} onClose={()=>setConfirmReset(false)}><DialogTitle>Recomeçar o capítulo?</DialogTitle><DialogDescription>O progresso desta versão neste navegador será substituído por uma nova aventura.</DialogDescription><div className="reset-actions"><button className="secondary-button" onClick={()=>setConfirmReset(false)}>Cancelar</button><button className="primary-button" onClick={()=>{setConfirmReset(false);setPanel(null);engine.start(false,chosen);}}>Recomeçar</button></div></GameDialog>
</>;
}
