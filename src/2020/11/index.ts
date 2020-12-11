import readInput from '../../utils/readInput';
import assert from 'assert';
import * as _ from 'lodash';
import '../../utils/extensions/map';

const rawInput = readInput();
const input = rawInput.split('\n');

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

class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function parse(values: string[]) {
  return values.map((row) => row.split('').map((i) => i as Status));
}

/**
 * Returns 1 if seat in
 * @param layout
 * @param x
 * @param y
 */
function isSeatOccupiedRange1(layout: Status[][], x: number, y: number): number {
  if (x < 0 || y < 0 || x >= layout[0].length || y >= layout.length) {
    return 0;
  }
  return layout[y][x] === Status.OCCUPIED ? 1 : 0;
}

function isSeatOccupiedRangeInfinite(
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
    return isSeatOccupiedRangeInfinite(layout, startingX, startingY, directionX, directionY, depth + 1);
  }
  return layout[y][x] === Status.OCCUPIED ? 1 : 0;
}

const occupiedNeighborCountRange1 = (layout: Status[][], x: number, y: number) => {
  return directions.reduce((acc, [yMod, xMod]) => acc + isSeatOccupiedRange1(layout, x + xMod, y + yMod), 0);
};

const occupiedNeighborCountRangeInfinite = (layout: Status[][], x: number, y: number) => {
  return directions.reduce((acc, [dirX, dirY]) => acc + isSeatOccupiedRangeInfinite(layout, x, y, dirX, dirY), 0);
};

const nextTickSeatStatusRange1 = (layout: Status[][], x: number, y: number) => {
  return getSeatStatus(occupiedNeighborCountRange1, layout, x, y, 4);
};
const nextTickSeatStatusRangeInfinite = (layout: Status[][], x: number, y: number) => {
  return getSeatStatus(occupiedNeighborCountRangeInfinite, layout, x, y, 5);
};

function getSeatStatus(
  getNeighbors: (layout: Status[][], x: number, y: number) => number,
  layout: Status[][],
  x: number,
  y: number,
  min: number,
) {
  const currentSeat = layout[y][x];
  const neighbors = getNeighbors(layout, x, y);
  if (currentSeat === Status.EMPTY && neighbors === 0) {
    return Status.OCCUPIED;
  } else if (currentSeat === Status.OCCUPIED && neighbors >= min) {
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
  return changeSeats(parse(values), nextTickSeatStatusRange1).reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

function part2(values: string[]): number {
  return changeSeats(parse(values), nextTickSeatStatusRangeInfinite).reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

const test1 = [
  [Status.FLOOR, Status.EMPTY, Status.FLOOR, Status.OCCUPIED],
  [Status.FLOOR, Status.FLOOR, Status.FLOOR, Status.EMPTY],
  [Status.FLOOR, Status.FLOOR, Status.EMPTY, Status.OCCUPIED],
  [Status.FLOOR, Status.OCCUPIED, Status.EMPTY, Status.EMPTY],
];

assert.strictEqual(occupiedNeighborCountRangeInfinite(test1, 1, 0), 3);
assert.strictEqual(part1(input), 2346);
assert.strictEqual(part2(input), 2111);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
