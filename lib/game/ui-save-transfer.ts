import type {GameEngine} from './engine';
import {readAudioPreferences} from './music';
import {canApplyGameUpdate} from './ui-update';
import type {GameUiSessionState} from './ui-session';
import type {WorldLoadingStatusV32} from './worldAssetsV32';

/** Import is explicit; a package can silence this browser, never silently unmute it. */
export function importGameSaveTransfer(engine:GameEngine,text:string,ui:GameUiSessionState,loading:WorldLoadingStatusV32|null|undefined,callbacks:{sound:(enabled:boolean)=>void;volume:(volume:number)=>void;returnToTitle:()=>void}){
 if(ui.updating||!['start','selection'].includes(engine.state.mode)||!canApplyGameUpdate(engine,ui,loading))return false;
 const previouslyEnabled=engine.sound;
 if(!engine.importSavePwa(text))return false;
 const imported=readAudioPreferences();callbacks.volume(imported.volume);callbacks.sound(previouslyEnabled&&imported.enabled);callbacks.returnToTitle();return true;
}
