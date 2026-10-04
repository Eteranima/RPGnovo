/** Native encoded quest films. Historical v31 atlases remain unchanged. */
export type QuestCinematicId='long-tinta'|'long-geada'|'long-brasa'|'long-trovao'|'long-nulo';
export type SceneAct=0|1|2;
export type QuestVideoSceneV34={id:QuestCinematicId;title:string;actors:string[];avatars:{name:string;src:string}[];src:string;poster:string;durationSeconds:number;frames:number;fps:24;loadTimeoutMs:number;captions:{act:SceneAct;text:string}[]};
/** Standalone previews may reuse the native player without becoming quest records. */
export type CinematicFilmSpec=Omit<QuestVideoSceneV34,'id'>&{id:string};
export const QUEST_CINEMATICS_V34:Record<QuestCinematicId,QuestVideoSceneV34>={
  "long-tinta": {
    "id": "long-tinta",
    "title": "O nome que o mar apagou",
    "actors": [
      "Shin",
      "Umbra"
    ],
    "avatars": [
      {
        "name": "Shin",
        "src": "/assets/v31/cinematics/long-tinta/avatar-shin.png"
      },
      {
        "name": "Umbra",
        "src": "/assets/v31/cinematics/long-tinta/avatar-umbra.png"
      }
    ],
    "src": "/assets/v34/quest-cinematics/long-tinta.mp4",
    "poster": "/assets/v34/quest-cinematics/long-tinta.jpg",
    "durationSeconds": 10,
    "frames": 240,
    "fps": 24,
    "loadTimeoutMs": 30000,
    "captions": [
      {
        "act": 0,
        "text": "O porto perdeu um nome. A tinta ainda se lembra do caminho."
      },
      {
        "act": 1,
        "text": "Entre registros apagados, Shin e Umbra reconstituem a memória de Iria."
      },
      {
        "act": 2,
        "text": "A memória de Iria voltou. Seu cuidado pertence às pessoas do cais."
      }
    ]
  },
  "long-geada": {
    "id": "long-geada",
    "title": "O jardim que guardou o inverno",
    "actors": [
      "Mika"
    ],
    "avatars": [
      {
        "name": "Mika",
        "src": "/assets/v31/cinematics/long-geada/avatar-mika.png"
      }
    ],
    "src": "/assets/v34/quest-cinematics/long-geada.mp4",
    "poster": "/assets/v34/quest-cinematics/long-geada.jpg",
    "durationSeconds": 10,
    "frames": 240,
    "fps": 24,
    "loadTimeoutMs": 30000,
    "captions": [
      {
        "act": 0,
        "text": "Uma flor conserva o inverno que o jardim não conseguiu esquecer."
      },
      {
        "act": 1,
        "text": "Mika cuida das raízes sem apagar o testemunho do gelo."
      },
      {
        "act": 2,
        "text": "O jardim voltou a respirar. A memória continuará sob o cuidado escolhido."
      }
    ]
  },
  "long-brasa": {
    "id": "long-brasa",
    "title": "A promessa sob as cinzas",
    "actors": [
      "Gabriel",
      "Dante"
    ],
    "avatars": [
      {
        "name": "Gabriel",
        "src": "/assets/v29/gabriel/face.png"
      },
      {
        "name": "Dante",
        "src": "/assets/v31/cinematics/long-brasa/avatar-dante.png"
      }
    ],
    "src": "/assets/v34/quest-cinematics/long-brasa.mp4",
    "poster": "/assets/v34/quest-cinematics/long-brasa.jpg",
    "durationSeconds": 10,
    "frames": 240,
    "fps": 24,
    "loadTimeoutMs": 30000,
    "captions": [
      {
        "act": 0,
        "text": "Sob as cinzas, Gabriel encontra uma promessa que ainda respira."
      },
      {
        "act": 1,
        "text": "Dante abriga a pequena vida. A chama aquece, e a raiz desperta."
      },
      {
        "act": 2,
        "text": "A pira está livre. O primeiro fogo pertence a quem ficará."
      }
    ]
  },
  "long-trovao": {
    "id": "long-trovao",
    "title": "O sino que não aceitava o silêncio",
    "actors": [
      "Max",
      "Vajra"
    ],
    "avatars": [
      {
        "name": "Max",
        "src": "/assets/v29/max/face.png"
      },
      {
        "name": "Vajra",
        "src": "/assets/v31/cinematics/long-trovao/avatar-vajra.png"
      }
    ],
    "src": "/assets/v34/quest-cinematics/long-trovao.mp4",
    "poster": "/assets/v34/quest-cinematics/long-trovao.jpg",
    "durationSeconds": 8,
    "frames": 192,
    "fps": 24,
    "loadTimeoutMs": 30000,
    "captions": [
      {
        "act": 0,
        "text": "O sino calado guarda a mensagem dos antigos sinalizadores."
      },
      {
        "act": 1,
        "text": "Max e Vajra religam o astrolábio e libertam o sinal."
      },
      {
        "act": 2,
        "text": "A mensagem está livre. Quem a guarda decidirá como partilhá-la."
      }
    ]
  },
  "long-nulo": {
    "id": "long-nulo",
    "title": "A última página em branco",
    "actors": [
      "Orfeu"
    ],
    "avatars": [
      {
        "name": "Orfeu",
        "src": "/assets/v31/cinematics/long-nulo/avatar-orfeu.png"
      }
    ],
    "src": "/assets/v34/quest-cinematics/long-nulo.mp4",
    "poster": "/assets/v34/quest-cinematics/long-nulo.jpg",
    "durationSeconds": 8,
    "frames": 192,
    "fps": 24,
    "loadTimeoutMs": 30000,
    "captions": [
      {
        "act": 0,
        "text": "Uma página tenta prescrever os caminhos de quem ainda vive."
      },
      {
        "act": 1,
        "text": "Orfeu rompe as amarras. A antimagia devolve silêncio ao papel."
      },
      {
        "act": 2,
        "text": "A página ficou em branco. Nenhuma resposta será imposta."
      }
    ]
  }
};

export function getQuestCinematicV34(id:string):QuestVideoSceneV34|undefined{
 return Object.prototype.hasOwnProperty.call(QUEST_CINEMATICS_V34,id)?QUEST_CINEMATICS_V34[id as QuestCinematicId]:undefined;
}
export function questVideoRangeV34(scene:CinematicFilmSpec,act?:SceneAct){
 const selected=act===0||act===1||act===2?act:undefined;
 const startFrame=selected===undefined?0:Math.floor(scene.frames*selected/3),endFrame=selected===undefined?scene.frames:Math.floor(scene.frames*(selected+1)/3);
 return {startFrame,endFrame,startSeconds:startFrame/scene.fps,endSeconds:endFrame/scene.fps,durationSeconds:(endFrame-startFrame)/scene.fps};
}
export function questVideoFrameV34(scene:CinematicFilmSpec,seconds:number){
 const time=Number.isFinite(seconds)?Math.max(0,seconds):0;
 return Math.min(scene.frames-1,Math.floor(time*scene.fps));
}
export function questVideoDurationMatchesV34(scene:CinematicFilmSpec,seconds:number){
 return Number.isFinite(seconds)&&seconds>0&&Math.abs(seconds-scene.durationSeconds)<=1/scene.fps+1e-6;
}
export function questVideoCaptionV34(scene:CinematicFilmSpec,seconds:number){
 const frame=questVideoFrameV34(scene,seconds);
 return [...scene.captions].reverse().find(caption=>frame>=Math.floor(scene.frames*caption.act/3))?.text;
}
export function questVideoClockV34(seconds:number){
 const whole=Math.floor(Math.max(0,Number.isFinite(seconds)?seconds:0));
 return `${Math.floor(whole/60)}:${String(whole%60).padStart(2,'0')}`;
}
export function questVideoCapturesKeyV34(key:string,modifiers:{ctrlKey?:boolean;metaKey?:boolean;altKey?:boolean}){
 return !(modifiers.ctrlKey||modifiers.metaKey||modifiers.altKey||/^F\d+$/i.test(key));
}
export function questVideoTabTargetV34(type:string,shift:boolean,index:number,count:number){
 if(type!=='keydown'||count<1)return null;
 if(index<0)return shift?count-1:0;
 if(shift&&index===0)return count-1;
 if(!shift&&index===count-1)return 0;
 return null;
}
