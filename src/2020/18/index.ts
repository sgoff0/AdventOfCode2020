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

function operate2(input: string): number {
  const parsed = parse(input);
  //   console.log(parsed);
  const result = flatten2(parsed);
  //   console.log('Result: ', result);

  const finalResult = parseInt(additionBeforeMult(result), 10);

  return finalResult;
}
// Do addition first, then mult
function additionBeforeMult(values: string[]): string {
  const firstAddition = values.findIndex((val) => val === '+');
  if (values.length === 1) {
    return values[0];
  } else if (firstAddition >= 0) {
    const i = firstAddition;
    const reduced = doMathNoParens(values.slice(i - 1, i + 2));
    return additionBeforeMult([...values.slice(0, i - 1), reduced, ...values.slice(i + 2)]);
  } else {
    return doMathNoParens(values);
  }
}

function flatten2(parsed: string[], i = 0, parenCount = 0) {
  if (i >= parsed.length) {
    return parsed;
  }
  const char = parsed[i];
  if (char === ')') {
    const openingParenIndex = parsed.slice(0, i).lastIndexOf('(');
    const result = additionBeforeMult(parsed.slice(openingParenIndex + 1, i));
    const parenProccessed: string[] = [...parsed.slice(0, openingParenIndex), result, ...parsed.slice(i + 1)];
    return flatten2(parenProccessed, openingParenIndex, parenCount - 1);
  } else {
    return flatten2(parsed, i + 1, parenCount);
  }
}

function part2(values: string[]): number {
  return values.reduce((prev, curr) => {
    return (prev += operate2(curr));
  }, 0);
}

/* Tests */
// Part 1
assert.strictEqual(operate('2 * 3 + (4 * 5)'), 26);
assert.strictEqual(operate('5 + (8 * 3 + 9 + 3 * 4 * 3)'), 437);
assert.strictEqual(operate('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'), 12240);
assert.strictEqual(operate('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'), 13632);

// Part 2
assert.strictEqual(operate2('1 + (2 * 3) + (4 * (5 + 6))'), 51);
assert.strictEqual(operate2('2 * 3 + (4 * 5)'), 46);
assert.strictEqual(part1(input), 7293529867931);
assert.strictEqual(part2(input), 60807587180737);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
