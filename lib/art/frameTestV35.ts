import type {CinematicFilmSpec} from './questCinematicsV34';

/** A single illustration sequence for comparison; it is not a mission or save ID. */
export const MIKA_FRAME_TEST_V35:CinematicFilmSpec={
 id:'mika-frame-test-v35',
 title:'Teste quadro a quadro · Mika',
 actors:['Mika'],
 avatars:[{name:'Mika',src:'/assets/v31/companions/mika/face.png'}],
 src:'/assets/v35/frame-test/mika.mp4',
 poster:'/assets/v35/frame-test/mika-poster.png',
 durationSeconds:2,
 frames:48,
 fps:24,
 loadTimeoutMs:30000,
 captions:[
  {act:0,text:'Mika · 48 desenhos em sequência a 24 quadros por segundo.'},
  {act:1,text:'Mika · 48 desenhos em sequência a 24 quadros por segundo.'},
  {act:2,text:'Mika · 48 desenhos em sequência a 24 quadros por segundo.'}
 ]
};
