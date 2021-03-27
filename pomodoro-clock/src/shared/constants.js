/*
  Ringing sound from 
  https://freesound.org/people/bone666138/sounds/198841/ 
*/
export const BEEP_SOUND = {
  src: `https://freesound.org/data/previews/198/198841_285997-lq.mp3`,
  start: 1,
  end: 3.5
};

export const DEFAULT_BREAK_LENGTH = 5;
export const DEFAULT_SESSION_LENGTH = 25;
export const DEFAULT_VOLUME = 0.15;

export const MODE_BREAK = "BREAK";
export const MODE_SESSION = "SESSION";

export const BEEP_NONE = 0;
export const BEEP_PLAY = 1;
export const BEEP_PLAYING = 2;
