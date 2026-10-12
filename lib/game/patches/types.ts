import type {MapData,MapId,HeroId} from '../data';
import type {Gear} from '../progression';

/** Authoring schema only. A draft never mutates live data, saves or the Gacha. */
export type PatchArea=Omit<MapData,'id'|'entities'> & {id:string;entities:(Omit<MapData['entities'][number],'to'> & {to?:string})[];art:readonly string[]};
export type PatchGateway={from:MapId;entityId:string;to:string;spawn:{x:number;y:number}};
export type PatchShop={id:string;area:string;name:string;stock:readonly {itemId:string;price:number;currency:'credits'|'tokens';limit?:number}[]};
export type PatchStatChange={hero:HeroId;before:{hp:number;mp:number;atk:number};after:{hp:number;mp:number;atk:number};reason:string};
export type GamePatchDraft={id:string;title:string;status:'draft';saveVersion:2;areas:readonly PatchArea[];gateways:readonly PatchGateway[];shops:readonly PatchShop[];items:readonly Gear[];balance:readonly PatchStatChange[];migrationNotes:readonly string[]};
