import { useEffect, useRef } from 'react';
import { useStateRef } from './useStateRef';
import { 
  DOCK_COLLAPSED_SIZE, 
  DOCK_HORIZONTAL,
  DOCK_VERTICAL
} from '../shared/constants';

export const usePanels = (panels, breakpointWidth) => {
  const [stateRef, setStateRef] = useStateRef({
    containerRef: useRef(),
    refs: panels.map(() => useRef()),
    separatorRefs: new Array(panels.length - 1).fill(0).map(() => useRef()),
    sizes: panels.map(() => null),
    collapsed: { idx: -1, last: -1, toggled: [] },
    orientation: DOCK_HORIZONTAL
  });
  
  const updateSizes = () => {
    const state = stateRef.current;
    const prop = state.orientation === DOCK_HORIZONTAL ? "offsetWidth" : "offsetHeight";
    
    if(state.containerRef.current && state.sizes.every(size => size === null)) {
      const totalSize = state.containerRef.current[prop];
      const separatorsSize = state.separatorRefs.length
        ? state.separatorRefs.length * state.separatorRefs[0].current[prop]
        : 0;
      const size = (totalSize - separatorsSize) / state.refs.length;
      
      setStateRef({
        ...state, 
        sizes: state.sizes.map(() => size) 
      });
    } else {
      setStateRef({
        ...state, 
        sizes: state.refs.map((ref, idx) => {
          if(!ref.current) {
            return null;
          }
          if(state.collapsed.idx === idx) {
            return DOCK_COLLAPSED_SIZE;
          }
          
          return ref.current[prop];
        }) 
      });   
    } 
  };
  
  const onResize = () => {
    // FIX THIS, IDIOT!!!!!!
    // USE OBJECT FOR BREAKPOINTS AND ORIENTATION!!!
    const state = stateRef.current;
    if(state.containerRef.current) {
      if(
          state.orientation !== DOCK_HORIZONTAL
          && state.containerRef.current.offsetWidth > breakpointWidth
      ) {
        setStateRef({
          ...state, 
          orientation: DOCK_HORIZONTAL
        }); 
      } else if(
        state.orientation !== DOCK_VERTICAL 
        && state.containerRef.current.offsetWidth <= breakpointWidth
      ) {
        setStateRef({
          ...state, 
          orientation: DOCK_VERTICAL
        }); 
      }
    }
    
    updateSizes();  
  };
  
  useEffect(onResize, [stateRef.current.containerRef]);
  
  useEffect(updateSizes, [ 
    ...stateRef.current.refs,
    ...stateRef.current.separatorRefs
  ]);
  
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  
  return [stateRef, setStateRef];
};

export default usePanels;
