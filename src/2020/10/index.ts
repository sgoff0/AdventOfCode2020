import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

/* Functions */

function part1(values: number[]): number {
  const sorted = values.sort((a, b) => a - b);

  const padded = [0, ...sorted, sorted.slice(-1)[0] + 3];

  const differential = {
    1: 0,
    2: 0,
    3: 0,
  };

  padded.forEach((value, idx) => {
    differential[padded[idx + 1] - value] += 1;
  });

  return differential[1] * differential[3];
}

let step = 0;
function findPermutations(
  joltValues: number[],
  finalValue: number,
  memo: Map<number, number> = new Map<number, number>(),
) {
  return (function recurse(index = 0): number {
    step += 1;
    const currentValue = joltValues[index];
    if (currentValue === finalValue) {
      return 1;
    }

    return joltValues
      .slice(index + 1, index + 4) // don't bother filtering (next step) on indexes we know will be too great
      .filter((val) => val - currentValue > 0 && val - currentValue <= 3) // only check values within valid range
      .reduce((prev, curr, i) => {
        const indexInJoltValues = index + i + 1; // we iterate over small lists of up to 3 elements, this gets index of it's position in the original sorted list
        // memoization is the secret sauce
        if (memo.has(indexInJoltValues)) {
          return prev + memo.get(indexInJoltValues);
        } else {
          const myResult = recurse(indexInJoltValues);
          memo.set(indexInJoltValues, myResult); // once we do all the recursive calculations to figure out the permutations at this index, be sure to look it up as a cache hit instead of recalculating, your CPU will love you
          return prev + myResult;
        }
      }, 0);
  })();
}

function part2(values: number[]): number {
  const sorted = values.sort((a, b) => a - b);
  const upper = Math.max(...sorted) + 3;
  return findPermutations([0, ...sorted, upper], upper);
}

assert.strictEqual(part1(input), 2664);
assert.strictEqual(part2(input), 148098383347712);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
console.log('Steps: ', step);
