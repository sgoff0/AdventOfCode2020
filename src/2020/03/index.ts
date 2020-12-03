import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

function movePos(lines: string[], x: number, y: number, incrementX: number, incrementY: number) {
  const currentPos = { x, y };
  const line = lines[currentPos.y].split('');
  let hits = 0;

  // Iterate x and y by 1 in case problem wants to see intersections at each point
  for (let i = currentPos.x + 1; i <= x + incrementX; i++) {
    if (i >= line.length) {
      currentPos.x = i % line.length;
    } else {
      currentPos.x += 1;
    }
  }

  for (let i = currentPos.y + 1; i <= y + incrementY; i++) {
    currentPos.y = i;
  }

  // I initially read this problem wrong and thought we needed to calculate hits at each step, hence I have a "hits" counter here
  if (currentPos.y < lines.length) {
    const isHit = lines[currentPos.y].split('')[currentPos.x] === '#' ? 1 : 0;
    hits += isHit;
  }

  return { ...currentPos, hits };
}

function part1(lines: string[]): number {
  return calculateSlope(lines, 3, 1).hits;
}

function calculateSlope(lines: string[], xIncrement: number, yIncrement: number) {
  let x = 0;
  let y = 0;
  let hits = 0;

  while (y < lines.length) {
    const result = movePos(lines, x, y, xIncrement, yIncrement);
    x = result.x;
    y = result.y;
    hits += result.hits;
    // console.log(`Moved to ${x},${y} with ${result.hits} new hits, total ${hits}`);
  }
  return { x, y, hits };
}

function part2(lines: string[]): number {
  return (
    calculateSlope(lines, 1, 1).hits *
    calculateSlope(lines, 3, 1).hits *
    calculateSlope(lines, 5, 1).hits *
    calculateSlope(lines, 7, 1).hits *
    calculateSlope(lines, 1, 2).hits
  );
  // It is not 9457768320
}

/* Tests */

// assert.strictEqual(calculateSlope(input, 1, 1), 2);
// assert.strictEqual(calculateSlope(input, 3, 1), 7);
// assert.strictEqual(calculateSlope(input, 5, 1), 3);
// assert.strictEqual(calculateSlope(input, 7, 1), 4);
// assert.strictEqual(calculateSlope(input, 1, 2), 2);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
