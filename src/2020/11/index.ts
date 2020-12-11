import readInput from '../../utils/readInput';
import assert from 'assert';
import * as _ from 'lodash';
import '../../utils/extensions/map';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

enum Status {
  EMPTY = 'L',
  FLOOR = '.',
  OCCUPIED = '#',
}
const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function parse(values: string[]) {
  return values.map((row) => row.split('').map((i) => i as Status));
}

function isOccupiedRange1(layout: Status[][], x: number, y: number): number {
  if (x < 0 || y < 0 || x >= layout[0].length || y >= layout.length) {
    return 0;
  }
  return layout[y][x] === Status.OCCUPIED ? 1 : 0;
}

function isOccupiedRangeInfinite(
  layout: Status[][],
  startingX: number,
  startingY: number,
  directionX: number,
  directionY: number,
  depth = 1,
): number {
  const x = startingX + directionX * depth;
  const y = startingY + directionY * depth;
  if (x < 0 || y < 0 || x >= layout[0].length || y >= layout.length) {
    return 0;
  }
  const currentValue = layout[y][x];
  if (currentValue === Status.FLOOR) {
    return isOccupiedRangeInfinite(layout, startingX, startingY, directionX, directionY, depth + 1);
  }
  return layout[y][x] === Status.OCCUPIED ? 1 : 0;
}

const adjacentCountRange1 = (layout: Status[][], x: number, y: number) => {
  return directions.reduce((acc, [yMod, xMod]) => acc + isOccupiedRange1(layout, x + xMod, y + yMod), 0);
};
const longRangeAdjacentCount = (layout: Status[][], x: number, y: number) => {
  return directions.reduce((acc, [dirX, dirY]) => acc + isOccupiedRangeInfinite(layout, x, y, dirX, dirY), 0);
};

const getFunctionRange1 = (layout: Status[][], x: number, y: number) => {
  return getSeatStatus(adjacentCountRange1, layout, x, y);
};

function getSeatStatus(
  getNeighbors: (layout: Status[][], x: number, y: number) => number,
  layout: Status[][],
  x: number,
  y: number,
) {
  const currentSeat = layout[y][x];
  const neighbors = adjacentCountRange1(layout, x, y);
  if (currentSeat === Status.EMPTY && neighbors === 0) {
    return Status.OCCUPIED;
  } else if (currentSeat === Status.OCCUPIED && neighbors >= 4) {
    return Status.EMPTY;
  } else {
    return currentSeat;
  }
}

function getSeatStatusRange1(layout: Status[][], x: number, y: number) {
  const currentSeat = layout[y][x];
  const neighbors = adjacentCountRange1(layout, x, y);
  if (currentSeat === Status.EMPTY && neighbors === 0) {
    return Status.OCCUPIED;
  } else if (currentSeat === Status.OCCUPIED && neighbors >= 4) {
    return Status.EMPTY;
  } else {
    return currentSeat;
  }
}

function getSeatStatusRangeInfinite(layout: Status[][], x: number, y: number): Status {
  const currentSeat = layout[y][x];
  const neighbors = longRangeAdjacentCount(layout, x, y);
  if (currentSeat === Status.EMPTY && neighbors === 0) {
    return Status.OCCUPIED;
  } else if (currentSeat === Status.OCCUPIED && neighbors >= 5) {
    return Status.EMPTY;
  } else {
    return currentSeat;
  }
}

function changeSeats(
  oldLayout: Status[][],
  seatCheckFunction: (map: Status[][], x: number, y: number) => Status,
): Status[][] {
  let isChanged = false;
  const newList = oldLayout.map((rowValue, y) => {
    return rowValue.map((colValue, x) => {
      const newStatus = seatCheckFunction(oldLayout, x, y);
      if (newStatus !== colValue) {
        isChanged = true;
      }
      return newStatus;
    });
  });

  if (!isChanged) {
    return oldLayout;
  }
  return changeSeats(newList, seatCheckFunction);
}

function part1(values: string[]): number {
  return changeSeats(parse(values), getSeatStatusRange1).reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

function part2(values: string[]): number {
  return changeSeats(parse(values), getSeatStatusRangeInfinite).reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

const test1 = [
  [Status.FLOOR, Status.EMPTY, Status.FLOOR, Status.OCCUPIED],
  [Status.FLOOR, Status.FLOOR, Status.FLOOR, Status.EMPTY],
  [Status.FLOOR, Status.FLOOR, Status.EMPTY, Status.OCCUPIED],
  [Status.FLOOR, Status.OCCUPIED, Status.EMPTY, Status.EMPTY],
];

assert.strictEqual(longRangeAdjacentCount(test1, 1, 0), 3);
assert.strictEqual(part1(input), 2346);
assert.strictEqual(part2(input), 2111);

console.time('Time');
const resultPart1 = part1(input); // NOT 2723, 2693, 2954, 3809
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
