import '../styles/ToggleInput.scss';

export const ToggleInput = (props) => {
  return (
    <div className="toggle-input">
      <label className="toggle-input-label" htmlFor={props.id}>
        {props.label}
      </label>
      <input 
        id={props.id}
        className="sr-only"
        type="checkbox"
        checked={props.value}
        onChange={props.onToggle}
        />
      <div 
        className={`toggle-input-control ${props.value ? `on` : `off`}`} 
        onClick={props.onToggle}
        aria-hidden="true"
        >
        <div className="toggle-input-slider" />
      </div>
    </div>
  );
};

export default ToggleInput;
