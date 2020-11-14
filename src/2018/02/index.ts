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

function functionB(lines: string[]): string {
  let bestMatch = -1;
  let matchText = '';
  const processedLines = [];
  lines.forEach((line) => {
    let charactersMatched = 0;

    for (const processedLine of processedLines) {
      const mismatchIndexes = [];
      for (let i = 0; i < line.length; i++) {
        if (line.charAt(i) === processedLine.charAt(i)) {
          //   console.log(`Index ${i} matches between ${line} and ${processedLine}`);
          charactersMatched += 1;
        } else {
          //   console.log(`Index ${i} DOES NOT match between ${line} and ${processedLine}`);
          mismatchIndexes.push(i);
        }
      }

      if (charactersMatched > bestMatch) {
        // console.log(`Best match is: ${line} and ${processedLine} with mismatch on ${mismatchIndexes}`);
        bestMatch = charactersMatched;
        matchText = `${line.slice(0, mismatchIndexes[0])}${line.slice(mismatchIndexes[0] + 1, line.length)}`;
        console.log(`Match on ${line} and ${processedLine} has mismatch on ${mismatchIndexes}`);
      }
    }

    processedLines.push(line);
  });

  return matchText;
}

/* Tests */

assert.strictEqual(functionA(['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab']), 12);

assert.strictEqual(functionB(['abcde', 'fghij', 'klmno', 'pqrst', 'fguij', 'axcye', 'wvxyz']), 'fgij');

/* Results */

console.time('Time');
const resultA = functionA(input);
const resultB = functionB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
