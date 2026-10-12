import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

let checks = 0;
const ok = (value, message) => { checks++; assert.ok(value, message); };
const eq = (value, expected, message) => { checks++; assert.deepEqual(value, expected, message); };
const require = createRequire(import.meta.url);
const parse = path => ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const progression = parse('lib/game/progression.ts');
let status;
function find(node) { if (ts.isVariableDeclaration(node) && node.name.getText(progression) === 'STATUS') status = node.initializer.getText(progression); ts.forEachChild(node, find); }
find(progression);
const STATUS = new Function(ts.transpileModule('return ' + status, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText)();
const menu = parse('components/game-menu.tsx');
const badges = menu.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'StatusBadges');
const badgeModule = {};
new Function('STATUS', 'GameIcon', 'require', 'exports', ts.transpileModule(badges.getText(menu), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText)(STATUS, () => createElement('span', { className: 'game-art-icon' }), require, badgeModule);
const classes = new Proxy({}, { get: (_target, key) => 'battle-' + key });
const stub = () => null;
const modules = {
  '../ui/progress': { Progress: props => createElement('div', { className: props.className, role: 'progressbar', 'aria-valuenow': props.value }) },
  '../game-menu': badgeModule, '../turn-order': { TurnOrder: stub }, '../battle-intent-v32': { BattleIntentV32: stub },
  '../battle-scene': { BattleScene: stub }, '../battle-commands': { BattleCommands: stub }, '../victory-celebration': { VictoryCelebration: stub }, '../ultimate-cinematic': { UltimateCinematic: stub },
  '../battle-interface.module.css': { __esModule: true, default: classes },
};
const exports = {};
new Function('require', 'exports', ts.transpileModule(readFileSync('components/game-shell/game-battle.tsx', 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText)(id => {
  if (id === 'react/jsx-runtime') return require(id);
  if (!modules[id]) throw Error('Unexpected dependency: ' + id);
  return modules[id];
}, exports);
function render({ states = [], weakened = false, boss = true, hp = 1234, maxHp = 9999 } = {}) {
  const battle = { name: 'Vigia da Palavra Interminável', entityId: 'selo', hp, maxHp, weakened, statuses: { enemy: states }, phase: 3, boss, bossCharge: 100, log: [], result: null };
  const game = { s: { battle, map: 'patio', heroes: [], progress: { gabrielForm: 'human' } }, engine: { enemyIntentV32: () => null }, ui: { target: 'seiji' }, patch() {} };
  return renderToStaticMarkup(createElement(exports.GameBattle, { game }));
}
const empty = render();
ok(empty.includes('class="battle-enemyVitals"'), 'HP is addressed by a dedicated slot, independent of later spans');
ok(empty.includes('1234 / 9999 HP') && empty.includes('aria-label="1234 de 9999 HP"'), 'Four-digit real HP stays visible and accessible');
ok(!empty.includes('battle-enemyStates') && !empty.includes('status-badges'), 'An empty enemy state does not create an auto-placement slot');
ok(empty.includes('title="Vigia da Palavra Interminável"'), 'The full enemy name remains available when the compact heading truncates');
ok(empty.includes('Fase 3/3 · Ultimate 100%'), 'Phase and charge remain real and complete');
const weak = render({ weakened: true });
ok(weak.includes('battle-enemyStates') && weak.includes('Enfraquecido'), 'Weakness remains visibly reported in the state slot');
ok(weak.includes('aria-label="1234 de 9999 HP, enfraquecido"'), 'The HP accessible description retains weakness');
ok(!weak.includes('status-badges'), 'Weakness alone does not create empty StatusBadges');
const active = render({ states: [{ id: 'freeze', turns: 2 }, { id: 'bleed', turns: 3 }] });
ok(active.includes('status-badges') && active.includes(STATUS.freeze.name) && active.includes(STATUS.bleed.name), 'Actual StatusBadges preserves state labels');
ok(active.includes('Restam 2 ações.') && active.includes('Restam 3 ações.'), 'Remaining actions and descriptions stay accessible');
eq((active.match(/battle-enemyVitals/g) || []).length, 1, 'States do not duplicate or replace the HP slot');
const updated = render({ boss: false, hp: 7, maxHp: 40, weakened: true, states: [{ id: 'freeze', turns: 1 }] });
ok(updated.includes('7 / 40 HP') && updated.includes('Enfraquecido'), 'A real HP/state change updates the distinct slots');
ok(!updated.includes('Fase '), 'A normal enemy does not acquire a boss phase');
console.info(`Battle header v36: ${checks} checks passed. CSS geometry is verified separately in the production browser.`);
