import { useEffect } from 'react';
import { useStateRef } from './useStateRef';

export const useResize = (resizeStart, resize, resizeEnd) => {
  const [stateRef, setStateRef] = useStateRef({ resizing: false });
  
  const onResizeStart = (event, data) => {
    if(!stateRef.current.resizing) {
      setStateRef({ 
        ...stateRef.current, 
        ...(
          typeof resizeStart === "function" ?
            resizeStart(event, data, stateRef.current) : 
            {}
        ),
        resizing: true
      });
      
      event.nativeEvent.preventDefault();
      event.nativeEvent.stopPropagation();
    }
  };
  
  
  const onResize = (event) => {
    if(stateRef.current.resizing) {
      if(typeof resize === "function") {
        resize(event, stateRef.current);
      }
      
      event.preventDefault();
      event.stopPropagation();
    }
  };
  
  const onResizeEnd = (event) => {
    if(stateRef.current.resizing) {
      setStateRef({ 
        ...stateRef.current,
        ...(
          typeof resizeEnd === "function" ?
            resizeEnd(event, stateRef.current) :
            {}
        ),
        resizing: false
      });
      
      event.preventDefault();
      event.stopPropagation();
    }
  };
  
  useEffect(() => {
    document.addEventListener("pointermove", onResize, true);
    document.addEventListener("pointerup", onResizeEnd, true);
    
    return () => {
      document.removeEventListener("pointermove", onResize, true);
      document.removeEventListener("pointerup", onResizeEnd, true);
    };
  }, []);
  
  return onResizeStart;
};