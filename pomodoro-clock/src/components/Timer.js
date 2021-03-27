import { useRef } from 'react';
import NumberDial from './NumberDial';
import '../styles/Timer.scss';

export const Timer = (props) => {
  const mm = [
    Math.floor(props.value.mm / 10), props.value.mm % 10
  ];
  const ss = [
    Math.floor(props.value.ss / 10), props.value.ss % 10  
  ];
  
  const prevRef = useRef();
  const { label: lastLabel, flag = false } = prevRef.current ?? {};
  prevRef.current = { label: props.label, flag: !flag };
  
  const [prevClass, curClass] = lastLabel !== props.label ?
        [` exit`, ` enter`] :
        [` hide`, ` show`];
  
  const labelContent = (
    <>
      <span className={`timer-label${prevClass}`}>
        {lastLabel}
      </span>
      <span className={`timer-label${curClass}`}>
        {props.label}
      </span>
    </>
  );
  
  return (
    <div className="timer-container">
      {flag && labelContent}
      {!flag && labelContent}
      <span id="timer-label" className="timer-placeholder">
        {props.label}
      </span>
      <div className="timer-value" aria-hidden="true">
        <NumberDial value={mm[0]} />
        <NumberDial value={mm[1]} />
        <span className="timer-separator">:</span>
        <NumberDial value={ss[0]} />
        <NumberDial value={ss[1]} />
      </div>
      <span id="time-left" className="sr-only">
        {`${mm[0]}${mm[1]}:${ss[0]}${ss[1]}`}
      </span>
    </div>
  );
};

export default Timer;
