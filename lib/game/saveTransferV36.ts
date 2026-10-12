import type {Save} from './engine';
import type {PwaSavePreview} from '../pwa/save-transfer';
export const SAVE_TRANSFER_BACKUP_KEY_V36='eter-anima-save-import-backup-v36';
export type SaveTransferV36={kind:'eter-anima-save';formatVersion:1;savedAt:string;save:Save;preferences:{audio:{enabled:boolean;volume:number};battleSpeed:1|2}};
export function parseSaveTransferV36(text:string,validate:(raw:string|null)=>Save|null):{save:Save;preferences?:SaveTransferV36['preferences'];savedAt?:string}|null{
 try{
  if(typeof text!=='string'||new TextEncoder().encode(text).byteLength>2*1024*1024)return null;
  const value=JSON.parse(text);
  if(value?.kind==='eter-anima-save'){
   if(value.formatVersion!==1)return null;const preferences=value.preferences,audio=preferences?.audio;
   if(!audio||typeof audio.enabled!=='boolean'||!Number.isFinite(audio.volume)||audio.volume<0||audio.volume>1||![1,2].includes(preferences.battleSpeed))return null;
   const save=validate(JSON.stringify(value.save));if(!save)return null;
   return {save,preferences:{audio:{enabled:audio.enabled,volume:audio.volume},battleSpeed:preferences.battleSpeed},...(typeof value.savedAt==='string'&&Number.isFinite(Date.parse(value.savedAt))?{savedAt:value.savedAt}:{})};
  }
  const save=validate(text);return save?{save}:null;
 }catch{return null;}
}
export function saveTransferPreviewV36(packet:NonNullable<ReturnType<typeof parseSaveTransferV36>>,mapName:string,level:number):PwaSavePreview{return {mapName,level,heroNames:packet.save.heroes.map(hero=>hero.name),elapsedSeconds:packet.save.elapsed,...(packet.savedAt?{savedAt:packet.savedAt}:{})};}
