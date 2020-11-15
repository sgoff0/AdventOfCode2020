import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

interface Claim {
  id: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
}

function parseInput(lines: string[]): Claim[] {
  const retVal: Claim[] = [];
  lines.forEach((line) => {
    const re = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
    const matches = re.exec(line);
    if (matches == null) {
      return;
    }
    const [all, id, startX, startY, width, height] = matches;
    // console.log('Matches: ' + claim);
    retVal.push({
      id: Number(id),
      width: Number(width),
      height: Number(height),
      startX: Number(startX),
      startY: Number(startY),
    });
  });
  return retVal;
}

function functionA(lines: string[]): number {
  const parsedInput = parseInput(lines);

  const claimMap = new Map();

  parsedInput.forEach((claim) => {
    for (let x = 0; x < claim.width; x++) {
      for (let y = 0; y < claim.height; y++) {
        const key = `${x + claim.startX}_${y + claim.startY}`;
        const value = claimMap.get(key);
        if (value != undefined) {
          claimMap.set(key, value + 1);
        } else {
          claimMap.set(key, 1);
        }
      }
    }
  });

  const values = Array.from(claimMap.values());
  // console.log('Values: ', values);

  const overlap = values.reduce((prev, curr) => {
    return curr > 1 ? prev + 1 : prev;
  }, 0);

  return overlap;
}

function functionB(values: number[]): number {
  return 0;
}

/* Tests */

// assert.strictEqual(functionA([1, 1, 1]), 0);

// assert.strictEqual(functionB([1, -1]), 0);

/* Results */

console.time('Time');
const resultA = functionA(input);
// const resultB = functionB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
// console.log('Solution to part 2:', resultB);
