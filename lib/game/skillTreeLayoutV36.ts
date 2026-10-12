export type SkillTreeLayoutNodeV36={id:string;requires?:string};
export const SKILL_TREE_NODE_V36={width:175,height:96,column:205,row:132,paddingX:40,paddingY:24} as const;
/** Every node receives one slot in its dependency column, including field/passive nodes. */
export function skillTreeLayoutV36(nodes:readonly SkillTreeLayoutNodeV36[]){
 const byId=new Map(nodes.map(node=>[node.id,node])),depths=new Map<string,number>(),visiting=new Set<string>();
 const depth=(id:string):number=>{const known=depths.get(id);if(known!==undefined)return known;if(visiting.has(id))throw new Error(`Skill dependency cycle: ${id}`);visiting.add(id);const parent=byId.get(id)?.requires;const value=parent&&byId.has(parent)?depth(parent)+1:0;visiting.delete(id);depths.set(id,value);return value;};
 const rows=new Map<number,number>(),positions:Record<string,{x:number;y:number}>={};
 for(const node of nodes){const column=depth(node.id),row=rows.get(column)||0;rows.set(column,row+1);positions[node.id]={x:SKILL_TREE_NODE_V36.paddingX+column*SKILL_TREE_NODE_V36.column,y:SKILL_TREE_NODE_V36.paddingY+row*SKILL_TREE_NODE_V36.row};}
 const bounds=Object.values(positions);
 return {positions,width:Math.max(700,...bounds.map(p=>p.x+SKILL_TREE_NODE_V36.width+40)),height:Math.max(180,...bounds.map(p=>p.y+SKILL_TREE_NODE_V36.height+24))};
}
