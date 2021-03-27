import { useRef } from 'react';
import { isCyclicPrev } from '../shared/helpers';
import '../styles/NumberDial.scss';

export const NumberDial = (props) => {
  const prevRef = useRef();
  
  const { value: prev, flag = false} = prevRef.current ?? {};
  prevRef.current = { 
    value: props.value,
    flag: !flag
  };
  
  const [prevClass, curClass] = 
        prev === undefined || prev === props.value ?
          [` hide`, ` show`] : 
          (
            isCyclicPrev(prev, props.value) ? 
              [` exit up`, ` enter up`] : 
              [` exit down`, ` enter down`]
          );
  
  const content = (
    <>
      <span className={`number-value${prevClass}`}>
        {prev}
      </span>
      <span className={`number-value${curClass}`}>
        {props.value}
      </span>
    </>
  );
  
  return (
    <div className="number-dial">
      {flag && content}
      {!flag && content}
      <span className="number-placeholder" aria-hidden="true">
        8
      </span>
    </div>
  );
};

export default NumberDial;
