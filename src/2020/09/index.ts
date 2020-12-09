import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n').map(Number);

/* Functions */
const hasTwoDistinctElementSummation = (expected: number, list: number[]) =>
  list.some((a, i) => list.slice(i + 1).some((b) => a + b == expected && a != b));

const findEncodingError = (preamble: number, xmas: number[]): number =>
  xmas.slice(preamble).find((value, i) => !hasTwoDistinctElementSummation(value, xmas.slice(i, i + preamble)));

function findContiguousSummation(expected: number, list: number[]) {
  for (let i = 0; i < list.length; i++) {
    let sum = list[i];
    for (let j = i + 1; j < list.length; j++) {
      sum += list[j];
      if (sum == expected) {
        return { start: i, end: j, list: list.slice(i, j + 1) };
      }
    }
  }
}

function part1(xmas: number[]) {
  return findEncodingError(25, xmas);
}

function part2(xmas: number[]): number {
  const requiredSummation = findEncodingError(25, xmas);
  const { list } = findContiguousSummation(requiredSummation, xmas);
  return Math.min(...list) + Math.max(...list);
}

/* Tests */
assert.strictEqual(hasTwoDistinctElementSummation(40, [35, 20, 15, 25, 47]), true);
assert.strictEqual(hasTwoDistinctElementSummation(40, [20, 20]), false);
assert.strictEqual(hasTwoDistinctElementSummation(40, [20, 20, 21, 19]), true);
assert.strictEqual(findEncodingError(3, [20, 20, 21, 41, 41, 99]), 99);
assert.strictEqual(findEncodingError(2, [20, 20, 21, 41, 41, 99]), 21);
assert.strictEqual(findEncodingError(6, [20, 20, 21, 41, 41, 99, 1]), 1);
assert.deepStrictEqual(findContiguousSummation(3, [1, 5, 1, 1, 1, 2, 3]), { start: 2, end: 4, list: [1, 1, 1] });

assert.strictEqual(part1(input), 22406676);
assert.strictEqual(part2(input), 2942387);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
