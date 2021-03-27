import {
  UNARY_OP,
  BINARY_OP,
  OPERATORS,
  OPERATOR_REGEX,
} from './constants';

export const isNumber = number => {
  return /^\d+$/.test(number);
};

export const isDecimalNumber = number => {
  return /^\d+[.]?\d*$/.test(number);
};

export const isOperator = operator => {
  return OPERATOR_REGEX.test(operator);
};

export const isOperatorType = (operator, type) => {
  return (OPERATORS[operator].type & type) === type;
};

export const isUnaryOperator = operator => {
  return isOperatorType(operator, UNARY_OP);  
};

export const isBinaryOperator = operator => {
  return isOperatorType(operator, BINARY_OP);  
};

export const isParen = paren => (/^[()]$/.test(paren));
