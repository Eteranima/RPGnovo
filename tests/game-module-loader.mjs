import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import ts from 'typescript';

/** Follow the real production graph, including type cycles, before running unchanged runtime assertions. */
export function compileGameModules(out,roots){
 const compiled=new Set();
 function compile(name){
  if(compiled.has(name))return;compiled.add(name);
  let source=readFileSync(`lib/game/${name}.ts`,'utf8');
  for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);
  source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");
  writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
 }
 for(const name of roots)compile(name);
 return compiled;
}
