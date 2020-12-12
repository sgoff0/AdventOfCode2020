import readInput from '../../utils/readInput';
import assert from 'assert';
import { Grid, Vector2, directions } from '../../utils/grid';

const rawInput = readInput();
const input = rawInput.split('\n');

enum Status {
  EMPTY = 'L',
  FLOOR = '.',
  OCCUPIED = '#',
}

function parse(values: string[]) {
  const parsed = values.map((row) => row.split('').map((i) => i as Status));
  return new Grid(parsed);
}

function isSeatOccupiedInRange(
  grid: Grid<Status>,
  position: Vector2,
  direction: Vector2,
  range: number,
  depth = 1,
): number {
  if (depth > range) {
    return 0;
  }
  const seat = position.add(direction.multiply(depth));
  if (!seat.inBounds(grid.maxX(), grid.maxY())) {
    return 0;
  }

  const currentValue = grid.getVector(seat);
  if (currentValue === Status.FLOOR) {
    return isSeatOccupiedInRange(grid, position, direction, range, depth + 1);
  }
  return currentValue === Status.OCCUPIED ? 1 : 0;
}

const getOccupiedNeighborCountInRange = (range: number) => (layout: Grid<Status>, p: Vector2) => {
  return directions.reduce((acc, direction) => acc + isSeatOccupiedInRange(layout, p, direction, range), 0);
};

const nextTickSeatStatusRange1 = (grid: Grid<Status>, position: Vector2) => {
  return getSeatStatus(getOccupiedNeighborCountInRange(1), grid, position, 4);
};
const nextTickSeatStatusRangeInfinite = (grid: Grid<Status>, position: Vector2) => {
  return getSeatStatus(getOccupiedNeighborCountInRange(grid.maxXorY()), grid, position, 5);
};

function getSeatStatus(
  getNeighbors: (grid: Grid<Status>, position: Vector2) => number,
  grid: Grid<Status>,
  position: Vector2,
  min: number,
) {
  const currentSeat = grid.getVector(position);
  const neighbors = getNeighbors(grid, position);
  if (currentSeat === Status.EMPTY && neighbors === 0) {
    return Status.OCCUPIED;
  } else if (currentSeat === Status.OCCUPIED && neighbors >= min) {
    return Status.EMPTY;
  } else {
    return currentSeat;
  }
}

function changeSeats(
  currentGrid: Grid<Status>,
  seatCheckFunction: (grid: Grid<Status>, position: Vector2) => Status,
): Grid<Status> {
  let isChanged = false;
  const nextGrid = currentGrid.map((position: Vector2, value: Status) => {
    const newStatus = seatCheckFunction(currentGrid, position);
    if (newStatus !== value) {
      isChanged = true;
    }
    return newStatus;
  });

  if (!isChanged) {
    return currentGrid;
  }
  return changeSeats(new Grid(nextGrid), seatCheckFunction);
}

function part1(values: string[]): number {
  const layout = parse(values);
  return changeSeats(layout, nextTickSeatStatusRange1).values.reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

function part2(values: string[]): number {
  const layout = parse(values);
  return changeSeats(layout, nextTickSeatStatusRangeInfinite).values.reduce((total, row) => {
    return total + row.reduce((rowTotal, val) => rowTotal + (val === Status.OCCUPIED ? 1 : 0), 0);
  }, 0);
}

const test1 = [
  [Status.FLOOR, Status.EMPTY, Status.FLOOR, Status.OCCUPIED],
  [Status.FLOOR, Status.FLOOR, Status.FLOOR, Status.EMPTY],
  [Status.FLOOR, Status.FLOOR, Status.EMPTY, Status.OCCUPIED],
  [Status.FLOOR, Status.OCCUPIED, Status.EMPTY, Status.EMPTY],
];

assert.strictEqual(getOccupiedNeighborCountInRange(5)(new Grid(test1), new Vector2(1, 0)), 3);
assert.strictEqual(part1(input), 2346);
assert.strictEqual(part2(input), 2111);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
