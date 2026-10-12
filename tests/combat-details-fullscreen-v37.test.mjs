import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const source=ts.createSourceFile('intent.tsx',readFileSync('components/battle-intent-v32.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const declaration=source.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='mountCombatDetailsHostV37');
const compiled=ts.transpileModule(declaration.getText(source).replace(/^export\s+/,''),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
class Element{
 constructor(name,doc){this.name=name;this.doc=doc;this.dataset={};this.children=[];this.parentElement=null;this.focusCount=0;}
 get isConnected(){return this===this.doc.body||!!this.parentElement?.isConnected;}
 contains(element){return element===this||this.children.some(child=>child.contains(element));}
 appendChild(element){assert.ok(!element.contains(this),'Moving a portal cannot create a DOM cycle');element.remove();element.parentElement=this;this.children.push(element);}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(child=>child!==this);this.parentElement=null;}
 focus(options){this.doc.activeElement=this;this.focusCount++;this.focusOptions=options;}
}
function documentFixture(){
 const listeners=new Map(),doc={fullscreenElement:null,webkitFullscreenElement:null,activeElement:null,
  createElement:name=>new Element(name,doc),
  addEventListener:(name,callback)=>listeners.set(name,callback),
  removeEventListener:(name,callback)=>{if(listeners.get(name)===callback)listeners.delete(name);},
  emit:name=>listeners.get(name)?.(),listeners};
 doc.body=new Element('body',doc);return doc;
}
const mount=new Function('HTMLElement',compiled+';return mountCombatDetailsHostV37;')(Element);
let checks=0;
const eq=(actual,expected,message)=>{assert.equal(actual,expected,message);checks++;};
for(const property of ['fullscreenElement','webkitFullscreenElement']){
 const doc=documentFixture(),shell=doc.createElement('main');doc.body.appendChild(shell);
 const mounted=mount(doc),host=mounted.host,button=doc.createElement('button');host.appendChild(button);button.focus();
 eq(host.parentElement,doc.body,'The details dialog initially stays in the ordinary document');
 eq(host.dataset.combatDetailsHost,'v37','The real helper identifies its stable host');
 doc[property]=shell;doc.emit(property==='fullscreenElement'?'fullscreenchange':'webkitfullscreenchange');
 eq(host.parentElement,shell,'Details move inside the active fullscreen subtree');
 eq(host.children[0],button,'Fullscreen preserves the same mounted dialog node');
 eq(doc.activeElement,button,'The selected control keeps keyboard focus');
 eq(button.focusOptions.preventScroll,true,'Moving the dialog does not scroll the battlefield');
 const focused=button.focusCount;doc.emit('fullscreenchange');eq(button.focusCount,focused,'A repeated event does not reparent or refocus');
 doc[property]=button;doc.emit('fullscreenchange');eq(host.parentElement,doc.body,'A nested fullscreen target cannot become its own portal parent');
 doc[property]=null;doc.emit('fullscreenchange');eq(host.parentElement,doc.body,'Leaving fullscreen restores ordinary dialog visibility');
 mounted.destroy();eq(host.parentElement,null,'Closing removes the portal host');eq(doc.listeners.size,0,'Closing removes both fullscreen listeners');
}
console.log(`Combat details fullscreen v37: ${checks} checks passed; stable nodes, standard/WebKit transitions, focus, cycle prevention and cleanup.`);
