export type MasterSequence={count:number;started:number};
const COMBINATION=['p','p','a','p','p','w'] as const;
export const emptyMasterSequence=():MasterSequence=>({count:0,started:0});

export function advanceMasterSequence(state:MasterSequence,key:string,now:number):{state:MasterSequence;activated:boolean;consumeMovement:boolean}{
 const within=state.count>0&&now-state.started<10000;
 const count=within?state.count:0;
 if(key===COMBINATION[count]){
  const next=count+1;
  return next===COMBINATION.length?{state:emptyMasterSequence(),activated:true,consumeMovement:true}:{state:{count:next,started:count?state.started:now},activated:false,consumeMovement:key==='a'||key==='w'};
 }
 return {state:key==='p'?{count:1,started:now}:emptyMasterSequence(),activated:false,consumeMovement:false};
}
