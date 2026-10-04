import type {CSSProperties} from 'react';
import {ASSETS,type Hero} from '@/lib/game/data';
import type {Battle} from '@/lib/game/engine';
import {isHeroCardId} from '@/lib/game/heroCardArt';
import {COMBAT_V30_ASSETS} from '@/lib/art/combatV30';
import styles from './turn-order.module.css';

export type TurnOrderProps={battle:Battle;heroes:Hero[];lycan?:boolean};
export function TurnOrder({battle,heroes,lycan=false}:TurnOrderProps){
 const entries=battle.queue.slice(0,6);
 return <div className={styles.order} style={{'--turn-count':entries.length} as CSSProperties} role="list" aria-label={'Ordem de turnos · rodada '+battle.round} data-turn-order>
  <span className={styles.round}>RODADA<b>{battle.round}</b></span>
  {entries.map((id,index)=>{
   const enemy=id==='enemy',current=index===battle.index,hero=heroes.find(h=>h.id===id),duel=enemy&&!!battle.eventId?.startsWith('recruit-'),portraitId=enemy?battle.asset:id==='gabriel'&&lycan?'gabriel_lycan':id;
   const label=enemy?duel?'Desafiante':battle.boss?'Chefe':'Inimigo':hero?.name||id;
   const source=ASSETS['face_'+portraitId]||ASSETS['dlg_'+portraitId]||ASSETS[portraitId],legacyRow={ashwolf:0,moth:50,cinder:100}[portraitId as 'ashwolf'|'moth'|'cinder'];
   return <div className={styles.turn} data-current={current||undefined} data-enemy={enemy||undefined} data-acted={index<battle.index||undefined} role="listitem" aria-current={current?'step':undefined} aria-label={label+' · '+(current?'agora':index<battle.index?'já agiu':'a seguir')} key={id}>
    <img className={styles.plate} src={COMBAT_V30_ASSETS[enemy?'turn_enemy':current?'turn_active':'turn_waiting']} alt="" draggable={false}/>
    <span className={styles.portrait}>{enemy&&!duel&&legacyRow!==undefined?<span className={styles.enemySprite} style={{backgroundImage:'url('+ASSETS[portraitId]+')',backgroundPosition:'0% '+legacyRow+'%'}}/>:<img src={source} alt="" draggable={false} data-face={isHeroCardId(portraitId)||portraitId==='gabriel_lycan'||undefined}/>}</span>
    <span className={styles.label}><strong>{label}</strong><small>{current?'Agora':index<battle.index?'Agiu':'A seguir'}</small></span>
   </div>;
  })}
 </div>;
}
