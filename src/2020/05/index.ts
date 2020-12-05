import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

function getRow(value: string): number {
  let min = 0;
  let max = 127;

  value.split('').forEach((i) => {
    if (i === 'F') {
      max = Math.floor((max - min) / 2 + min);
    } else if (i === 'B') {
      min = Math.ceil((max - min) / 2 + min);
    }
  });

  return min;
}

function getCol(value: string): number {
  let min = 0;
  let max = 7;

  value.split('').forEach((i) => {
    if (i === 'L') {
      max = Math.floor((max - min) / 2 + min);
    } else if (i === 'R') {
      min = Math.ceil((max - min) / 2 + min);
    }
  });

  return min;
}

function getSeatId(value: string): number {
  return getRow(value) * 8 + getCol(value);
}

function getAll(value: string) {
  const row = getRow(value);
  const col = getCol(value);
  const id = getSeatIdByRowAndCol(row, col);
  return {
    row,
    col,
    id,
  };
}

function getSeatIdByRowAndCol(row: number, col: number): number {
  return row * 8 + col;
}

function part1(values: string[]): number {
  let max = 0;

  values.forEach((i) => {
    const val = getSeatId(i);
    if (val > max) {
      max = val;
    }
  });

  return max;
}

function part2(value: string[]): number {
  // Sort all seats numerically
  const seats = value.map(getSeatId).sort((a, b) => a - b);

  // Ignoring front and back (and using it to clone the array so I'm not mutating my source array), work from right to left to find the first missing spot (where right - left > 1)
  const desired = seats.slice(1, seats.length - 1).reduceRight((p, c, idx, array) => {
    if (p - c > 1) {
      array.splice(0, seats.length); // ugly hack to early return by removing all elements from array we're on. Since I sliced it doens't modify seats but it's likely not clear to others.
      return p - 1;
    }
    return c;
  });
  return desired;
}

assert.strictEqual(getCol('RLR'), 5);
assert.strictEqual(getSeatId('FBFBBFFRLR'), 357);

assert.deepStrictEqual(getAll('BFFFBBFRRR'), { row: 70, col: 7, id: 567 });
assert.deepStrictEqual(getAll('FFFBBBFRRR'), { row: 14, col: 7, id: 119 });
assert.deepStrictEqual(getAll('BBFFBBFRLL'), { row: 102, col: 4, id: 820 });

assert.strictEqual(part1(input), 850); // my answer
assert.strictEqual(part2(input), 599); // my answer

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
