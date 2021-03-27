import { useEffect } from 'react';

export const useKeyDown = (onKeyDown) => {
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
};

export default useKeyDown;
