import readInput from '../../utils/readInput';
import * as _ from 'lodash';
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

// currently we're manipulationg aray
function calculatePermuations(values: number[]) {
  const sorted = values.sort((a, b) => a - b);
  const upper = Math.max(...sorted) + 3;
  return findPermutations(sorted, upper, 0, 0);
}

let steps = 0;

function findPermutations(remainingIndexes: number[], max: number, previousValue: number, depth: number) {
  steps += 1;
  if (steps % 100000000 === 0) {
    console.log('Step: ' + steps);
  }
  let isValid = 0;
  // If completed, confirm w/in 3 of max
  if (remainingIndexes.length === 0) {
    return max - previousValue > 0 && max - previousValue <= 3 ? 1 : 0;
  }

  // stop all future checks if my sorted value is a failure
  if (remainingIndexes[0] - previousValue > 3) {
    return isValid;
  }

  // grab next x eligible values in range, stop once we're out of range (since we're sorted and all others will fail)
  const eligibleIndexes = [];
  remainingIndexes.every((val) => {
    if (val - previousValue > 0 && val - previousValue <= 3) {
      eligibleIndexes.push(val);
      return true;
    }
    return false;
  });

  // Run all the permutations, end each permuation chain the moment one fails due to assumptions we can make being sorted
  eligibleIndexes.every((value, i) => {
    // console.log(depth + i);
    const amountFound = findPermutations(remainingIndexes.slice(i + 1), max, value, depth + 1);
    isValid += amountFound;
    return amountFound > 0;
  });
  return isValid;
}

function part2(list: number[]): number {
  // Too slow
  //   const values = _.cloneDeep(list);
  //   return calculatePermuations(values);

  // Alt, just look at differences between items in the list

  // Use tribonachi to precompute consequitive values that are 1 apart,
  // Also, every time you remove an element you're dealing with 2 runs (original + new)
  // g[n] == g[n-1]+g[n-2]+g[n-3]
  // For example,

  const retVal = 0;
  //   console.log(reduce1);
  return retVal;
}

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
