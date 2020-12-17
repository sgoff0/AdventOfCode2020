import readInput from '../../utils/readInput';
import assert from 'assert';
import { Cube, Vector3 } from '../../utils/cube';
import { Cube4 } from '../../utils/cube4';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */
enum Status {
  ACTIVE = '#',
  INACTIVE = '.',
}
const desiredRounds = 6;

function part1(values: string[]): number {
  const parsed = values.map((row) => row.split('').map((i) => i as Status));
  const matrixOffset = Math.max(parsed.length, parsed[0].length) + desiredRounds;

  const cube = new Cube(matrixOffset, parsed, Status.INACTIVE);
  for (let i = 0; i < desiredRounds; i++) {
    cube.cycle(Status.ACTIVE, Status.INACTIVE);
    console.log(`Done with cycle ${i}`);
  }

  return cube.getCountOfType(Status.ACTIVE);
}

function part2(values: string[]): number {
  const parsed = values.map((row) => row.split('').map((i) => i as Status));
  const matrixOffset = Math.max(parsed.length, parsed[0].length) + desiredRounds;

  const cube = new Cube4(matrixOffset, parsed, Status.INACTIVE);
  console.log('Starting first cycle');
  for (let i = 0; i < desiredRounds; i++) {
    cube.cycle(Status.ACTIVE, Status.INACTIVE);
    console.log(`Done with cycle ${i}`);
  }

  return cube.getCountOfType(Status.ACTIVE);
}

/* Tests */

// // Demo input tests
// const parsed = input.map((row) => row.split('').map((i) => i as Status));
// const dummyCube = new Cube(matrixOffset, parsed, Status.INACTIVE);

// assert.strictEqual(dummyCube.getNeighbors().length, 26);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(0, 0, 0), Status.ACTIVE), 1);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(1, 0, 0), Status.ACTIVE), 1);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(2, 0, 0), Status.ACTIVE), 2);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(0, 1, 0), Status.ACTIVE), 3);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(1, 1, 0), Status.ACTIVE), 5);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(2, 1, 0), Status.ACTIVE), 3);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(0, 2, 0), Status.ACTIVE), 1);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(1, 2, 0), Status.ACTIVE), 3);
// assert.strictEqual(dummyCube.getNeighborsOfType(new Vector3(2, 2, 0), Status.ACTIVE), 2);

// // // 0
// // console.log(dummyCube.toString());
// // // console.log('Cycle 0 \n' + dummyCube.toString(Status.ACTIVE));
// assert.strictEqual(dummyCube.getCountOfType(Status.ACTIVE), 5);

// dummyCube.cycle(Status.ACTIVE, Status.INACTIVE);
// assert.strictEqual(dummyCube.getCountOfType(Status.ACTIVE), 11);

// dummyCube.cycle(Status.ACTIVE, Status.INACTIVE);
// // // console.log('Cycle 2 \n' + dummyCube.toString(Status.ACTIVE));
// assert.strictEqual(dummyCube.getCountOfType(Status.ACTIVE), 21);

// dummyCube.cycle(Status.ACTIVE, Status.INACTIVE);
// assert.strictEqual(dummyCube.getCountOfType(Status.ACTIVE), 38);

// const dummyCube4 = new Cube4(matrixOffset, parsed, Status.INACTIVE);
// assert.strictEqual(dummyCube4.getCountOfType(Status.ACTIVE), 5);

// dummyCube4.cycle(Status.ACTIVE, Status.INACTIVE);
// console.log('Cycle 1 \n' + dummyCube4.toString(1));
// assert.strictEqual(dummyCube4.getCountOfType(Status.ACTIVE), 29);

/* Results */

console.time('Time');
const resultPart1 = part1(input); // not 124 (too low)
const resultPart2 = part2(input); // not 1152 (too low), not 4070 (too high)
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);

assert.strictEqual(part1(input), 372);
assert.strictEqual(part2(input), 1896);
