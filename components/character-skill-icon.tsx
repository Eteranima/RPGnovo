import {ASSETS,type Hero,type HeroId} from '@/lib/game/data';
import {skillMotifIndex} from '@/lib/game/characterAnimation';
import {heroArtIdV36} from '@/lib/game/variantsV36';
import {skillIconKeyV36} from '@/lib/game/skillsV36';
import type {Progression} from '@/lib/game/progression';
import {GameIcon} from './game-icon';

export function characterSkillArtV36(hero:HeroId|Hero,action:string,progress?:Progression){
 const id=typeof hero==='string'?hero:hero.id,artId=heroArtIdV36(hero,progress),explicit=skillIconKeyV36(id,action);
 return action?(ASSETS[`skill_icon_${artId}_${action}`]||(explicit?ASSETS[explicit]:undefined)||ASSETS[`skill_icon_${artId}_${skillMotifIndex(action)}`]):undefined;
}
export function CharacterSkillIcon({hero,action,index=15,className='',progress}:{hero:HeroId|Hero;action:string;index?:number;className?:string;progress?:Progression}){
 const src=characterSkillArtV36(hero,action,progress);
 return src?<img className={'character-skill-art '+className} src={src} alt="" aria-hidden="true" draggable={false} style={{width:42,height:42,objectFit:'contain',flexShrink:0}}/>:<GameIcon index={index}/>;
}
