'use client';
import {useState} from 'react';
import {Tabs,TabsContent,TabsList,TabsTrigger} from './ui/tabs';
import {StatusBadges} from './game-menu';
import {HeroPortrait} from './hero-card';
import {cosmeticRank} from '@/lib/game/cosmetics';
import {GameEngine,type Snapshot} from '@/lib/game/engine';
import {ASSETS,combatElement,ELEMENT_LABELS,signatureTechnique,ULTIMATE_DESCRIPTIONS,type HeroId} from '@/lib/game/data';
import {skillMotifIndex} from '@/lib/game/characterAnimation';
import {planInAeternumVive} from '@/lib/game/carmilla';
import {CombatStatusHelpV32} from './battle-intent-v32';
import polish from './battle-intent-v32.module.css';
import styles from './battle-interface.module.css';

type CommandArtKind='actions'|'skills'|'items'|'flee'|'attack'|'guard';
function CommandArt({kind,hero,action}:{kind:CommandArtKind;hero?:HeroId;action?:string}){
 const icon=hero&&action?ASSETS[`skill_icon_${hero}_${skillMotifIndex(action)}`]:undefined;
 return <><img className={styles.commandArt} src={icon?'/assets/v29/ui/skill-command.png':'/assets/v28/combat/'+kind+'.png'} alt="" aria-hidden="true" draggable={false}/>{icon&&<img className={styles.personalSkillArt} src={icon} alt="" aria-hidden="true" draggable={false}/>}</>;
}

export function BattleCommands({engine,s,target,setTarget}:{engine:GameEngine;s:Snapshot;target:HeroId;setTarget:(id:HeroId)=>void}){
 const [tab,setTab]=useState('actions');
 const b=s.battle!,hero=engine.currentHero(),h=hero||s.heroes.find(h=>h.id===b.animation?.actor)||s.heroes.find(h=>h.id===b.queue[Math.max(0,b.index-1)])||s.heroes[0],silenced=engine.hasStatus(h.id,'silence'),ally=s.heroes.find(h=>h.id===target)||h;
 const needsTarget=tab==='items'||tab==='skills'&&engine.skills(h.id).some(sk=>['mend','cleanse','rekindle','margem','garden-heal'].includes(sk.id)||signatureTechnique(sk.id)?.target==='ally');
 const turnText=b.busy?b.animation?.action==='frozen'?'Imobilizado pelo gelo…':b.animation?.action==='bound'?'Imobilizado pela terra…':b.animation?.actor==='enemy'?'O inimigo está agindo…':(s.heroes.find(h=>h.id===b.animation?.actor)?.name||'Herói')+' está agindo…':'Turno de '+(hero?.name||'…');
 const ultimate=<button className={styles.commandButton+' '+styles.ultimateButton} disabled={!hero||s.progress.limit[h.id]<100} onClick={()=>engine.action('ultimate')} title={engine.ultimateName(h.id)+' · '+s.progress.limit[h.id]+' / 100 · sem custo de MP · '+ULTIMATE_DESCRIPTIONS[h.id]}><CommandArt kind="skills" hero={h.id} action="ultimate"/><span>{engine.ultimateName(h.id)}<small>Ultimate · {s.progress.limit[h.id]} / 100</small></span><span className={styles.limitTrack} role="progressbar" aria-label={'Carga de ultimate de '+h.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.progress.limit[h.id]}><i style={{width:s.progress.limit[h.id]+'%'}}/></span></button>;
 return <div className={styles.commandRoot} data-target-mode={needsTarget?'ally':'none'}>
  <div className={styles.commandTitle+' '+polish.commandHeading}><strong>{turnText}</strong><span className={styles.activeVitals}>{h.hp}/{h.maxHp} HP · {h.mp}/{h.maxMp} MP</span><StatusBadges states={b.statuses[h.id]}/><CombatStatusHelpV32 battle={b} heroes={s.heroes} lycan={s.progress.gabrielForm==='lycan'}/><div className={polish.speedGroup} role="group" aria-label="Velocidade do combate">{([1,2] as const).map(speed=><button key={speed} aria-label={'Velocidade '+speed+' vezes'} aria-pressed={s.battleSpeedV32===speed} onClick={()=>engine.setBattleSpeedV32(speed)}>{speed}×</button>)}</div></div>
  <Tabs value={tab} onValueChange={setTab} className={styles.commandTabs}>
   <TabsList className={styles.tabList} aria-label="Comandos de combate">
    <TabsTrigger className={styles.tabButton} value="actions"><CommandArt kind="actions"/><span>Ações</span></TabsTrigger>
    <TabsTrigger className={styles.tabButton} value="skills"><CommandArt kind="skills"/><span>Habilidades</span></TabsTrigger>
    <TabsTrigger className={styles.tabButton} value="items"><CommandArt kind="items"/><span>Itens</span></TabsTrigger>
   </TabsList>
   <TabsContent className={styles.commandPanel} value="actions"><div className={styles.commandList}>
    <button className={styles.commandButton} disabled={!hero} onClick={()=>engine.action('attack')} title={engine.attackPower(h.id)+' '+(combatElement(h.id,'attack')==='neutral'?'de dano físico':'de dano de '+ELEMENT_LABELS[combatElement(h.id,'attack')])}><CommandArt kind="attack"/><span>Atacar<small>{engine.attackPower(h.id)} · {ELEMENT_LABELS[combatElement(h.id,'attack')]}</small></span></button>
    <button className={styles.commandButton} disabled={!hero} onClick={()=>engine.action('guard')} title={'Reduz dano · +'+(3+cosmeticRank(s.progress,h.id,'guard'))+' MP'}><CommandArt kind="guard"/><span>Guardar<small>+{3+cosmeticRank(s.progress,h.id,'guard')} MP</small></span></button>
    {ultimate}
   </div></TabsContent>
   <TabsContent className={styles.commandPanel} value="skills"><div className={styles.commandList}>
    {engine.skills(h.id).map(sk=><button className={styles.commandButton+' '+styles.skillButton} key={sk.id} disabled={!hero||silenced||!s.progress.masterMode&&h.mp<engine.skillCost(h.id,sk.cost)||signatureTechnique(sk.id)?.target==='ally'&&ally.hp<=0||sk.id==='in-aeternum-vive'&&!planInAeternumVive(s.heroes).targets.length} title={sk.name+' · '+(sk.id==='in-aeternum-vive'?'15% do HP curado · alvos automáticos':engine.skillCost(h.id,sk.cost)+' MP')+' · '+sk.description} onClick={()=>engine.action(sk.id,target)}><CommandArt kind="skills" hero={h.id} action={sk.id}/><span>{sk.name}<small>{sk.id==='in-aeternum-vive'?'15% HP · automático':engine.skillCost(h.id,sk.cost)+' MP'}</small></span></button>)}
    {ultimate}
   </div></TabsContent>
   <TabsContent className={styles.commandPanel} value="items"><div className={styles.commandList}>
    <button className={styles.commandButton} disabled={!hero||!s.potions||ally.hp===ally.maxHp} onClick={()=>engine.action('potion',target)} title="Recupera 45 HP do alvo; também recupera aliados caídos."><CommandArt kind="items"/><span>Poção ×{s.potions}<small>+45 HP</small></span></button>
    <button className={styles.commandButton} disabled={!hero||!s.ethers||ally.mp===ally.maxMp} onClick={()=>engine.action('ether',target)} title="Recupera 24 MP do alvo."><CommandArt kind="items"/><span>Elixir ×{s.ethers}<small>+24 MP</small></span></button>
    <button className={styles.commandButton} disabled={!hero||!s.remedies||!b.statuses[target]?.length} onClick={()=>engine.action('remedy',target)} title="Remove os estados do alvo."><CommandArt kind="items"/><span>Antídoto ×{s.remedies}<small>Remove estados</small></span></button>
   </div></TabsContent>
  </Tabs>
  {needsTarget&&<div className={styles.targetStrip} role="group" aria-label="Alvo de cura ou item">{s.heroes.map(a=><button className={styles.targetButton+' '+(target===a.id?styles.targetSelected:'')} key={a.id} aria-label={'Selecionar '+a.name+' como alvo · '+a.hp+' de '+a.maxHp+' HP'} aria-pressed={target===a.id} onClick={()=>setTarget(a.id)}><HeroPortrait h={a} lycan={s.progress.gabrielForm==='lycan'}/><span>{a.hp}<small>/{a.maxHp}</small></span></button>)}</div>}
  {!b.boss&&<button className={styles.tabButton+' '+styles.fleeButton} disabled={!hero} onClick={()=>engine.action('flee')}><CommandArt kind="flee"/><span>Recuar</span></button>}
 </div>;
}
