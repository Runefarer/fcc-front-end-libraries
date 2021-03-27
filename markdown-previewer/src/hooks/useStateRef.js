import { useState, useRef } from 'react';

export const useStateRef = initial => {
  const [state, setState] = useState(initial);
  
  const stateRef = useRef(state);
  const setStateRef = data => {
    stateRef.current = data;
    setState(data);
  };
  
  return [stateRef, setStateRef];
};

export default useStateRef;
