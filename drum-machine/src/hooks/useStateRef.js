import { useRef, useState } from 'react';

export const useStateRef = (initialState) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef();
  stateRef.current = state;
  
  const setStateRef = data => {
    stateRef.current = data;
    setState(data);
  };
  
  return [stateRef, setStateRef];
};

export default useStateRef;
