import readInput from '../../utils/readInput';
import assert from 'assert';
import { Cube } from '../../utils/cube';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */
enum Status {
  ACTIVE = '#',
  INACTIVE = '.',
}

function part1(values: string[]): number {
  const parsed = values.map((row) => row.split('').map((i) => i as Status));

  const cube = new Cube(6, parsed, Status.INACTIVE);
  return 0;
}

function part2(values: string[]): number {
  return 0;
}

/* Tests */

// assert.strictEqual(part1([1, 1, 1]), 0);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

// console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
