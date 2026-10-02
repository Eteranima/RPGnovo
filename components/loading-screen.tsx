'use client';
import {useEffect,useState} from 'react';

const tips=[
 'Guarde-se antes do golpe do chefe.',
 'Cristais restauram HP e MP.',
 'Tab troca o líder fora de combate.',
 'Q e R ativam técnicas de exploração.',
 'O MAIL guarda seu presente de boas-vindas.'
];

export function LoadingScreen(){const [tip,setTip]=useState(0);useEffect(()=>{const timer=window.setInterval(()=>setTip(index=>(index+1)%tips.length),4000);return()=>window.clearInterval(timer);},[]);return <div className="game-loading" role="status" aria-label="Carregando Stone Reach"><div className="loading-illustration" aria-hidden="true"/><h1 className="loading-screen-reader">Éter Anima · Stone Reach</h1><div className="loading-bottom"><div className="loading-tip" aria-live="polite"><span>DICA</span><p key={tip}>{tips[tip]}</p></div><div className="loading-progress" aria-label="Carregando"><i/></div><small>Preparando Stone Reach…</small></div></div>;}
