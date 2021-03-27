import { useReducer } from 'react';
import { calcReducer } from '../shared/calcReducer';
import CalculatorKeys from './CalculatorKeys';
import '../styles/Calculator.scss';

export const Calculator = props => {
  const [state, dispatch] = useReducer(calcReducer, {
    terms: [],
    current: "0",
    last: "",
    opened: 0,
    closed: 0,
    ans: null
  });
  
  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="calculator-formula">
          {
            state.terms.length 
              ? `${state.terms.join("")}${state.current}` 
            : ``
          }
        </div>
        <div id="display" className="calculator-current">
          {state.current}
        </div>
      </div>
      <CalculatorKeys dispatch={dispatch} />
    </div>
  )
};

export default Calculator;
