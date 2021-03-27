import { cloneElement } from 'react';
import { usePanels } from '../hooks/usePanels';
import { useResize } from '../hooks/useResize';
import { DOCK_COLLAPSED_SIZE, DOCK_HORIZONTAL } from '../shared/constants';
import '../styles/Dock.scss';

const toggleCollapse = (sizes, idx, size) => {
  const shift = sizes[idx] - size;
  const nextIdx = idx === sizes.length - 1 ? idx - 1 : idx + 1;
  
  return sizes.map((val, i) => {
    if(i === idx) {
      return val - shift;
    } else if(i === nextIdx) {
      return val + shift;
    } else {
      return val
    }
  });
};

export const Dock = (props) => {
  // FIX THIS, IDIOT!!!!!!!!!!!!!
  const [panelsState, setPanelsState] = usePanels(props.children, props.breakpointWidth);
  const state = panelsState.current;
  const isHorizontal = state.orientation === DOCK_HORIZONTAL;
  
  const onResizeStart = useResize(
    (event, idx, resizingState) => ({ idx }),
    (event, resizingState) => {
      const idx = resizingState.idx;
      
      const sizes = panelsState.current.sizes;
      const move = panelsState.current.orientation === DOCK_HORIZONTAL
        ? event.movementX
        : event.movementY;
      
      const modIdxs = [ idx - 1, idx ];
      const modSizes = [ sizes[idx - 1] + move, sizes[idx] - move ];
      
      const collapsed = { ...panelsState.current.collapsed, toggled: [] };
      
      for(const modIdx of modIdxs) {
        if(collapsed.idx === modIdx) {
          if(modSizes[modIdx] <= DOCK_COLLAPSED_SIZE) {
            return;
          }
          
          collapsed.idx = -1;
          collapsed.last = -1;
        }
      }
      
      modSizes.forEach((size, i) => {
        if(size <= DOCK_COLLAPSED_SIZE) {
          const shift = sizes[modIdxs[i]] - DOCK_COLLAPSED_SIZE;
          modSizes[i] = DOCK_COLLAPSED_SIZE;
          modSizes[(i + 1) % modSizes.length] = sizes[modIdxs[(i + 1) % modIdxs.length]] + shift;
          
          collapsed.idx = modIdxs[i];
          collapsed.last = sizes[modIdxs[i]];
        }
      });
      
      setPanelsState({
        ...panelsState.current,
        sizes: [
          ...sizes.slice(0, idx - 1),
          ...modSizes,
          ...sizes.slice(idx + 1)
        ],
        collapsed
      });
    },
  );
  
  const onCollapseToggle = idx => {
    const state = panelsState.current;
    
    const collapsed = state.collapsed;
    const sizes = state.sizes;
    
    if(collapsed.idx === -1) {
      setPanelsState({
        ...state,
        sizes: toggleCollapse(sizes, idx, DOCK_COLLAPSED_SIZE),
        collapsed: { idx, last: sizes[idx], toggled: [idx] }
      });
    } else {
      const toggled = [collapsed.idx];
      
      let updatedSizes = toggleCollapse(sizes, collapsed.idx, collapsed.last);
      let last = -1;
      
      if(collapsed.idx !== idx) {
        toggled.push(idx);
        
        last = updatedSizes[idx];
        updatedSizes = toggleCollapse(updatedSizes, idx, DOCK_COLLAPSED_SIZE);
      }
      
      setPanelsState({
        ...state,
        sizes: updatedSizes,
        collapsed: collapsed.idx === idx ? { idx: -1, last: -1, toggled } : { idx, last, toggled }
      });
    }
  };
  
  const content = props.children.reduce(
    (acc, val, idx) => {
      if(idx > 0) {
        acc.push(
          <div className="dock-panel-separator" 
            key={acc.length} 
            ref={panelsState.current.separatorRefs[idx - 1]}
            onPointerDown={(e) => onResizeStart(e, idx)} 
            />
        );
      }
      
      const sizes = state.sizes;
      
      const style = { width: "100%", height: "100%" };
      style[isHorizontal ? `width` : `height`] = sizes[idx] !== null ? `${sizes[idx]}px` : `auto`;
      
      acc.push(
        <div className={`dock-panel-container ${state.collapsed.toggled.includes(idx) ? `transition` : `stable`}`} 
          key={acc.length} 
          ref={panelsState.current.refs[idx]} 
          style={style}
        >
          {
            cloneElement(val, {
              orientation: state.orientation,
              collapsed: state.collapsed.idx === idx,
              onCollapseToggle: () => onCollapseToggle(idx)
            })
          }
        </div>
      );
      
      return acc;
    },
    [],
  );
  
  const style = props.height !== null ? { height: `${props.height}px` } : {};
  return (
    <div className={`dock ${isHorizontal ? `horizontal` : `vertical`}`}
      style={style} 
      ref={state.containerRef}
    >
      {content}
    </div>
  );
};

export default Dock;
