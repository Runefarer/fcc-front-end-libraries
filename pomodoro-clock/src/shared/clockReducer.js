import {
  DEFAULT_BREAK_LENGTH,
  DEFAULT_SESSION_LENGTH,
  MODE_SESSION,
  MODE_BREAK,
  BEEP_NONE,
  BEEP_PLAY,
  BEEP_PLAYING,
} from './constants';
import { accurateInterval, secsToTime } from './helpers';

export const INITIAL_CLOCK_STATE = {
  breakLength: DEFAULT_BREAK_LENGTH,
  sessionLength: DEFAULT_SESSION_LENGTH,
  time: secsToTime(DEFAULT_SESSION_LENGTH * 60),
  running: false,
  mode: MODE_SESSION,
  interval: null,
  beep: BEEP_NONE
};

const ACTION_CHANGE = "CHANGE";
const ACTION_TOGGLE = "TOGGLE";
const ACTION_TICK = "TICK";
const ACTION_RESET = "RESET";
const ACTION_PLAYED = "PLAYED";

export const actionChange = (prop, value) => ({ 
  type: ACTION_CHANGE, prop, value 
});
export const actionToggle = dispatch => ({ type: ACTION_TOGGLE, dispatch });
export const actionTick = dispatch => ({ type: ACTION_TICK, dispatch });
export const actionReset = () => ({ type: ACTION_RESET });
export const actionPlayed = () => ({ type: ACTION_PLAYED });

const handleChange = (state, { prop, value }) => {
  if(state.running) {
    return state;
  }
  
  const updateTime = 
        (prop === "sessionLength" && state.mode === MODE_SESSION) ||
        (prop === "breakLength" && state.mode === MODE_BREAK);
  
  return {
    ...state,
    [prop]: value,
    time: updateTime ? { mm: value, ss: 0 } : state.time
  };
};

const handleToggle = (state, { dispatch }) => {
  if(state.running) {
    if(state.interval) {
      state.interval.cancel();
    }
    
    return {
      ...state,
      running: false,
      interval: null,
      beep: BEEP_NONE
    };
  }
  
  return { 
    ...state, 
    running: true, 
    interval: accurateInterval(() => dispatch(actionTick()), 1000),
    beep: BEEP_NONE
  };
};

const handleTick = state => {
  let mode = state.mode;
  let timeSecs = null;
  
  if(state.time.mm === 0 && state.time.ss === 0) {
    if(state.mode === MODE_SESSION) {
      mode = MODE_BREAK;
      timeSecs = state.breakLength * 60;
    } else {
      mode = MODE_SESSION;
      timeSecs = state.sessionLength * 60;
    }
  } else {
    const diff = 1;
    timeSecs = Math.max(0, state.time.mm * 60 + state.time.ss - diff);
  }
  
  const time = secsToTime(timeSecs);
  
  return { 
    ...state, 
    mode,
    time, 
    beep: timeSecs === 0 ? BEEP_PLAY : state.beep
  };
};

const handleReset = state => {
  if(state.running) {
    if(state.interval) {
      state.interval.cancel();
    }
  }
  
  return { ...INITIAL_CLOCK_STATE };
};

const handlePlayed = state => ({ ...state, beep: BEEP_PLAYING });

export const clockReducer = (state, action) => {
  switch(action.type) {
    case ACTION_CHANGE:
      return handleChange(state, action);
    case ACTION_TOGGLE:
      return handleToggle(state, action);
    case ACTION_TICK:
      return handleTick(state);
    case ACTION_RESET:
      return handleReset(state);
    case ACTION_PLAYED:
      return handlePlayed(state);
    default:
      return state;
  }
};

export default clockReducer;
