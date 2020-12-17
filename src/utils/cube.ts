export class Vector3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number, offset = 0) {
    this.x = x - offset;
    this.y = y - offset;
    this.z = z - offset;
  }

  add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }
  multiply(val: number): Vector3 {
    return new Vector3(this.x * val, this.y * val, this.z * val);
  }

  inBounds(maxX: number, maxY: number, maxZ: number): boolean {
    return this.x >= 0 && this.y >= 0 && this.z >= 0 && this.x < maxX && this.y < maxY && this.z < maxZ;
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export class Cube<T> {
  values: T[][][];
  offset: number;

  // constructor(cycles: number, values: T[][][]) {
  constructor(cycles: number, initial: T[][], emptyState: T) {
    // In order to deal with negatives properly use an offset, e.g. if we do 6 cycles use offset of 6 which makes array loop from -6 to + 6
    // Initial input is always based on 0 to positive, but when I store in memory I need -6 to be at index 0, so index 6 (offset) will be the value traditionally at index 0
    this.offset = cycles;

    this.values = [];
    for (let noOffsetZ = -cycles; noOffsetZ < cycles; noOffsetZ++) {
      const z = noOffsetZ + this.offset;
      this.values.push([]); // this array is z
      for (let noOffsetY = -cycles; noOffsetY < cycles; noOffsetY++) {
        const y = noOffsetY + this.offset;
        this.values[z].push([]); // this array is y
        for (let noOffsetX = -cycles; noOffsetX < cycles; noOffsetX++) {
          const x = noOffsetX + this.offset;
          if (
            noOffsetZ === 0 &&
            noOffsetX >= 0 &&
            noOffsetY >= 0 &&
            noOffsetY < initial.length &&
            noOffsetX < initial[noOffsetY].length
          ) {
            console.log(`Pushing ${initial[noOffsetY][noOffsetX]} to ` + new Vector3(x, y, z, this.offset));
            this.values[z][y][x] = initial[noOffsetY][noOffsetX];
          } else {
            // console.log('Pushing empty state to ' + new Vector3(x, y, z));
            this.values[z][y][x] = emptyState;
          }
        }
      }
    }
  }

  getVector(position: Vector3): T {
    return this.values[position.y][position.x][position.z];
  }
  get(x: number, y: number, z: number): T {
    return this.values[y][x][z];
  }

  // maxX(): number {
  //   return this.values[0].length;
  // }

  // maxY(): number {
  //   return this.values.length;
  // }

  // maxXorY(): number {
  //   return Math.max(this.maxX(), this.maxY());
  // }

  map(cb: (position: Vector3, value: T) => T): T[][][] {
    return this.values.map((depthValue, z) => {
      return depthValue.map((rowValue, y) => {
        return rowValue.map((colValue, x) => {
          return cb(new Vector3(x, y, z), colValue);
        });
      });
    });
  }
}

// export const directions = [
//   new Vector2(1, 0),
//   new Vector2(-1, 0),
//   new Vector2(0, 1),
//   new Vector2(0, -1),
//   new Vector2(1, 1),
//   new Vector2(1, -1),
//   new Vector2(-1, 1),
//   new Vector2(-1, -1),
// ];

// export class Cube<T> {
//   values: T[][][];

//   constructor(values: T[][][]) {
//   // constructor(values: T[][][]) {
//     this.values = values;
//   }

//   getVector(position: Vector3): T {
//     return this.values[position.y][position.x][position.z];
//   }
//   get(x: number, y: number, z: number): T {
//     return this.values[y][x][z];
//   }

//   // maxX(): number {
//   //   return this.values[0].length;
//   // }

//   // maxY(): number {
//   //   return this.values.length;
//   // }

//   // maxXorY(): number {
//   //   return Math.max(this.maxX(), this.maxY());
//   // }

//   map(cb: (position: Vector3, value: T) => T): T[][][] {
//     return this.values.map((depthValue, z) => {
//       return depthValue.map((rowValue, y) => {
//         return rowValue.map((colValue, x) => {
//           return cb(new Vector3(x, y, z), colValue);
//         });
//       });
//     });
//   }
// }

// // export const directions = [
// //   new Vector2(1, 0),
// //   new Vector2(-1, 0),
// //   new Vector2(0, 1),
// //   new Vector2(0, -1),
// //   new Vector2(1, 1),
// //   new Vector2(1, -1),
// //   new Vector2(-1, 1),
// //   new Vector2(-1, -1),
// // ];
