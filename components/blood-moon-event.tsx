'use client';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {VARIANTS_V36} from '@/lib/game/variantsV36';
import {BloodMoonLegendaryEvent} from './blood-moon-legendary-event';
import {EventActivitiesV38} from './event-activities-v38';
import styles from './blood-moon-event.module.css';

export function BloodMoonEvent({s,engine}:{s:Snapshot;engine:GameEngine}){
 const {event,progress,status,currentStep}=engine.bloodMoonEventV36(),world=s.mode==='world',busy=s.gachaBusy||s.summonBusy;
 return <><section className={styles.event} aria-labelledby="blood-moon-title">
  <span className="eyebrow">PRIMEIRO EVENTO · HALLOWEEN</span><h3 id="blood-moon-title">{event.name}</h3>
  <p>Uma noite, cinco máscaras e o mesmo juramento: ninguém fica para trás. As cinco versões 5★ têm traje, história e técnicas próprias; as versões originais continuam no Arquivo.</p>
  <div className={styles.progress}><span>{progress.step} / {event.steps.length} selos</span><strong>{status==='claimed'?'Recompensa recebida':status==='complete'?'Os cinco selos estão unidos':currentStep?.name||'O baile permanece aberto'}</strong></div>
  {progress.accepted&&currentStep&&<p>{currentStep.description}</p>}
  <p className={styles.reward}><b>{event.rewardCrystals} Cristais de Éter · {event.rewardPulls} invocações</b><small>Recompensa única. Complete o evento com o elenco original; não é preciso ter uma versão 5★. O prêmio não garante uma versão 5★.</small></p>
  {!progress.accepted?<button className="primary-button" disabled={!world||busy} onClick={()=>engine.startBloodMoonEventV36()}>Aceitar o convite</button>:status==='complete'?<button className="primary-button" disabled={!world||busy} onClick={()=>engine.claimBloodMoonEventV36()}>Receber recompensa</button>:null}
  <details><summary>As cinco máscaras e seus kits</summary><div className={styles.forms}>{VARIANTS_V36.filter(variant=>!variant.legendary).map(variant=><article key={variant.id}><h4>{variant.name} · 5★</h4><p>{variant.description}</p><small><b>{variant.signature.name}</b> · {variant.signature.cost} MP<br/>{variant.signature.description}</small><small><b>{variant.ultimate.name}</b><br/>{variant.ultimate.description}</small></article>)}</div></details>
 </section><EventActivitiesV38 s={s} engine={engine}/><BloodMoonLegendaryEvent s={s} engine={engine}/></>;
}
