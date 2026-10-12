'use client';
import type {GameSession} from '@/hooks/use-game-session';
import {Gem,Sparkles} from 'lucide-react';
import {Dialog} from 'radix-ui';
export function GameNotices({game}:{game:GameSession}){const {s,engine,actions}=game,openMenu=actions.openMenu;return <>{s.rewardNotice&&s.mode==='world'&&<aside className="reward-quick" role="status"><Gem size={18}/><span>{s.rewardNotice.text}</span><button className="secondary-button" onClick={()=>{const notice=s.rewardNotice!;openMenu(notice.tab,notice.focus);engine.dismissNotice();}}>Ver {({gear:'equipamento',gacha:'relíquia',skills:'habilidades',bag:'bolsa',achievements:'conquista'} as Record<string,string>)[s.rewardNotice.tab]||'recompensas'}</button><button className="notice-close" onClick={()=>engine.dismissNotice()} aria-label="Dispensar recompensa">×</button></aside>}{s.toast&&!s.rewardNotice&&(s.mode==='world'||s.toast.startsWith('Tela cheia indisponível'))&&<div className="game-toast" role="status"><Sparkles size={16}/>{s.toast}</div>}</>;}

/** Outside the world canvas stacking context; recovery remains keyboard accessible. */
export function GameSaveConflict({game}:{game:GameSession}){
 const container=game.shell.current;if(!container||!game.s.saveConflictV36)return null;
 return <Dialog.Root open><Dialog.Portal container={container}><Dialog.Overlay className="save-conflict-shade-v36"/><Dialog.Content className="save-conflict-v36" onEscapeKeyDown={e=>e.preventDefault()} onInteractOutside={e=>e.preventDefault()}><Dialog.Title>O progresso mudou em outra aba</Dialog.Title><Dialog.Description>Esta sessão foi pausada para preservar o save mais recente. Recarregue para continuar a aventura salva na outra aba.</Dialog.Description><button className="primary-button" onClick={()=>window.location.reload()}>Carregar progresso mais recente</button></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
