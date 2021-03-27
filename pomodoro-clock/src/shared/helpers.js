export const secsToTime = secs => {
  return { mm: Math.floor(secs / 60), ss: secs % 60 };
};

export const accurateInterval = (fn, time) => {
  let nextAt = Date.now() + time;
  let timeout = null;
  
  const wrapper = () => {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - Date.now());
    return fn();
  };
  
  timeout = setTimeout(wrapper, nextAt - Date.now());
  
  return {
    cancel() {
      clearTimeout(timeout);
    }
  };
}

export const isCyclicPrev = (prev, cur, total = 10) => {
  return (prev < cur && (cur + 1) % total !== prev) || 
    (prev + 1) % total === cur;
};
