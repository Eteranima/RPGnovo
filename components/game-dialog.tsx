'use client';
import {useRef,type ReactNode} from 'react';
import {Dialog as Primitive} from 'radix-ui';
import {X} from 'lucide-react';
import {Dialog,DialogPortal,DialogOverlay} from './ui/dialog';
/** Keep every modal and its focus trap inside the game viewport. */
export function GameDialog({container,open,onClose,children,className=''}:{container:HTMLElement|null;open:boolean;onClose:()=>void;children:ReactNode;className?:string}){
 const content=useRef<HTMLDivElement>(null);if(!container)return null;
 return <Dialog open={open} onOpenChange={value=>!value&&onClose()}><DialogPortal container={container}><DialogOverlay className="ingame-menu-shade"/><Primitive.Content ref={content} onOpenAutoFocus={e=>{e.preventDefault();content.current?.focus();}} className={`game-modal ingame-modal ${className}`} onCloseAutoFocus={e=>{e.preventDefault();container.closest<HTMLElement>('.game-shell')?.focus();}}><div className="ingame-modal-content">{children}</div><Primitive.Close className="ingame-close" aria-label="Fechar menu"><X size={20}/></Primitive.Close></Primitive.Content></DialogPortal></Dialog>;
}
