import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

// Thoughts
// Reducers
// Break apart innermost parens first
// Get recursive function that works on innermost paren, resolves left to right
// when no parens left, just do left to right and return
// push each operation on a stack,

// { val1: number, val2: number, operand: '*' }
// but parens could have bunch of stuff

const reOpen = /\(/g;
const reClose = /\)/g;

function parse(input: string): string[] {
  const split = input.replace(reOpen, '( ').replace(reClose, ' )').split(' ');
  return split;
}

function operate(input: string): number {
  const parsed = parse(input);
  //   console.log(parsed);
  const result = flatten(parsed);
  //   console.log('Result: ', result);

  const finalResult = parseInt(doMathNoParens(result), 10);

  return finalResult;
}

function doMathNoParens(values: string[]): string {
  let currentValue = parseInt(values[0], 10);
  let lastOperation = '';

  values.slice(1).forEach((value) => {
    if (value === '+' || value === '*') {
      lastOperation = value;
    } else {
      if (lastOperation === '+') {
        currentValue += parseInt(value, 10);
      } else if (lastOperation === '*') {
        currentValue *= parseInt(value, 10);
      }
    }
  });

  return currentValue + '';
}

function flatten(parsed: string[], i = 0, parenCount = 0) {
  if (i >= parsed.length) {
    return parsed;
  }
  const char = parsed[i];
  if (char === ')') {
    const openingParenIndex = parsed.slice(0, i).lastIndexOf('(');
    const result = doMathNoParens(parsed.slice(openingParenIndex + 1, i));
    const parenProccessed: string[] = [...parsed.slice(0, openingParenIndex), result, ...parsed.slice(i + 1)];
    return flatten(parenProccessed, openingParenIndex, parenCount - 1);
  } else {
    return flatten(parsed, i + 1, parenCount);
  }
}

function part1(values: string[]): number {
  return values.reduce((prev, curr) => {
    return (prev += operate(curr));
  }, 0);
}

function doMathNoParens2(values: string[]): string {
  let currentValue = parseInt(values[0], 10);
  let lastOperation = '';

  values.slice(1).forEach((value) => {
    if (value === '+' || value === '*') {
      lastOperation = value;
    } else {
      if (lastOperation === '+') {
        currentValue += parseInt(value, 10);
      } else if (lastOperation === '*') {
        currentValue *= parseInt(value, 10);
      }
    }
  });

  return currentValue + '';
}

function flatten2(parsed: string[], i = 0, parenCount = 0) {
  if (i >= parsed.length) {
    return parsed;
  }
  const char = parsed[i];
  if (char === ')') {
    const openingParenIndex = parsed.slice(0, i).lastIndexOf('(');
    const result = doMathNoParens(parsed.slice(openingParenIndex + 1, i));
    const parenProccessed: string[] = [...parsed.slice(0, openingParenIndex), result, ...parsed.slice(i + 1)];
    return flatten(parenProccessed, openingParenIndex, parenCount - 1);
  } else {
    return flatten(parsed, i + 1, parenCount);
  }
}

function operate2(input: string): number {
  const parsed = parse(input);
  //   console.log(parsed);
  const result = flatten(parsed);
  //   console.log('Result: ', result);

  const finalResult = parseInt(doMathNoParens(result), 10);

  return finalResult;
}
function part2(values: number[]): number {
  return 0;
}

/* Tests */

assert.strictEqual(operate('2 * 3 + (4 * 5)'), 26);
assert.strictEqual(operate('5 + (8 * 3 + 9 + 3 * 4 * 3)'), 437);
assert.strictEqual(operate('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'), 12240);
assert.strictEqual(operate('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'), 13632);
assert.strictEqual(part1(input), 7293529867931);

assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
