import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

function calculateFrequency(frequencies: number[]): number {
  return frequencies.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}

function tuneFrequency(frequencies: number[]): number {
  let lastValue = 0;
  const valuesSeen = { 0: 0 };
  let firstFrequency;
  while (firstFrequency === undefined) {
    lastValue = frequencies.reduce((prev, curr) => {
      const value = prev + curr;
      if (value in valuesSeen && firstFrequency === undefined) {
        firstFrequency = value;
      } else {
        valuesSeen[value] = 0;
      }
      return value;
    }, lastValue);
  }
  return firstFrequency;
}

/* Tests */

assert.strictEqual(calculateFrequency([1, 1, 1]), 3);
assert.strictEqual(calculateFrequency([1, 1, -2]), 0);
assert.strictEqual(calculateFrequency([-1, -2, -3]), -6);

assert.strictEqual(tuneFrequency([1, -1]), 0);
assert.strictEqual(tuneFrequency([3, 3, 4, -2, -4]), 10);
assert.strictEqual(tuneFrequency([7, 7, -2, -7, -4]), 14);

// /* Results */

console.time('Time');
const resultA = calculateFrequency(input);
const resultB = tuneFrequency(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA); // -> 529
console.log('Solution to part 2:', resultB); // -> 5269882
