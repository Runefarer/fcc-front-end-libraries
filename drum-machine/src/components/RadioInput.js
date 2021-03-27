import '../styles/RadioInput.scss';

export const RadioInput = (props) => {
  return (
    <div className="radio-input">
      <span className="radio-input-label">
        {props.label}
      </span>
      <div className="radio-input-controls">
        {props.options.map((opt, idx) => {
          const id = `${props.id}-${idx}`;
          return (
            <div 
              className="radio-input-control-container"
              key={id}
              >
              <label 
                className="sr-only"
                htmlFor={id}
              >
                <input 
                  type="radio"
                  id={id}
                  name={props.label}
                  checked={!props.disabled && props.value === opt}
                  onChange={() => props.onChange(opt)}
                  disabled={props.disabled}
                  />
                {opt}
              </label>
              <div 
                className={
                  `radio-input-control` +
                  `${props.value === opt ? ` checked` : ``}` +
                  `${props.disabled ? ` disabled` : ``}`
                }
                onClick={() => props.onChange(opt)}
                aria-hidden="true"
                >
                <div 
                  className="radio-input-fill" 
                  />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );  
}

export default RadioInput;
