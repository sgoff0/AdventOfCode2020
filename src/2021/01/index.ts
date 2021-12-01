import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

/* Functions */

function getIncrements(values: number[]) {
  //   return values
  //     .map((v, idx, arr) => {
  //       if (idx > 0) {
  //         return arr[idx] > arr[idx - 1] ? 1 : 0;
  //       } else {
  //         return 0;
  //       }
  //     })
  //     .reduce((sum, curr) => sum + curr, 0);
  return values.reduce(
    (retVal, curr) => {
      const { prevValue, counter } = retVal;

      if (!prevValue) {
        return {
          ...retVal,
          prevValue: curr,
        };
      } else {
        // const doesIncrement = curr - prevValue > incrementDepth;
        const doesIncrement = curr - prevValue > 0;
        return {
          prevValue: curr,
          counter: doesIncrement ? counter + 1 : counter,
        };
      }
    },
    { prevValue: null, counter: 0 },
  ).counter;
}

function part1(values: number[]): number {
  return getIncrements(values);
}

function part2(values: number[]): number {
  const theeMeasurements = values.map((v, idx, arr) => (idx > 1 ? v + arr[idx - 1] + arr[idx - 2] : 0));
  return getIncrements(theeMeasurements);
}

/* Tests */

assert.strictEqual(part1([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]), 7);

assert.strictEqual(part2([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]), 5);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
