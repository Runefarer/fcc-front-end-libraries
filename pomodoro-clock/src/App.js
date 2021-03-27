import { useReducer, useRef } from 'react';
import {
  DEFAULT_VOLUME,
  BEEP_NONE,
  BEEP_PLAY,
  BEEP_SOUND,
  MODE_SESSION,
} from './shared/constants';
import {
  actionChange,
  actionPlayed,
  actionReset,
  actionToggle,
  clockReducer,
  INITIAL_CLOCK_STATE,
} from './shared/clockReducer';
import Timer from './components/Timer';
import Counter from './components/Counter';
import './styles/App.scss';

const App = props => {
  const [state, dispatch] = useReducer(clockReducer, INITIAL_CLOCK_STATE);
  const beepRef = useRef();
  
  if(beepRef.current) {
    if(state.beep === BEEP_PLAY && beepRef.current.paused) {
      beepRef.current.volume = DEFAULT_VOLUME;
      beepRef.current.currentTime = BEEP_SOUND.start;
      beepRef.current.play();
      dispatch(actionPlayed());
    } else if(state.beep === BEEP_NONE && !beepRef.current.paused) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    } 
  }
  
  const alarmClass = beepRef.current && !beepRef.current.paused && beepRef.current.currentTime < BEEP_SOUND.end ? ` alarm` : ``;
  
  return (
    <div className="container">
      <div className={`clock${alarmClass}`}>
        <div className="clock-header">
          25 + 5 Clock
        </div>
        <div className="clock-controls">
          <button 
            id="start_stop" 
            className={`button${state.running ? ` active` : ``}`}
            onClick={() => dispatch(actionToggle(dispatch))}
            >
            <i 
              className={state.running ? `fas fa-pause` : `fas fa-play`}
              aria-hidden="true"
              />
            <span className="sr-only">
              {state.running ? "Stop" : "Start"}
            </span>
          </button>
          <button 
            id="reset" 
            className="button"
            onClick={() => dispatch(actionReset())}
            >
            <i className="fas fa-redo" aria-hidden="true" />
            <span className="sr-only">Reset</span>
          </button>
        </div>
        <div className="clock-timer">
          <Timer 
            label={state.mode === MODE_SESSION ? `Session` : `Break`} 
            value={state.time} 
            />
        </div>
        <div className="clock-counters">
          <Counter
            name="break" 
            label="Break Length"
            min={1} 
            max={60} 
            value={state.breakLength} 
            onChange={value => dispatch(actionChange(`breakLength`, value))} 
            />
          <Counter
            name="session"
            label="Session Length"
            min={1} 
            max={60} 
            value={state.sessionLength} 
            onChange={value => dispatch(actionChange(`sessionLength`, value))} 
            />
        </div>
        {/*
          Ringing sound from 
          https://freesound.org/people/bone666138/sounds/198841/ 
        */}
        <audio
          id="beep"
          ref={beepRef}
          src={BEEP_SOUND.src}
          />
      </div>
    </div>
  );
};

export default App;
