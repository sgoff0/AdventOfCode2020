import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */
function parse(input: string): string[] {
  return input.replace(/\(/g, '( ').replace(/\)/g, ' )').split(' ');
}

/**
 * Perform math left to right
 * Used for part1 and reused for part2
 * @param values string array of values & operations, parens already filtered out
 */
function doMathNoParens(values: string[]): number {
  return values
    .filter((v, i) => i % 2 == 0)
    .slice(1)
    .reduce((prev, curr, i) => {
      const operatorIndex = (i + 1) * 2 - 1;
      return values[operatorIndex] === '+' ? prev + +curr : prev * +curr;
    }, +values[0]);
}

/**
 * Instead of doing all math left to right, first process ALL addition, then do another pass through to do multiplication
 * New in part2
 * @param values
 */
function additionBeforeMult(values: string[]): number {
  if (values.length === 1) {
    return +values[0];
  }
  const i = values.findIndex((val) => val === '+');
  if (i >= 0) {
    const reduced = doMathNoParens(values.slice(i - 1, i + 2));
    return additionBeforeMult([...values.slice(0, i - 1), reduced.toString(), ...values.slice(i + 2)]);
  } else {
    return doMathNoParens(values);
  }
}

type ProcessMath = (a: string[]) => number;

/**
 * Removes parens from an array of strings translating chunks of parens to values
 * It does so by back tracking every time it sees a closing paren ) and processing that chunk
 * @param values
 * @param i
 */
function flatten(values: string[], doMath: ProcessMath, i = 0): string[] {
  if (i >= values.length) {
    return values;
  }
  const char = values[i];
  if (char === ')') {
    const openingParenIndex = values.slice(0, i).lastIndexOf('(');
    const result = doMath(values.slice(openingParenIndex + 1, i));
    const parenChunkRemoved = [...values.slice(0, openingParenIndex), result.toString(), ...values.slice(i + 1)];
    return flatten(parenChunkRemoved, doMath, openingParenIndex);
  } else {
    return flatten(values, doMath, i + 1);
  }
}

function part1(values: string[]): number {
  return values.reduce((prev, curr) => prev + equationToAnswerPart1(curr), 0);
}

function equationToAnswerPart1(input: string): number {
  return doMathNoParens(flatten(parse(input), doMathNoParens));
}

function part2(values: string[]): number {
  return values.reduce((prev, curr) => prev + equationToAnswerPart2(curr), 0);
}

function equationToAnswerPart2(input: string): number {
  return additionBeforeMult(flatten(parse(input), additionBeforeMult));
}

/* Tests */
// Part 1
assert.strictEqual(equationToAnswerPart1('2 * 3 + (4 * 5)'), 26);
assert.strictEqual(equationToAnswerPart1('5 + (8 * 3 + 9 + 3 * 4 * 3)'), 437);
assert.strictEqual(equationToAnswerPart1('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'), 12240);
assert.strictEqual(equationToAnswerPart1('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'), 13632);

// Part 2
assert.strictEqual(equationToAnswerPart2('1 + (2 * 3) + (4 * (5 + 6))'), 51);
assert.strictEqual(equationToAnswerPart2('2 * 3 + (4 * 5)'), 46);
assert.strictEqual(part1(input), 7293529867931);
assert.strictEqual(part2(input), 60807587180737);

/* Results */
console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);

// Alternative part 1 math functions
// function doMathNoParensAlt1(values: string[]): string {
//   let currentValue = parseInt(values[0], 10);
//   for (let i = 2; i < values.length; i += 2) {
//     currentValue = values[i - 1] === '+' ? currentValue + +values[i] : currentValue * +values[i];
//   }
//   return currentValue + '';
// }

// function doMathNoParensAlt2(values: string[]): string {
//   let currentValue = parseInt(values[0], 10);
//   let lastOperation = '';

//   values.slice(1).forEach((value, i) => {
//     if (value === '+' || value === '*') {
//       lastOperation = value;
//     } else {
//       if (lastOperation === '+') {
//         currentValue += parseInt(value, 10);
//       } else if (lastOperation === '*') {
//         currentValue *= parseInt(value, 10);
//       }
//     }
//   });

//   return currentValue + '';
// }
