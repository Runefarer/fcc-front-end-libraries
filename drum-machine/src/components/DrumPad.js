import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useStateRef } from '../hooks/useStateRef';
import '../styles/DrumPad.scss';

export const DrumPad = forwardRef((props, ref) => {
  const [active, setActive] = useStateRef(false);
  const audioRef = useRef();
  
  const trigger = () => {
    if(!audioRef.current) {
      return;
    }
    
    if(!props.power) {
      return;
    }
    
    audioRef.current.volume = props.volume;
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    if(typeof props.onTrigger === "function") {
      props.onTrigger(props.id);
    }
    
    setTimeout(() => {
      if(active.current) {
        setActive(false);
      }
    }, 300);
    
    setActive(true);
  };
  
  useImperativeHandle(ref, () => ({ trigger }));
  
  return (
    <div 
      id={props.id} 
      className={`drum-pad${active.current ? ` active` : ``}`} 
      onClick={trigger}
      >
      {props.name}
      <audio 
        id={props.name} 
        className="clip" 
        src={props.src}
        ref={audioRef}
        />
    </div>
  );
});

export default DrumPad;
