import { useEffect, useRef } from 'react';
import { useStateRef } from '../hooks/useStateRef';
import { useKeyDown } from '../hooks/useKeyDown';
import { BANKS, KEYS, NAME } from '../shared/constants';
import ToggleInput from './ToggleInput';
import RadioInput from './RadioInput';
import KnobInput from './KnobInput';
import DrumPad from './DrumPad';
import '../styles/DrumMachine.scss';

export const DrumMachine = () => {
  // { power, bank, volume, display }
  const [state, setState] = useStateRef({
    on: true,
    bankName: "Heater Kit",
    bank: BANKS["Heater Kit"],
    volume: 0.15,
    display: NAME
  });
  const padRefs = useRef([]);
  
  useEffect(() => {
    padRefs.current = padRefs.current.slice(0, KEYS.length);
  }, []);

  useKeyDown(event => {
    const idx = KEYS.indexOf(event.code.replace(/^Key/, ""));
    if(idx !== -1 && padRefs.current[idx]) {
      padRefs.current[idx].trigger();
    }
  });
  
  const updateDisplay = display => {
    setState({ ...state.current, display });
  };
  
  const togglePower = () => {
    setState({ 
      ...state.current, 
      on: !state.current.on,
      display: !state.current.on ? NAME : ``
    });
  }
  
  const changeBank = bankName => {
    setState({ 
      ...state.current, 
      bankName, 
      bank: BANKS[bankName],
      display: bankName
    });
  };
  
  const changeVolume = volume => {
    setState({
      ...state.current,
      volume,
      display: `Volume: ${Math.round(volume * 100)}%`
    });
  };
  
  const drumPads = KEYS.map((key, idx) => {
    return (
      <DrumPad 
        key={key} 
        id={state.current.bank[idx].id}
        name={key}
        src={state.current.bank[idx].url}
        volume={state.current.volume}
        power={state.current.on}
        onTrigger={updateDisplay}
        ref={(el) => (padRefs.current[idx] = el)}
        />
    );
  });
  
  return (
    <div id="drum-machine" className={`drum-machine  ${state.current.on ? `on` : `off`}`}>
      <div id="display" className="drum-display">
        <span 
          className="drum-display-placeholder" 
          aria-hidden="true"
          >
          Empty
        </span>
        {state.current.on && (<span 
          className="drum-display-content"
          >
          {state.current.display}
        </span>)}
      </div>
      <div className="drum-controls">
        <div className="drum-panel drum-left">
          <ToggleInput 
            id="power"
            label="Power" 
            value={state.current.on}
            onToggle={togglePower}
            />
          <RadioInput
            id="bank"
            label="Bank"
            value={state.current.bankName}
            options={Object.keys(BANKS)}
            disabled={!state.current.on}
            onChange={changeBank}
            />
        </div>
        <div className="drum-pads">
          {drumPads}
        </div>
        <div className="drum-panel drum-right">
          <KnobInput 
            id="volume"
            label="Volume" 
            value={state.current.volume}
            onChange={changeVolume}
            disabled={!state.current.on}
            />
        </div>
      </div>
      <div className="drum-label">
        Runefarer Kit
      </div>
    </div>
  );
};

export default DrumMachine;
