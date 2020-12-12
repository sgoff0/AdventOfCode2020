export class Vector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }
  multiply(val: number): Vector2 {
    return new Vector2(this.x * val, this.y * val);
  }

  inBounds(maxX: number, maxY: number): boolean {
    return this.x >= 0 && this.y >= 0 && this.x < maxX && this.y < maxY;
  }
}

export class Grid<T> {
  values: T[][];

  constructor(values: T[][]) {
    this.values = values;
  }

  getVector(position: Vector2): T {
    return this.values[position.y][position.x];
  }
  get(x: number, y: number): T {
    return this.values[y][x];
  }

  maxX(): number {
    return this.values[0].length;
  }

  maxY(): number {
    return this.values.length;
  }

  maxXorY(): number {
    return Math.max(this.maxX(), this.maxY());
  }

  map(cb: (position: Vector2, value: T) => T): T[][] {
    return this.values.map((rowValue, y) => {
      return rowValue.map((colValue, x) => {
        return cb(new Vector2(x, y), colValue);
      });
    });
  }
}

export const directions = [
  new Vector2(1, 0),
  new Vector2(-1, 0),
  new Vector2(0, 1),
  new Vector2(0, -1),
  new Vector2(1, 1),
  new Vector2(1, -1),
  new Vector2(-1, 1),
  new Vector2(-1, -1),
];
