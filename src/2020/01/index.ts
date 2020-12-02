import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

/* Functions */

function twoNumbersThatSumTo2020(values: number[]): number {
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] + values[j] === 2020) {
        return values[i] * values[j];
      }
    }
  }
}
function threeNumbersThatSumTo2020(values: number[]): number {
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      for (let k = i + 2; k < values.length; k++) {
        if (values[i] + values[j] + values[k] === 2020) {
          return values[i] * values[j] * values[k];
        }
      }
    }
  }
}

function functionA(values: number[]): number {
  return twoNumbersThatSumTo2020(values);
}

function functionB(values: number[]): number {
  return threeNumbersThatSumTo2020(values);
}

/* Tests */

// assert.strictEqual(functionA([1, 1, 1]), 0);

// assert.strictEqual(functionB([1, -1]), 0);

/* Results */

console.time('Time');
const resultA = functionA(input);
const resultB = functionB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
