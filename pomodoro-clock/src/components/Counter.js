import { useReducer } from 'react';
import '../styles/Counter.scss';

export const Counter = (props) => {
  const [state, dispatch] = useReducer(
    (state, prev) => ({ prev, switch: !state.switch }),
    { prev: undefined, switch: false }
  );
  
  const change = value => {
    dispatch(props.value);
    props.onChange(value);
  };
  
  const decrement = () => {
    if(props.value > props.min) {
      change(props.value - 1);
    }
  };
  
  const increment = () => {
    if(props.value < props.max) {
      change(props.value + 1);
    }
  };
  
  const set = (
    <>
      <span 
        className={`counter-value down${state.prev !== undefined && state.prev !== props.value ? (state.prev < props.value ? ` left` : ` right`) : ` hide`}`}
        >
        {state.prev}
      </span>
      <span 
        className={`counter-value up${state.prev !== undefined && state.prev !== props.value ? (state.prev < props.value ? ` right` : ` left`) : ``}`}
        >
        {props.value}
      </span>
    </>
  );
  
  return (
    <div className="counter-container">
      <div className="counter-screen">
        <div className="counter-value-container">
          { state.switch && set }
          { !state.switch && set }
          <span id={`${props.name}-length`} className="counter-value-placeholder">
            {props.value}
          </span>
        </div>
        <span id={`${props.name}-label`} className="counter-label">
          {props.label}
        </span>
        <label 
          htmlFor={`${props.name}-input`}
          className="sr-only"
          >
          {props.label}
        </label>
        <input
          id={`${props.name}-input`}
          className="sr-only"
          type="number"
          min={props.min}
          max={props.max}
          value={props.value}
          onChange={e => change(e.target.value)}
          />
      </div>
      <div className="counter-controls">
        <button 
          id={`${props.name}-decrement`}
          className="button"
          onClick={decrement}
          >
          <i className="fas fa-chevron-left" aria-hidden="true" />
          <span className="sr-only">Decrement</span>
        </button>
        <button 
          id={`${props.name}-increment`} 
          className="button"
          onClick={increment}
          >
          <i className="fas fa-chevron-right" aria-hidden="true" />
          <span className="sr-only">Increment</span>
        </button>
      </div>
    </div>
  );
};

export default Counter;
