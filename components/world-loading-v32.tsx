'use client';
import {OpeningGallery} from './opening-gallery';
import {MAPS,type MapId} from '@/lib/game/data';
import styles from './world-loading-v32.module.css';

type LoadingStatus={loading:boolean;map:MapId|null;error:string|null;loaded:number;total:number};
export function WorldLoadingV32({status,onRetry}:{status:LoadingStatus;onRetry:()=>void}){
 const name=status.map?MAPS[status.map].name:'Stone Reach',percent=status.total?Math.round(status.loaded/status.total*100):0;
 return <div className={styles.overlay} role={status.error?'alert':'status'} aria-label={status.error?'Não foi possível carregar o cenário':`Preparando ${name}`}><OpeningGallery loading/><div className={styles.panel}><span>ÉTER ANIMA</span><h2>{status.error?'O cenário não terminou de carregar':`Preparando ${name}`}</h2>{status.error?<><p>Confira a conexão e tente novamente. Seus dados de jogo foram preservados.</p><button className="primary-button" onClick={onRetry}>Tentar novamente</button></>:<><p>Carregando as artes deste local · {status.loaded} / {status.total}</p><div className={styles.progress} role="progressbar" aria-label="Artes do cenário" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><i style={{width:percent+'%'}}/></div><small>Guarde-se para reduzir o próximo dano e impedir estados. Troque o líder com 1–5.</small></>}</div></div>;
}
