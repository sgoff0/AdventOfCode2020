import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

enum Status {
  EMPTY = 'L',
  FLOOR = '.',
  OCCUPIED = '#',
}

class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector2) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }
  multiply(val: number) {
    return new Vector2(this.x * val, this.y * val);
  }

  inBounds(maxX: number, maxY: number) {
    return this.x >= 0 && this.y >= 0 && this.x < maxX && this.y < maxY;
  }
}

const directions = [
  new Vector2(1, 0),
  new Vector2(-1, 0),
  new Vector2(0, 1),
  new Vector2(0, -1),
  new Vector2(1, 1),
  new Vector2(1, -1),
  new Vector2(-1, 1),
  new Vector2(-1, -1),
];

function parse(values: string[]) {
  return values.map((row) => row.split('').map((i) => i as Status));
}

function isSeatOccupiedInRange(
  layout: Status[][],
  position: Vector2,
  direction: Vector2,
  range: number,
  depth = 1,
): number {
  if (depth > range) {
    return 0;
  }
  const seat = position.add(direction.multiply(depth));
  if (!seat.inBounds(layout[0].length, layout.length)) {
    return 0;
  }

  const currentValue = layout[seat.y][seat.x];
  if (currentValue === Status.FLOOR) {
    return isSeatOccupiedInRange(layout, position, direction, range, depth + 1);
  }
  return layout[seat.y][seat.x] === Status.OCCUPIED ? 1 : 0;
}

const getOccupiedNeighborCountInRange = (range: number) => (layout: Status[][], p: Vector2) => {
  return directions.reduce((acc, direction) => acc + isSeatOccupiedInRange(layout, p, direction, range), 0);
};

const nextTickSeatStatusRange1 = (layout: Status[][], p: Vector2) => {
  return getSeatStatus(getOccupiedNeighborCountInRange(1), layout, p, 4);
};
const nextTickSeatStatusRangeInfinite = (layout: Status[][], p: Vector2) => {
  const maxLength = Math.max(layout.length, layout[0].length);
  return getSeatStatus(getOccupiedNeighborCountInRange(maxLength), layout, p, 5);
};

function getSeatStatus(
  getNeighbors: (layout: Status[][], p: Vector2) => number,
  layout: Status[][],
  p: Vector2,
  min: number,
) {
  const currentSeat = layout[p.y][p.x];
  const neighbors = getNeighbors(layout, p);
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
  seatCheckFunction: (map: Status[][], position: Vector2) => Status,
): Status[][] {
  let isChanged = false;
  const newList = oldLayout.map((rowValue, y) => {
    return rowValue.map((colValue, x) => {
      const newStatus = seatCheckFunction(oldLayout, new Vector2(x, y));
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
  const layout = parse(values);
  return changeSeats(layout, nextTickSeatStatusRange1).reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

function part2(values: string[]): number {
  const layout = parse(values);
  return changeSeats(layout, nextTickSeatStatusRangeInfinite).reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

const test1 = [
  [Status.FLOOR, Status.EMPTY, Status.FLOOR, Status.OCCUPIED],
  [Status.FLOOR, Status.FLOOR, Status.FLOOR, Status.EMPTY],
  [Status.FLOOR, Status.FLOOR, Status.EMPTY, Status.OCCUPIED],
  [Status.FLOOR, Status.OCCUPIED, Status.EMPTY, Status.EMPTY],
];

assert.strictEqual(getOccupiedNeighborCountInRange(5)(test1, new Vector2(1, 0)), 3);
assert.strictEqual(part1(input), 2346);
assert.strictEqual(part2(input), 2111);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
