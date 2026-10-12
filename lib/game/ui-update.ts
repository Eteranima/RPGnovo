import {SAVE_KEY,type GameEngine} from './engine';
import type {GameUiSessionState} from './ui-session';

export function canApplyGameUpdate(engine:GameEngine,ui:GameUiSessionState,loading?:{loading:boolean;error?:unknown}|null){
 const s=engine.state;
 const chessSafe=!s.autoChessSessionV39||engine.autoChessV39().run?.phase==='prepare';
 return !s.saveConflictV36&&['world','start','selection'].includes(s.mode)&&!s.battle&&!s.dialogue&&!s.cutscene&&!s.questCinematic&&!s.eventActivityV38&&chessSafe&&!s.gachaBusy&&!s.summonBusy&&!ui.opening&&!ui.confirmReset&&!(loading?.loading||loading?.error);
}
/** Confirm the exact persisted adventure again after asynchronous activation. */
export function verifyGameUpdate(engine:GameEngine,ui:GameUiSessionState,loading?:{loading:boolean;error?:unknown}|null){
 if(!canApplyGameUpdate(engine,ui,loading)||engine.checkSaveConflictV36())return false;
 try {const saved=localStorage.getItem(SAVE_KEY);return engine.state.mode!=='world'||!!engine.saved&&saved===JSON.stringify(engine.saved);}catch{return false;}
}
/** Promotion only proceeds after the current safe state is saved and read back. */
export function prepareGameUpdate(engine:GameEngine,ui:GameUiSessionState,loading?:{loading:boolean;error?:unknown}|null){
 if(!canApplyGameUpdate(engine,ui,loading))return false;
 if(engine.state.mode!=='world')return verifyGameUpdate(engine,ui,loading);
 engine.clearMovement();engine.paused=true;
 return engine.save(true)&&verifyGameUpdate(engine,ui,loading);
}
