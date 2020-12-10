import readInput from '../../utils/readInput';
import * as _ from 'lodash';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

/* Functions */

function part1(values: number[]): number {
  const sorted = values.sort((a, b) => a - b);
  sorted.unshift(0);
  sorted.push(sorted.slice(-1)[0] + 3);

  const differential = {
    1: 0,
    2: 0,
    3: 0,
  };

  sorted.forEach((value, idx) => {
    differential[sorted[idx + 1] - value] += 1;
  });

  return differential[1] * differential[3];
}

// currently we're manipulationg aray
function calculatePermuations(list: number[]) {
  const values = _.cloneDeep(list);
  //   console.log('Calculate on ' + values);

  const sorted = values.sort((a, b) => a - b);
  const validPermutaitons = 0;
  const max = Math.max(...sorted) + 3;
  return recurse2(sorted, max, 0, 0);
  // Step 1, at index 0, loop through ALL array items finding all eligible indexes for step 0 (0 - 3)
  // Step 2, at index 1, loop through ALL REMAINING array items finding all eligible indexes for step 1, > index 0 val && <= index 0 + 3
  // Repeat
  // Build out valid chains, counting each one that makes it to end

  //   console.log(recurse(sorted, max, 0));
  //   for (let i = 0; i < sorted.length; i++) {
  //     if (i === 0 && i > 3) {
  //       return false;
  //     } else if (i === sorted.length - 1 && max - i > 3) {
  //       return false;
  //     } else if (i >= 1) {
  //       const difference = sorted[i] - sorted[i - 1];

  //       // continue
  //       return difference <= 3 && difference > 0;
  //     } else if (i === 0) {
  //       // continue
  //     } else {
  //       return true;
  //     }
  //   }
}
function recurse2(
  remainingIndexes: number[],
  max: number,
  previousValue: number,
  depth: number,
  attempted: number[] = [],
) {
  let isValid = 0;

  // stop this chain, none will work if sorted
  if (remainingIndexes[0] - previousValue > 3) {
    return isValid;
  }

  // If completed, confirm w/in 3 of max
  if (remainingIndexes.length === 0) {
    if (max - previousValue > 0 && max - previousValue <= 3) {
      //   console.log(`!!! Got a winner ${attempted}`);
    }
    isValid += max - previousValue > 0 && max - previousValue <= 3 ? 1 : 0;
    return isValid;
  }

  // Otherwise find all paths where next step is w/in 3 of previous
  const elibileIndexes = remainingIndexes.filter((val) => val - previousValue > 0 && val - previousValue <= 3);

  // Try starting w/ any of these values
  elibileIndexes.forEach((value, i) => {
    // Try with all
    const othersRemaining = remainingIndexes.slice(i + 1);
    // console.log(`Trying for ${value} and list ${othersRemaining}`);
    isValid += recurse2(othersRemaining, max, value, depth + 1, [...attempted, value]);

    // TODO try w/ dropping some
  });
  return isValid;
}

// Grr stuck
function recurse(sorted: number[], max: number, depth: number) {
  for (let i = depth; i < sorted.length; i++) {
    if (i === 0 && i > 3) {
      //   console.log('Fail a');
      return false;
    } else if (i === sorted.length - 1 && max - i > 3) {
      //   console.log('Fail b');
      return false;
    } else if (i >= 1) {
      const difference = sorted[i] - sorted[i - 1];
      if (difference <= 3 && difference > 0) {
        recurse(sorted, max, depth + 1);
      } else {
        // console.log('Fail c');
        return false;
      }
    } else if (i === 0) {
      // continue
      recurse(sorted, max, depth + 1);
    } else {
      console.log('T');
      return true;
    }
  }
}

function part2(list: number[]): number {
  const values = _.cloneDeep(list);
  return calculatePermuations(values);
  //   return 0;
}

/* Tests */

// assert.strictEqual(part1([1, 1, 1]), 0);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
// const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

// console.log('Solution to part 1:', resultPart1); // 2664
console.log('Solution to part 2:', resultPart2);
