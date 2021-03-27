import { useFlexSize } from '../hooks/useFlexSize';
import { DOCK_HORIZONTAL } from '../shared/constants';
import '../styles/DockPanel.scss';

export const DockPanel = (props) => {
  // FIX THIS, IDIOT!!!!!!!!!!!!!
  const [containerRef, childRefs, flexHeight] = useFlexSize(1);
  const style = flexHeight !== null ? { height: `${flexHeight}px` } : {};
  const isHorizontal = props.orientation === DOCK_HORIZONTAL;
  
  let collapseArrow = "";
  if(props.collapsed) {
    collapseArrow = isHorizontal ? "fas fa-chevron-right" : "fas fa-chevron-up";
  } else {
    collapseArrow = isHorizontal ? "fas fa-chevron-left" : "fas fa-chevron-down";
  }
  
  return (
    <div className={`dock-panel ${props.collapsed ? `collapsed` : `expanded`} ${isHorizontal ? `horizontal` : `vertical`}`} ref={containerRef}>
      <div className="dock-panel-header" ref={childRefs[0]}>
        <span className="dock-panel-title">
          {props.icon && <i className={props.icon} />}
          {
            props.collapsed && isHorizontal
            ? props.title.split("").map((char, idx) => <span key={idx}>{char}</span>)
            : props.title
          }
        </span>
        <button className="dock-panel-control" onClick={props.onCollapseToggle}>
          <i className={collapseArrow} />
        </button>
      </div>
      <div className="dock-panel-content" style={style}>
        {props.children}
      </div>
    </div>
  );  
};

export default DockPanel;
