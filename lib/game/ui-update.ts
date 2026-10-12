import type {GameEngine} from './engine';
import type {GameUiSessionState} from './ui-session';

export function canApplyGameUpdate(engine:GameEngine,ui:GameUiSessionState,loading?:{loading:boolean;error?:unknown}|null){
 const s=engine.state;
 return !s.saveConflictV36&&['world','start','selection'].includes(s.mode)&&!s.questCinematic&&!s.eventActivityV38&&!s.autoChessSessionV39&&!s.gachaBusy&&!s.summonBusy&&!ui.opening&&!ui.confirmReset&&!(loading?.loading||loading?.error);
}
/** An explicit update only proceeds after the current safe state is saved. */
export function prepareGameUpdate(engine:GameEngine,ui:GameUiSessionState,loading?:{loading:boolean;error?:unknown}|null){
 if(!canApplyGameUpdate(engine,ui,loading))return false;
 if(engine.state.mode!=='world')return true;
 engine.clearMovement();engine.paused=true;
 return engine.save(true);
}
