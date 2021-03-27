export const UNARY_OP = 1;
export const BINARY_OP = 2;

export const NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine"
];

export const OPERATORS = {
  "+": {
    id: "add",
    type: BINARY_OP,
    precidence: 1,
    binary: (a, b) => (a + b) 
  },
  
  "-": {
    id: "subtract",
    type: UNARY_OP | BINARY_OP,
    precidence: 1,
    unaryPrecidence: 16,
    unary: a => -a,
    binary: (a, b) => (a - b)
  },
  
  "*": {
    id: "multiply",
    type: BINARY_OP,
    precidence: 4,
    binary: (a, b) => (a * b)
  },
  
  "/": {
    id: "divide",
    type: BINARY_OP,
    precidence: 4,
    binary: (a, b) => (a / b)
  }
};

export const OPERATOR_REGEX = new RegExp(
  `^(${
    Object.keys(OPERATORS)
      .map(op => op.split(``).map(p => `[\\${p}]`).join(``))
      .join(`|`)
  })$`
);
