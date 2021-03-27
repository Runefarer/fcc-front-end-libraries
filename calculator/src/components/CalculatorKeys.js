import { useEffect, useReducer } from 'react';
import { NUMBERS, OPERATORS } from '../shared/constants';
import {
  isNumber,
  isOperator,
  isParen,
} from '../shared/helpers';
import { 
  actionClear,
  actionDelete,
  actionNumber,
  actionDecimal,
  actionParen,
  actionAns,
  actionOperator,
  actionEquals,
} from '../shared/calcReducer';
import '../styles/CalculatorKeys.scss';

const CalculatorKeys = props => {
  const [state, dispatch] = useReducer((state, action) => {
    const newState = { ...state };
    switch(action.type) {
        case "activate":
          if(newState[action.key].timeout) {
            clearTimeout(newState[action.key].timeout);
          }

          newState[action.key].timeout = setTimeout(() => dispatch({ 
            type: "deactivate", key: action.key
          }), 300);

          newState[action.key].active = true;
        
          return newState;
        case "deactivate":
          newState[action.key] = { active: false, timeout: null };
          return newState;
        default:
          return newState;
    }
  }, {
    "clear": { active: false, timeout: null },
    "delete": { active: false, timeout: null },
    "ans": { active: false, timeout: null },
    "equals": { active: false, timeout: null },
    "(": { active: false, timeout: null },
    ")": { active: false, timeout: null },
    "0": { active: false, timeout: null },
    "1": { active: false, timeout: null },
    "2": { active: false, timeout: null },
    "3": { active: false, timeout: null },
    "4": { active: false, timeout: null },
    "5": { active: false, timeout: null },
    "6": { active: false, timeout: null },
    "7": { active: false, timeout: null },
    "8": { active: false, timeout: null },
    "9": { active: false, timeout: null },
    "+": { active: false, timeout: null },
    "-": { active: false, timeout: null },
    "*": { active: false, timeout: null },
    "/": { active: false, timeout: null },
    "decimal": { active: false, timeout: null }
  });
  
  const activate = key => {
    dispatch({ type: "activate", key });
  }
  
  const onKeyDown = event => {
    let handled = true;
    
    if(isNumber(event.key)) {
      props.dispatch(actionNumber(event.key));
      activate(event.key);
      
      handled = true;
    } else if(isOperator(event.key)) {
      props.dispatch(actionOperator(event.key));
      activate(event.key);
      
      handled = true;
    } else if(isParen(event.key)) {
      props.dispatch(actionParen(event.key));
      activate(event.key);
      
      handled = true;
    } else {
      handled = true;
      
      switch(event.key.toLowerCase()) {
        case "enter":
          props.dispatch(actionEquals());
          activate("equals");
          break;
        case "escape":
          props.dispatch(actionClear());
          activate("clear");
          break;
        case "backspace":
          props.dispatch(actionDelete());
          activate("delete");
          break;
        case "a":
          props.dispatch(actionAns());
          activate("ans");
          break;
        case ".":
          props.dispatch(actionDecimal());
          activate("decimal");
          break;
        default:
          handled = false;
          break;
      }
    }
    
    if(handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, true);
    
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);
  
  return (
    <div className="calculator-keys">
      <button 
        id="clear" 
        className={`calculator-key${state[`clear`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionClear())}
        >
        <span 
          className="calculator-key-label" 
          aria-hidden="true"
          >
          AC
        </span>
        <span className="sr-only">
          Clear
        </span>
      </button>
      <button
        id="delete"
        className={`calculator-key${state[`delete`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionDelete())}
        >
        <span 
          className="calculator-key-label" 
          aria-hidden="true"
          >
          DEL
        </span>
        <span className="sr-only">
          Backspace
        </span>
      </button>
      {
        NUMBERS.map((id, symbol) => (
          <button
            key={id}
            id={id} 
            className={`calculator-key${state[symbol].active ? ` active` : ``}`}
            onClick={() => props.dispatch(actionNumber(symbol))}
            >
            <span 
              className="calculator-key-label" 
              >
              {symbol}
            </span>
          </button>
        ))
      }
      <button 
        id="decimal" 
        className={`calculator-key${state[`decimal`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionDecimal())}
        >
        <span 
          className="calculator-key-label" 
          >
          .
        </span>
      </button>
      <button
        id="open-paren"
        className={`calculator-key${state[`(`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionParen("("))}
        >
        <span 
          className="calculator-key-label" 
          aria-hidden="true"
          >
          (
        </span>
        <span className="sr-only">
          Open Bracket
        </span>
      </button>
      <button
        id="close-paren"
        className={`calculator-key${state[`)`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionParen(")"))}
        >
        <span 
          className="calculator-key-label" 
          aria-hidden="true"
          >
          )
        </span>
        <span className="sr-only">
          Close Bracket
        </span>
      </button>
      <button
        id="ans"
        className={`calculator-key${state[`ans`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionAns())}
        >
        <span 
          className="calculator-key-label" 
          aria-hidden="true"
          >
          ANS
        </span>
        <span className="sr-only">
          Last Answer
        </span>
      </button>
      {
        Object.keys(OPERATORS).map(symbol => (
          <button 
            key={OPERATORS[symbol].id}
            id={OPERATORS[symbol].id} 
            className={`calculator-key${state[symbol].active ? ` active` : ``}`}
            onClick={() => props.dispatch(actionOperator(symbol))}
            >
            <span 
              className="calculator-key-label" 
              aria-hidden="true"
              >
              {symbol}
            </span>
            <span className="sr-only">
              {OPERATORS[symbol].id}
            </span>
          </button>
        ))
      }
      <button 
        id="equals" 
        className={`calculator-key${state[`equals`].active ? ` active` : ``}`}
        onClick={() => props.dispatch(actionEquals())}
        >
        <span 
          className="calculator-key-label"
          >
          =
        </span>
      </button>
    </div>
  );
};

export default CalculatorKeys;
