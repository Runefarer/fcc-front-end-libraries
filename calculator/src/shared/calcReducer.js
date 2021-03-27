import { 
  isDecimalNumber,
  isNumber,
  isParen,
  isOperator,
  isUnaryOperator,
} from './helpers';
import { evaluate } from './evaluator';

const ACTION_CLEAR = "CLEAR";
const ACTION_DELETE = "DELETE";
const ACTION_NUMBER = "NUMBER";
const ACTION_DECIMAL = "DECIMAL";
const ACTION_PAREN = "PAREN";
const ACTION_ANS = "ANS";
const ACTION_OPERATOR = "OPERATOR";
const ACTION_EQUALS = "EQUALS";

export const actionClear = () => ({ type: ACTION_CLEAR });
export const actionDelete = () => ({ type: ACTION_DELETE });
export const actionNumber = number => ({ type: ACTION_NUMBER, number });
export const actionDecimal = () => ({ type: ACTION_DECIMAL });
export const actionParen = paren => ({ type: ACTION_PAREN, paren });
export const actionAns = () => ({ type: ACTION_ANS });
export const actionOperator = operator => ({ type: ACTION_OPERATOR, operator });
export const actionEquals = () => ({ type: ACTION_EQUALS });

const handleClear = state => {
  return {
    ...state,
    terms: [],
    current: "0",
    last: "",
    opened: 0,
    closed: 0
  };
};

const handleDelete = state => {
  if(state.last === "=") {
    return handleClear(state);
  }
  
  if(state.current === "0") {
    return state;
  }
  
  if(isParen(state.current)) {
    return {
      ...state,
      terms: [ ...state.terms.slice(0, state.terms.length - 1) ],
      current: state.terms.length ? state.terms[state.terms.length - 1] : "0",
      last: "<",
      opened: state.current === "(" ? state.opened - 1 : state.opened,
      closed: state.current === ")" ? state.closed - 1 : state.closed
    };
  }
  
  const next = state.current.substring(0, state.current.length - 1);
  if(next === "") {
    return {
      ...state,
      terms: [ ...state.terms.slice(0, state.terms.length - 1) ],
      current: state.terms.length ? state.terms[state.terms.length - 1] : "0",
      last: "<"
    };
  }
  
  return {
    ...state,
    current: next,
    last: "<"
  };
};

const handleNumber = (state, number) => {
  if(state.last === ")" || state.last === "a") {
    return state;
  }
  
  if(state.last === "=") {
    return {
      ...state,
      terms: [],
      current: `${number}`,
      last: `${number}`
    };
  }
  
  if(state.current !== "0") {
    if(isDecimalNumber(state.current)) {
      return {
        ...state,
        current: `${state.current}${number}`,
        last: `${number}`
      };
    } else {
      return {
        ...state,
        terms: [ ...state.terms, state.current ],
        current: `${number}`,
        last: `${number}`
      };
    }
  }
  
  return {
    ...state,
    current: `${number}`,
    last: `${number}`
  };
};

const handleDecimal = state => {
  if(state.last === ")" || state.last === "a") {
    return state;
  }
  
  if(state.last === "=") {
    return {
      ...state,
      terms: [ state.current ],
      current: `0.`,
      last: `.`
    };
  }
  
  if(state.current === "0" || state.current === "(" || isOperator(state.current)) {
    return {
      ...state,
      terms: state.current !== "0" 
      ? [ ...state.terms, state.current ] 
      : state.terms,
      current: `0.`,
      last: `.`
    };
  }
  
  if(isNumber(state.current)) {
    return {
      ...state,
      current: `${state.current}.`,
      last: `.`
    };
  }
  
  return state;
};

const handleParen = (state, paren) => {
  if(
    paren === "(" && 
    (
      state.last === ")" || 
      (state.last !== "=" && state.current !== "0" && isDecimalNumber(state.current))
    )
  ) {
    return state;
  }
  
  if(paren === ")" && (state.last === "=" || state.current === "0" || isOperator(state.current))) {
     return state;
  }
  
  if(state.last === "=") {
    return {
      ...state,
      terms: [],
      current: paren,
      last: paren,
      opened: paren === "(" ? 1 : 0,
      closed: paren === ")" ? 1 : 0
    };  
  }
  
  return {
    ...state,
    terms: state.current !== "0" ? [ ...state.terms, state.current ] : state.terms,
    current: paren,
    last: paren,
    opened: paren === "(" ? state.opened + 1 : state.opened,
    closed: paren === ")" ? state.closed + 1 : state.closed
  };
};

const handleAns = state => {
  if(
    state.ans === null || 
    state.last === ")" || 
    state.last === "a" ||
    isDecimalNumber(state.current)
  ) {
    return state;
  }
  
  if(state.last === "=") {
    return {
      ...state,
      terms: [],
      current: `${state.ans}`,
      last: `a`
    };
  }
  
  if(state.current === "0") {
    return {
      ...state,
      current: `${state.ans}`,
      last: `a`
    };
  }
  
  return {
    ...state,
    terms: [ ...state.terms, state.current ],
    current: `${state.ans}`,
    last: `a`
  };
};

const handleOperator = (state, operator) => {
  if(state.last === "=") {
    return {
      ...state,
      terms: [ state.current ],
      current: operator,
      last: operator
    };
  }
  
  if(state.current === "0") {
    if(isUnaryOperator(operator)) {
      return {
        ...state,
        current: operator,
        last: operator
      };
    }
  }
  
  if(state.last === "(") {
    if(isUnaryOperator(operator)) {
      return {
        ...state,
        terms: [ ...state.terms, state.current ],
        current: operator,
        last: operator
      };
    } else {
      return state;
    }
  }
  
  if(isDecimalNumber(state.current) || state.current === ")" || state.last === "a") {
    return {
      ...state,
      terms: [ ...state.terms, state.current ],
      current: operator,
      last: operator
    };
  }
  
  if(state.current !== operator) {
    if(isUnaryOperator(operator)) {
      return {
        ...state,
        terms: [ ...state.terms, state.current ],
        current: operator,
        last: operator
      };
    } else {
      let index = state.terms.length - 1;
      while(isOperator(state.terms[index])) {
        index--;
      }
      
      return {
        ...state,
        terms: [ ...state.terms.slice(0, index + 1) ],
        current: operator,
        last: operator
      };
    }
  }
  
  return state;
};

const handleEquals = state => {
  if(state.current === "0" || state.last === "=") {
    return state;
  }
  
  // This is ridiculous, but just a harmless joke
  if(state.terms.length === 0 && /^8000*8(13)?5+$/.test(state.current)) {
    return {
      ...state,
      terms: [ state.current, "=" ],
      current: "( . )( . )",
      last: "=",
      opened: 0,
      closed: 0
    };
  }
  
  const terms = !isOperator(state.current) ? [ ...state.terms, state.current ] : state.terms;
  
  if(state.opened > state.closed) {
    terms.push(...(new Array(state.opened - state.closed).fill(")")));
  } else if(state.closed > state.opened) {
    terms.unshift(...(new Array(state.closed - state.opened).fill("(")));
  }
  
  const result = evaluate(terms);
  
  return {
    ...state,
    terms: [ ...terms, "=" ],
    current: result,
    last: "=",
    opened: 0,
    closed: 0,
    ans: result
  };
};

export const calcReducer = (state, action) => {
  switch(action.type) {
    case ACTION_CLEAR:
      return handleClear(state);
    case ACTION_DELETE:
      return handleDelete(state);
    case ACTION_NUMBER:
      return handleNumber(state, action.number);
    case ACTION_DECIMAL:
      return handleDecimal(state);
    case ACTION_OPERATOR:
      return handleOperator(state, action.operator);
    case ACTION_PAREN:
      return handleParen(state, action.paren);
    case ACTION_EQUALS:
      return handleEquals(state);
    case ACTION_ANS:
      return handleAns(state);
    default:
      return state;
  }
};

export default calcReducer;
