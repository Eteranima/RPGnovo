'use client';
import type {HeroId} from '@/lib/game/data';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {VARIANTS_V36,equippedVariantV36,heroRarityV36} from '@/lib/game/variantsV36';
import styles from './hero-variant-selector.module.css';

export function HeroVariantSelector({hero,s,engine}:{hero:HeroId;s:Snapshot;engine:GameEngine}){
 const variant=VARIANTS_V36.find(item=>item.hero===hero);if(!variant)return null;
 const owned=s.progress.summoned.includes(variant.id),active=equippedVariantV36(s.progress,hero),allowed=s.mode==='world';
 return <section className={styles.selector} aria-label={`Versões de ${variant.name.split(' — ')[0]}`}>
  <span className={styles.label}>VERSÃO</span>
  <div className={styles.options}>
   <button className="secondary-button" aria-pressed={!active} disabled={!allowed} onClick={()=>engine.equipHeroVariantV36(hero,null)}>Original · {heroRarityV36(hero)}★</button>
   <button className="secondary-button" aria-pressed={active?.id===variant.id} disabled={!allowed||!owned} onClick={()=>engine.equipHeroVariantV36(hero,variant.id)}>{variant.name.split(' — ')[1]} · 5★</button>
  </div>
  {!owned?<small>Convoque esta versão no Arquivo dos Despertos para equipá-la.</small>:<small>{active?'Versão 5★ equipada.':'Versão 5★ disponível.'} A árvore, os equipamentos e a posição no Grupo são mantidos.</small>}
  <details><summary>Lua de Sangue · traje, história e técnicas</summary><p>{variant.description}</p><p><b>{variant.signature.name}</b> · {variant.signature.cost} MP<br/>{variant.signature.description}</p><p><b>{variant.ultimate.name}</b><br/>{variant.ultimate.description}</p></details>
 </section>;
}
