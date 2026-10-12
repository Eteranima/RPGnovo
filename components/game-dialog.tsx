'use client';
import {useRef,type ReactNode} from 'react';
import {Dialog as Primitive} from 'radix-ui';
import {X} from 'lucide-react';
import {Dialog,DialogPortal,DialogOverlay} from './ui/dialog';
import {NativeMenuFrame} from './native-menu-frame';
/** Keep every modal and its focus trap inside the game viewport. */
export function GameDialog({container,open,onClose,children,className='',locked=false}:{container:HTMLElement|null;open:boolean;onClose:()=>void;children:ReactNode;className?:string;locked?:boolean}){
 const content=useRef<HTMLDivElement>(null);if(!container)return null;
 return <Dialog open={open} onOpenChange={value=>!value&&!locked&&onClose()}><DialogPortal container={container}><DialogOverlay className="ingame-menu-shade"/><Primitive.Content ref={content} onEscapeKeyDown={e=>{if(locked)e.preventDefault();}} onInteractOutside={e=>{if(locked)e.preventDefault();}} onOpenAutoFocus={e=>{e.preventDefault();content.current?.focus();}} className={`game-modal ingame-modal ${className}`} onCloseAutoFocus={e=>{e.preventDefault();container.closest<HTMLElement>('.game-shell')?.focus();}}><NativeMenuFrame/><div className="ingame-modal-content"><fieldset disabled={locked} style={{display:'contents',border:0,padding:0,margin:0}}>{children}</fieldset></div><Primitive.Close disabled={locked} className="ingame-close" aria-label="Fechar menu"><X size={20}/></Primitive.Close></Primitive.Content></DialogPortal></Dialog>;
}
