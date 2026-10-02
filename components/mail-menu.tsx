'use client';
import {useState} from 'react';
import {Mail,Ticket,Sparkles} from 'lucide-react';
import {STARTER_FIVE_STAR_IDS,type GameEngine,type Snapshot} from '@/lib/game/engine';
import {summonedById} from '@/lib/game/summons';

export function MailMenu({s,engine}:{s:Snapshot;engine:GameEngine}){
 const [choice,setChoice]=useState<string|null>(null),p=s.progress;
 return <section className="starter-mail" aria-label="Correio de Stone Reach">
  <div className="menu-intro"><span className="eyebrow">MAIL · STONE REACH</span><h3>Um começo em companhia</h3><p>Uma mensagem da Academia para cada nova aventura. Resgate uma vez por save; o presente também está disponível para aventuras iniciadas antes desta atualização.</p></div>
  <article className={`mail-parcel ${p.starterMailClaimed?'claimed':''}`}>
   <div className="mail-parcel-seal"><Mail size={31}/><span>STONE REACH / 001</span></div>
   <div className="mail-parcel-copy"><small>Remetente · Academia de Stone Reach</small><h4>Pacote de boas-vindas</h4><p>30 Fichas de Invocação para o banner de personagens e 1 seletor de herói 5★ jogável.</p><div className="mail-gifts"><span><Ticket size={18}/>×30 tiros</span><span><Sparkles size={18}/>Seletor 5★ ×1</span></div></div>
   <button className="primary-button" disabled={s.mode!=='world'||p.starterMailClaimed} onClick={()=>engine.claimStarterMail()}>{p.starterMailClaimed?'Resgatado':'Resgatar presente'}</button>
  </article>
  {p.starterMailClaimed&&<><div className="menu-intro"><span className="eyebrow">SELETOR 5★</span><h3>{p.starterSelected?'Escolha registrada':'Escolha quem se junta a você'}</h3><p>{p.starterSelected?'Seu herói já está disponível no menu Grupo.':'Beatriz, Orfeu ou Ava entram imediatamente no Grupo. Carmilla permanece como recompensa de conquistas ou do Modo Mestre.'}</p></div><div className="mail-selector-grid">{STARTER_FIVE_STAR_IDS.map(id=>{const hero=summonedById(id)!,selected=p.starterSelected===id,duplicate=p.summoned.includes(id);return <article className={`mail-choice ${choice===id||selected?'selected':''}`} key={id} style={{'--summon-accent':hero.accent} as React.CSSProperties}><div className="mail-choice-art"><img src={hero.art} alt={`Arte de ${hero.name}`}/><span>5★ · {hero.element}</span></div><div className="mail-choice-body"><h4>{hero.name}</h4><p>{hero.role}</p><small>{selected?'Escolhido':duplicate?'Já possui: +1 constelação e 20 fragmentos.':hero.title}</small>{p.starterSelectorPending&&<button className={choice===id?'primary-button':'secondary-button'} disabled={s.mode!=='world'} onClick={()=>{if(choice===id){engine.selectStarterFiveStar(id);setChoice(null);}else setChoice(id);}}>{choice===id?'Confirmar escolha':'Escolher'}</button>}</div></article>;})}</div>{p.starterSelectorPending&&choice&&<p className="menu-note">Confirme no card de {summonedById(choice)?.name}; esta escolha só pode ser feita uma vez.</p>}</>}
 </section>;
}
