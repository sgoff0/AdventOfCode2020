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
    const [all, id, width, height, startX, startY] = matches;
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

  console.log('1');
  const claimMap = new Map();
  const altMap = {};

  let iteration = 0;
  parsedInput.forEach((claim) => {
    iteration += 1;
    // console.log(`ID: ${claim.id}`);
    if (iteration % 10 === 0) {
      // console.log()
      console.log(`ID: ${claim.id}`);
    }
    for (let x = claim.startX; x < claim.startX + claim.width; x++) {
      for (let y = claim.startY; y < claim.startY + claim.height; y++) {
        // const value = claimMap.get(`${x}_${y}`);
        const key = `${x}_${y}`;

        if (value != undefined) {
          claimMap.set(`${x}_${y}`, value + 1);
        } else {
          claimMap.set(`${x}_${y}`, 1);
        }

        // if (key in altMap) {
        // altMap[key] += 1;
        // } else {
        //   altMap[key] = 1;
        // }
      }
    }
  });

  console.log('2');
  const values = Array.from(claimMap.values());

  console.log('3');
  const overlap = values.reduce((prev, curr) => {
    return curr > 1 ? prev + 1 : prev;
  }, 0);

  console.log('4');
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
