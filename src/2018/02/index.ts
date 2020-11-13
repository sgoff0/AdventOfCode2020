import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

function functionA(ids: string[]): number {
  let hasTwoCount = 0;
  let hasThreeCount = 0;
  ids.forEach((value, idx) => {
    // loop through counting characters of the id
    const map = {};
    for (const c of value) {
      if (c in map) {
        map[c] += 1;
      } else {
        map[c] = 1;
      }
    }

    // If any have 2, increment applicable counter once
    // If any have 3, increment applicable counter once
    let hasTwo = false;
    let hasThree = false;
    for (const property in map) {
      if (map[property] === 2) {
        hasTwo = true;
      } else if (map[property] === 3) {
        hasThree = true;
      }
    }

    if (hasTwo) {
      hasTwoCount += 1;
    }
    if (hasThree) {
      hasThreeCount += 1;
    }
  });

  return hasTwoCount * hasThreeCount;
}

function functionB(values: string[]): string {
  return 'a';
}

/* Tests */

assert.strictEqual(functionA(['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab']), 12);

assert.strictEqual(functionB(['abcde', 'fghij', 'klmno', 'pqrst', 'fguij', 'axcye', 'wvxyz']), 'fgij');

/* Results */

console.time('Time');
const resultA = functionA(input);
// const resultB = functionB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
// console.log('Solution to part 2:', resultB);
