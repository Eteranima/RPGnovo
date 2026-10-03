import {ASSETS,type HeroId} from '@/lib/game/data';
import {skillMotifIndex} from '@/lib/game/characterAnimation';
import {GameIcon} from './game-icon';

export function CharacterSkillIcon({hero,action,index=15,className=''}:{hero:HeroId;action:string;index?:number;className?:string}){
 const src=action?ASSETS[`skill_icon_${hero}_${skillMotifIndex(action)}`]:undefined;
 return src?<img className={'character-skill-art '+className} src={src} alt="" aria-hidden="true" draggable={false} style={{width:42,height:42,objectFit:'contain',flexShrink:0}}/>:<GameIcon index={index}/>;
}
