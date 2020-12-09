import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

/* Functions */

const hasTwoDistinctElementSummation = (expected: number, list: number[]) =>
  list.some((a) => list.some((b) => a + b == expected && a != b));

const findEncodingError = (preamble: number, list: number[]): number =>
  list.slice(preamble).find((value, i) => !hasTwoDistinctElementSummation(value, list.slice(i, i + preamble)));

function part1(values: number[]) {
  return findEncodingError(25, values);
}

function findContiguousSummation(expected: number, list: number[]) {
  // Option 1: ~8.9ms
  //   let retVal;
  //   list.forEach((value, i) => {
  //     let sum = value;
  //     return list.slice(i + 1).some((value2, j) => {
  //       sum += value2;
  //       if (sum == expected) {
  //         retVal = { i, j: j + i };
  //         return true;
  //       }
  //     });
  //   });
  //   return retVal;

  // Option 2: 31.6ms
  //   for (const [i, value] of list.entries()) {
  //     let sum = value;
  //     for (const [j, value2] of list.slice(i + 1).entries()) {
  //       sum += value2;
  //       if (sum == expected) {
  //         return { i, j: j + i };
  //       }
  //     }
  //   }

  // Option 3: 6.4-7.5ms
  for (let i = 0; i < list.length; i++) {
    let sum = list[i];
    for (let j = i + 1; j < list.length; j++) {
      sum += list[j];
      if (sum == expected) {
        return { i, j };
      }
    }
  }
}
function part2(values: number[]): number {
  const requiredSummation = findEncodingError(25, values);
  const retVal = findContiguousSummation(requiredSummation, values);
  const sumVals = values.slice(retVal.i, retVal.j + 1);
  const min = Math.min(...sumVals);
  const max = Math.max(...sumVals);
  return min + max;
}

/* Tests */

assert.strictEqual(hasTwoDistinctElementSummation(40, [35, 20, 15, 25, 47]), true);
assert.strictEqual(hasTwoDistinctElementSummation(40, [20, 20]), false);
assert.strictEqual(hasTwoDistinctElementSummation(40, [20, 20, 21, 19]), true);
// assert.strictEqual(part1(input).index, 508);
assert.strictEqual(part1(input), 22406676);
assert.strictEqual(part2(input), 2942387);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
