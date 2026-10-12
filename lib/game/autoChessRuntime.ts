import * as L39 from './autoChessLeagueV39';
import * as L40 from './autoChessLeagueV40';
import * as C39 from './autoChessCatalogV39';
import * as C40 from './autoChessCatalogV40';
import * as B39 from './autoChessCombatV39';
import * as B40 from './autoChessCombatV40';

export type ChessRuleset=39|40;
export type ChessRunRecordV39=L39.ChessRunRecordV39&{ruleset?:ChessRuleset};
export type ChessLeagueStateV39=L39.ChessLeagueStateV39|L40.ChessLeagueStateV40;
export type ChessCommandV39=L39.ChessCommandV39;
export type ChessPlayerV39=L39.ChessPlayerV39;
export const CHESS_MAX_COMMANDS_V39=L39.CHESS_MAX_COMMANDS_V39;
export const CHESS_MAX_ROUNDS_V39=L39.CHESS_MAX_ROUNDS_V39;

const runtimes={
 39:{ruleset:39 as const,catalog:C39.CHESS_PIECES_V39,traits:C39.CHESS_TRAITS_V39,items:C39.CHESS_ITEMS_V39,components:C39.CHESS_COMPONENTS_V39,shopOdds:C39.CHESS_SHOP_ODDS_V39,roleLabels:C39.CHESS_ROLE_LABELS_V39,pieceById:C39.chessPieceByIdV39,itemById:C39.chessItemByIdV39,recipe:C39.chessRecipeV39,traitsFor:B39.chessTraitsV39,previewUnits:B39.previewChessUnitsV39,unitStats:B39.chessUnitStatsV39},
 40:{ruleset:40 as const,catalog:C40.CHESS_PIECES_V40,traits:C40.CHESS_TRAITS_V40,items:C40.CHESS_ITEMS_V40,components:C40.CHESS_COMPONENTS_V40,shopOdds:C40.CHESS_SHOP_ODDS_V40,roleLabels:C40.CHESS_ROLE_LABELS_V40,pieceById:C40.chessPieceByIdV40,itemById:C40.chessItemByIdV40,recipe:C40.chessRecipeV40,traitsFor:B40.chessTraitsV40,previewUnits:B40.previewChessUnitsV40,unitStats:B40.chessUnitStatsV40},
};
/** A missing version on an existing journal means v39. A fresh opening uses v40. */
export function chessRuntimeV39(source?:{ruleset?:number}|null){return runtimes[source?(source.ruleset===40?40:39):40];}
const recordRuleset=(value:unknown):ChessRuleset|null=>{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const version=(value as {ruleset?:unknown}).ruleset;
 return version===undefined||version===39?39:version===40?40:null;
};
export function normalizeChessRunRecordV39(value:unknown):ChessRunRecordV39|null{const version=recordRuleset(value);return version===39?L39.normalizeChessRunRecordV39(value):version===40?L40.normalizeChessRunRecordV40(value):null;}
export function replayChessRunV39(record:ChessRunRecordV39):ChessLeagueStateV39|null{const version=recordRuleset(record);return version===39?L39.replayChessRunV39(record):version===40?L40.replayChessRunV40(record as L40.ChessRunRecordV40):null;}
export function appendChessCommandV39(record:ChessRunRecordV39,command:ChessCommandV39):ChessRunRecordV39|null{const version=recordRuleset(record);return version===39?L39.appendChessCommandV39(record,command):version===40?L40.appendChessCommandV40(record as L40.ChessRunRecordV40,command):null;}
export function newChessLeagueV39(seed:number,pairingVersion:L39.ChessPairingVersionV39=2,ruleset:ChessRuleset=40):ChessLeagueStateV39{return ruleset===39?L39.newChessLeagueV39(seed,pairingVersion):L40.newChessLeagueV40(seed,pairingVersion);}
export function chessHumanBattleV39(state:ChessLeagueStateV39){return 'ruleset' in state&&state.ruleset===40?L40.chessHumanBattleV40(state):L39.chessHumanBattleV39(state);}
export const chessBenchV39=L39.chessBenchV39;
export const chessOwnedCopiesV39=L39.chessOwnedCopiesV39;
