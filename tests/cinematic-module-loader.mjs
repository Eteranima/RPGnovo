import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

/** Execute the real canvas renderer against the same production game graph. */
export async function compileUltimateSceneV36(out){
 compileGameModules(out,['legendarySceneV36','battleFormation','characterAnimation','enemyArtV30']);
 const source=readFileSync('components/ultimate-scene-v36.ts','utf8').replace(/from (['"])@\/lib\/game\/([\w-]+)\1/g,"from './$2.js'");
 writeFileSync(join(out,'ultimate-scene-v36.js'),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
 return import(pathToFileURL(join(out,'ultimate-scene-v36.js')).href);
}
