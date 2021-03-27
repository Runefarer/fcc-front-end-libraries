import { useEffect, useRef } from 'react';
import { useStateRef } from '../hooks/useStateRef';
import { getAngleDiff, normalVector } from '../shared/helpers';
import '../styles/KnobInput.scss';

export const KnobInput = props => {
  const [state, setState] = useStateRef({
    value: props.value,
    moving: false,
    moveOrigin: null,
    vector: null
  });
  const dialRef = useRef();
  
  const onMoveStart = event => {
    if(!state.current.moving) {
      const rect = dialRef.current.getBoundingClientRect();
      const moveOrigin = {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
      };
      setState({ 
        ...state.current, 
        moving: true,
        moveOrigin,
        vector: normalVector(
          event.clientX - moveOrigin.x,
          event.clientY - moveOrigin.y
        )
      });
    }
  };
  
  const onMove = event => {
    if(state.current.moving) {
      const newVector = normalVector(
        event.clientX - state.current.moveOrigin.x,
        event.clientY - state.current.moveOrigin.y
      );
      
      const [angle, dir] = getAngleDiff(state.current.vector, newVector);
      const value = Math.max(0, Math.min(1, state.current.value + (dir * angle / Math.PI)));
      
      if(state.current.value !== value) {
        props.onChange(value);
      }
      
      setState({
        ...state.current,
        vector: newVector,
        value
      });
    }
  };
  
  const onMoveEnd = event => {
    if(state.current.moving) {
      setState({ 
        ...state.current, 
        moving: false,
        origin: null,
        vector: null
      });
    }
  };
  
  useEffect(() => {
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onMoveEnd);
    
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onMoveEnd);
    };
  }, []);
  
  const hue = (1 - props.value) * 240;
  const color = props.disabled ? `hsl(10, 20%, 20%)`: `hsl(${hue}, 70%, 60%)`;
  const colorGlow = props.disabled ? `hsl(10, 20%, 20%)`: `hsl(${hue}, 60%, 40%)`;
  
  const dialStyle = {
    "transform": `rotate(${props.value * 180}deg)`,
    "border": `3px solid ${color}`
  };
  
  const pointerStyle = {
    "backgroundColor": color,
    "boxShadow": `0 0 2rem ${color}`
  };
  
  const shadowStyle = {
    "boxShadow": props.disabled ? `0 0.4rem 0.1rem 0.1rem black` :
      `0 0 0.5rem ${color},` +
      `0 0.4rem 0.1rem 0.1rem black,` +
      `0 0.5rem 3rem 0.25rem ${colorGlow}`
  };
  
  return (
    <div className="knob-input">
      <label className="knob-input-label" htmlFor={props.id}>
        {props.label}
      </label>
      <input 
        id={props.id}
        className="sr-only"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
        />
      <div className="knob-input-control" aria-hidden="true">
        <div 
          className="knob-input-dial" 
          style={dialStyle} 
          onPointerDown={onMoveStart}
          ref={dialRef}
          >
          <div 
            className="knob-input-dial-pointer"
            style={pointerStyle}
            />
        </div>
        <div 
          className="knob-input-dial-shadow" 
          style={shadowStyle}
          />
      </div>
    </div>
  )
};

export default KnobInput;
