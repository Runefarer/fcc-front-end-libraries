import { useEffect, useRef } from 'react';
import { useStateRef } from './useStateRef';

export const useFlexSize = (numChildren, dimenProp = "offsetHeight") => {
  const containerRef = useRef();
  const childRefs = new Array(numChildren).map(() => useRef());
  
  const [sizesRef, setSizesRef] = useStateRef();
  
  const getSizes = () => {
    if(containerRef.current && childRefs.every(child => child.current)) {
      setSizesRef({
        parent: containerRef.current[dimenProp],
        children: childRefs.map(child => child.current[dimenProp])
      })
    }
  };
  
  useEffect(() => {
    window.addEventListener("resize", getSizes);
    return () => window.removeEventListener("resize", getSizes);
  }, []);
  
  useEffect(getSizes, [containerRef, ...childRefs]);
  
  return [
    containerRef, 
    childRefs, 
    sizesRef.current
      ? (
        sizesRef.current.parent - sizesRef.current.children.reduce(
          (acc, val) => acc + val, 0
        )
      )
      : null
  ];
};

export default useFlexSize;
