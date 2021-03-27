import { OPERATORS } from './constants';
import {
  isOperator,
  isUnaryOperator,
  isParen,
} from './helpers';

const popOp = (numStack, opStack) => {
  const top = opStack[opStack.length - 1];
  
  if(top.unary) {
    const a = numStack[numStack.length - 1];
    return [
      [ ...numStack.slice(0, numStack.length - 1), top.op(a) ],
      [ ...opStack.slice(0, opStack.length - 1) ]
    ];
  }

  const a = numStack[numStack.length - 2];
  const b = numStack[numStack.length - 1];
  
  return [
    [ ...numStack.slice(0, numStack.length - 2), top.op(a, b) ], 
    [ ...opStack.slice(0, opStack.length - 1) ]
  ];
};

const pushOp = (op, last, numStack, opStack) => {
  if(isUnaryOperator(op) && (last === undefined || isOperator(last) || last === "(")) {
    return [
      numStack,
      [ 
        ...opStack,
        {
          unary: true,
          op: OPERATORS[op].unary,
          precidence: OPERATORS[op].unaryPrecidence
        }
      ]
    ];
  }
  
  let top = opStack[opStack.length - 1];
  while(top !== undefined && !top.paren && top.precidence >= OPERATORS[op].precidence) {
    [numStack, opStack] = popOp(numStack, opStack);
    top = opStack[opStack.length - 1];
  }

  return [
    numStack,
    [ 
      ...opStack,
      { 
        binary: true,
        op: OPERATORS[op].binary,
        precidence: OPERATORS[op].precidence
      }
    ]
  ];
};

const pushParen = (paren, numStack, opStack) => {
  if(paren === "(") {
    return [
      numStack, [ ...opStack, { paren: true, openParen: true } ]
    ];
  }
  
  let top = opStack[opStack.length - 1];
  while(top !== undefined && !top.paren) {
    [numStack, opStack] = popOp(numStack, opStack);
    top = opStack[opStack.length - 1];
  }
  
  return [
    numStack,
    top !== undefined && top.paren 
      ? [ ...opStack.slice(0, opStack.length - 1) ]
      : opStack
  ];
};

const pushNum = (num, numStack, opStack) => {
  return [
    [ ...numStack, parseFloat(num) ],
    opStack
  ];
};

export const evaluate = terms => {
  let numStack = [];
  let opStack = [];
  
  for(let i = 0; i < terms.length; i++) {
    const term = terms[i];
    
    if(isOperator(term)) {
      [numStack, opStack] = pushOp(term, terms[i - 1], numStack, opStack);
    } else if(isParen(term)) {
      [numStack, opStack] = pushParen(term, numStack, opStack);
    } else {
      [numStack, opStack] = pushNum(term, numStack, opStack);
    }
  }
  
  while(opStack.length) {
    [numStack, opStack] = popOp(numStack, opStack);
  }
  
  return numStack.pop();
};

export default evaluate;