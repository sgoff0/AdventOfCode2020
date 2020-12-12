import readInput from '../../utils/readInput';
import assert from 'assert';
import { Vector2 } from '../../utils/grid';

const rawInput = readInput();
const input = rawInput.split('\n');

enum Action {
  NORTH = 'N',
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'W',
  LEFT = 'L',
  RIGHT = 'R',
  FORWARD = 'F',
}

enum Facing {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

class Instruction {
  action: Action;
  value: number;
  constructor(action: Action, value: number) {
    this.action = action;
    this.value = value;
  }
}

class Grid {
  x = 0;
  y = 0;

  waypointX = 1;
  waypointY = 1;

  facing = Facing.EAST;

  constructor(x = 0, y = 0, waypointX = 1, waypointY = 1) {
    this.x = x;
    this.y = y;
    this.waypointX = waypointX;
    this.waypointY = waypointY;
  }

  sum() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  turn(degress: number) {
    let steps = (degress / 90) % 4;
    if (steps < 0) {
      steps = 4 - Math.abs(steps);
    }
    this.facing = (this.facing + steps) % 4;
  }

  move(ins: Instruction) {
    switch (ins.action) {
      case Action.NORTH: {
        this.y += ins.value;
        break;
      }
      case Action.SOUTH: {
        this.y -= ins.value;
        break;
      }
      case Action.EAST: {
        this.x += ins.value;
        break;
      }
      case Action.WEST: {
        this.x -= ins.value;
        break;
      }
      case Action.RIGHT: {
        this.turn(ins.value);
        break;
      }
      case Action.LEFT: {
        this.turn(-1 * ins.value);
        break;
      }
      case Action.FORWARD: {
        switch (this.facing) {
          case Facing.NORTH: {
            this.y += ins.value;
            break;
          }
          case Facing.EAST: {
            this.x += ins.value;
            break;
          }
          case Facing.SOUTH: {
            this.y -= ins.value;
            break;
          }
          case Facing.WEST: {
            this.x -= ins.value;
            break;
          }
        }
        break;
      }
    }
  }
}

class GridWaypoint {
  x = 0;
  y = 0;

  waypointX = 1;
  waypointY = 1;

  facing = Facing.EAST;

  constructor(x = 0, y = 0, waypointX = 1, waypointY = 1) {
    this.x = x;
    this.y = y;
    this.waypointX = waypointX;
    this.waypointY = waypointY;
  }

  sum() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  position() {
    return new Vector2(this.x, this.y);
  }

  rotate(angle: number) {
    let steps = (angle / 90) % 4;
    if (steps < 0) {
      steps = 4 - Math.abs(steps);
    }
    const sin = [0, 1, 0, -1][steps];
    const cos = [1, 0, -1, 0][steps];

    // // translate to origin
    // p.x -= center.x;
    // p.y -= center.y;

    const point = new Vector2(this.waypointX, this.waypointY);

    // rotate
    this.waypointX = point.x * cos + point.y * sin;
    this.waypointY = -point.x * sin + point.y * cos;

    // translate back
    // this.waypointX = newX + center.x;
    // this.waypointY = newY + center.y;
  }

  move(ins: Instruction) {
    switch (ins.action) {
      case Action.NORTH: {
        this.waypointY += ins.value;
        break;
      }
      case Action.SOUTH: {
        this.waypointY -= ins.value;
        break;
      }
      case Action.EAST: {
        this.waypointX += ins.value;
        break;
      }
      case Action.WEST: {
        this.waypointX -= ins.value;
        break;
      }
      case Action.RIGHT: {
        this.rotate(ins.value);
        break;
      }
      case Action.LEFT: {
        this.rotate(-1 * ins.value);
        break;
      }
      case Action.FORWARD: {
        this.x += ins.value * this.waypointX;
        this.y += ins.value * this.waypointY;
      }
    }
  }
}

const parse = (values: string[]) => {
  return values.map((v) => {
    const [action, ...values] = v.split('');
    return new Instruction(action as Action, parseInt(values.join(''), 10));
  });
};

function part1(values: string[]): number {
  const orders = parse(values);
  const grid = new Grid();
  orders.forEach((instruction) => {
    grid.move(instruction);
  });
  return grid.sum();
}

function part2(values: string[]): number {
  const orders = parse(values);
  const grid = new GridWaypoint(0, 0, 10, 1);
  orders.forEach((instruction) => {
    grid.move(instruction);
  });
  return grid.sum();
}

/* Tests */

const myGrid = new Grid();
assert.strictEqual(myGrid.facing, Facing.EAST);
myGrid.turn(90);
assert.strictEqual(myGrid.facing, Facing.SOUTH);
myGrid.turn(90);
assert.strictEqual(myGrid.facing, Facing.WEST);
myGrid.turn(90);
assert.strictEqual(myGrid.facing, Facing.NORTH);
myGrid.turn(180);
assert.strictEqual(myGrid.facing, Facing.SOUTH);
myGrid.turn(-180);
assert.strictEqual(myGrid.facing, Facing.NORTH);

const grid2 = new GridWaypoint(0, 0, 10, 1);
grid2.move(new Instruction(Action.FORWARD, 10));
assert.notStrictEqual(grid2.position(), new Vector2(100, 10));
grid2.move(new Instruction(Action.NORTH, 3));
assert.strictEqual(grid2.waypointX, 10);
assert.strictEqual(grid2.waypointY, 4);
grid2.move(new Instruction(Action.FORWARD, 7));
assert.notStrictEqual(grid2.position(), new Vector2(170, 38));
grid2.move(new Instruction(Action.RIGHT, 90));
assert.strictEqual(grid2.waypointX, 4);
assert.strictEqual(grid2.waypointY, -10);

assert.strictEqual(part1(input), 757);
assert.strictEqual(part2(input), 51249);
/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
