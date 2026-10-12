'use client';
import {useState} from 'react';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {variantByIdV36,type LegendaryVariantIdV36} from '@/lib/game/variantsV36';
import styles from './blood-moon-event.module.css';

/** The engine owns objectives, eligibility and the single reward claim. */
export function BloodMoonLegendaryEvent({s,engine}:{s:Snapshot;engine:GameEngine}){
 const {event,progress,status,currentStep,lockedReason}=engine.bloodMoonLegendaryV36();
 const [selected,setSelected]=useState<LegendaryVariantIdV36|null>(null);
 const choice=selected&&event.choiceIds.includes(selected)?variantByIdV36(selected):undefined;
 const chosen=variantByIdV36(progress.chosen),world=s.mode==='world',busy=s.gachaBusy||s.summonBusy;
 return <section className={styles.event} aria-labelledby="blood-moon-legendary-title">
  <span className="eyebrow">ATO II · ESCOLHA GARANTIDA</span><h3 id="blood-moon-legendary-title">{event.name}</h3>
  <p>Terra, maré e página livre encontram lugar no Baile. Complete seis objetivos com o elenco que você já possui e escolha uma das três versões míticas 5★.</p>
  {status==='locked'?<p className={styles.locked} role="status">{lockedReason}</p>:<div className={styles.progress}><span>{progress.step} / {event.steps.length} páginas</span><strong>{status==='claimed'?'Escolha registrada':status==='complete'?'As três páginas estão livres':currentStep?.name||'Um novo convite espera por você'}</strong></div>}
  {status==='active'&&currentStep&&<p>{currentStep.description}</p>}
  <p className={styles.reward}><b>{event.rewardDescription}</b><small>O ato II é permanente. A recompensa permite escolher uma única versão entre Ava, Beatriz e Orfeu; as três também podem ser convocadas no Arquivo.</small></p>
  {status==='available'&&<button className="primary-button" disabled={!world||busy} onClick={()=>engine.startBloodMoonLegendaryV36()}>Abrir as três páginas</button>}
  <details open={status==='complete'}><summary>As três versões e seus kits</summary><div className={styles.forms} role={status==='complete'?'group':undefined} aria-label={status==='complete'?'Escolha uma versão mítica':undefined}>
   {event.choiceIds.map(id=>{const variant=variantByIdV36(id);if(!variant)return null;const owned=s.progress.summoned.includes(id);return <article key={id} data-selected={selected===id}>
    <h4>{variant.name} · 5★</h4><p>{variant.description}</p>
    <small><b>{variant.signature.name}</b> · {variant.signature.cost} MP<br/>{variant.signature.description}</small>
    <small><b>{variant.ultimate.name}</b><br/>{variant.ultimate.description}</small>
    {status==='complete'&&<button className="secondary-button" aria-pressed={selected===id} disabled={!world||busy} onClick={()=>setSelected(id)}>{selected===id?'Selecionada':'Selecionar'}{owned?' · já obtida':''}</button>}
   </article>;})}
  </div></details>
  {status==='complete'&&<div className={styles.claim} aria-live="polite">
   <p>{choice?<>Sua escolha: <b>{choice.name}</b>. A recompensa só pode ser recebida uma vez.{s.progress.summoned.includes(choice.id)&&' Esta versão já foi obtida: você receberá 20 fragmentos de alma, 160 cristais e uma constelação, até o limite de seis.'}</>:'Selecione uma das três versões acima antes de receber a recompensa.'}</p>
   <button className="primary-button" disabled={!world||busy||!choice} onClick={()=>{if(choice)engine.claimBloodMoonLegendaryV36(choice.id);}}>Confirmar escolha única</button>
  </div>}
  {status==='claimed'&&chosen&&<p className={styles.claimed}><b>{chosen.name}</b> já está no seu Arquivo. Equipe a versão no Grupo quando quiser.</p>}
 </section>;
}
