import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split(',').map(Number);

/* Functions */

const demoInput = '0,3,6'.split(',').map(Number);

function part1(values: number[], target: number): number[] {
  const spoken = [...values];
  for (let i = values.length; i < target; i++) {
    const lastSpoken = spoken[i - 1];
    if (!spoken.slice(0, -1).includes(lastSpoken)) {
      spoken.push(0);
    } else {
      const lastIndex = spoken.slice(0, -1).lastIndexOf(lastSpoken);
      spoken.push(i - 1 - lastIndex);
    }
  }
  return spoken;
}

function part2(values: number[], target: number): number {
  const map = new Map<number, number>();

  values.forEach((v, i) => {
    map.set(v, i);
  });

  let lastSpoken = values.slice(-1)[0];

  let nextToSpeak;
  for (let i = values.length - 1; i < target - 1; i++) {
    if (!map.has(lastSpoken)) {
      nextToSpeak = 0;
    } else {
      nextToSpeak = i - map.get(lastSpoken);
    }

    map.set(lastSpoken, i);
    lastSpoken = nextToSpeak;
  }
  return nextToSpeak;
}

/* Tests */

const demoAnswer = part1(demoInput, 2020);
assert.strictEqual(demoAnswer[3], 0);
assert.strictEqual(demoAnswer[4], 3);
assert.strictEqual(demoAnswer[5], 3);

assert.strictEqual(part2(demoInput, 4), 0);
assert.strictEqual(part2(demoInput, 5), 3);
assert.strictEqual(part2(demoInput, 6), 3);
assert.strictEqual(part2(demoInput, 7), 1);
assert.strictEqual(part2(demoInput, 8), 0);
assert.strictEqual(part2(demoInput, 9), 4);
assert.strictEqual(part2(demoInput, 10), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input, 2020);
const resultPart2 = part2(input, 30000000);
const resultPart3 = part1(input, 30000000);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1.slice(-1)[0]);
console.log('Solution to part 2:', resultPart2);
console.log('Solution to part 3:', resultPart3.slice(-1)[0]);

assert.strictEqual(resultPart1.slice(-1)[0], 371);
assert.strictEqual(resultPart2, 352);
