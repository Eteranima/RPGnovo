import type {CSSProperties} from 'react';
import {ASSETS,type Hero} from '@/lib/game/data';
import type {Battle} from '@/lib/game/engine';
import {heroArtIdV36} from '@/lib/game/variantsV36';
import {heroUiNameV36} from '@/lib/game/heroUiNameV36';
import {isHeroCardId} from '@/lib/game/heroCardArt';
import styles from './turn-order.module.css';

export type TurnOrderProps={battle:Battle;heroes:Hero[];lycan?:boolean};
export function TurnOrder({battle,heroes,lycan=false}:TurnOrderProps){
 const entries=battle.queue;
 return <div className={styles.order} style={{'--turn-count':entries.length} as CSSProperties} role="list" aria-label={'Ordem de turnos · rodada '+battle.round} data-turn-order>
  <span className={styles.round}>RODADA<b>{battle.round}</b></span>
  {entries.map((id,index)=>{
   const enemy=id==='enemy',current=index===battle.index,hero=heroes.find(h=>h.id===id),duel=enemy&&!!battle.eventId?.startsWith('recruit-'),portraitId=enemy?battle.asset:id==='gabriel'&&lycan?heroArtIdV36((hero?.variantId||'gabriel')+'_lycan'):hero?heroArtIdV36(hero):id;
   const label=enemy?duel?'Desafiante':battle.boss?'Chefe':'Inimigo':hero?.name||id;
   const identity=hero?heroUiNameV36(hero):null,visibleName=enemy?label:identity?.name||label;
   const source=ASSETS['face_'+portraitId]||ASSETS['dlg_'+portraitId]||ASSETS[portraitId],legacyRow={ashwolf:0,moth:50,cinder:100}[portraitId as 'ashwolf'|'moth'|'cinder'];
   return <div className={styles.turn} data-current={current||undefined} data-enemy={enemy||undefined} data-acted={index<battle.index||undefined} data-queue-position={index+1} role="listitem" aria-current={current?'step':undefined} aria-label={label+' · '+(current?'agora':index<battle.index?'já agiu':'a seguir')} aria-description={`Ação ${index+1} de ${entries.length} na rodada ${battle.round}`} title={label} key={`${battle.round}-${index}-${id}`}>
    <span className={styles.portrait}>{enemy&&!duel&&legacyRow!==undefined?<span className={styles.enemySprite} style={{backgroundImage:'url('+ASSETS[portraitId]+')',backgroundPosition:'0% '+legacyRow+'%'}}/>:<img src={source} alt="" draggable={false} data-face={isHeroCardId(hero?.id||portraitId)||portraitId==='gabriel_lycan'||undefined}/>}</span>
    <span className={styles.label}><strong>{visibleName}</strong><small>{identity?.variantTitle?'5★ · ':''}{current?'Agora':index<battle.index?'Agiu':'A seguir'}</small></span>
   </div>;
  })}
 </div>;
}
