import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { Grid, Vector2, directions, Direction } from '../../utils/grid';

const rawInput = readInput();
const demoInput = readDemoInput();

/* Functions */

type KeyedGrid = {
  title: string;
  grid: Grid<string>;
};

let uglyGlobalResponse: KeyedGrid[];
// insides dont' matter
function part1(values: string): number {
  const tiles = values.split('\n\n');

  const grids = tiles.map((tile, i) => {
    const [titleRaw, ...image] = tile.split('\n');

    const title = /(\d+)/.exec(titleRaw)[1];

    const parsed = image.map((row) => row.split('').map((i) => i));

    const grid = new Grid(parsed);

    return { title, grid };
    // grid.rotate();
  });

  const size = Math.sqrt(grids.length);
  //   for (let y = 0; y < size; y++) {
  //     for (let x = 0; x < size; x++) {

  //     }
  //   }
  //   console.log(`I Have ${tiles.length} tiles`);

  const retVal = alignGrid(
    [],
    // grids.map((v) => v.grid),
    grids,
    size,
  );
  console.log('RV: ', retVal);
  console.log('RV: ', uglyGlobalResponse);
  return (
    +uglyGlobalResponse[0].title *
    +uglyGlobalResponse[size - 1].title *
    +uglyGlobalResponse[size * size - size].title *
    +uglyGlobalResponse[size * size - 1].title
  );
}

// function getOrientationsToProcess(grid: Grid<string>, size: number, position: Vector2) {
//   const toProcess = [];
//   if (position.x !== 0) {
//     toProcess.push(grid.alignsCurry(Direction.West));
//   }
//   if (position.y !== 0) {
//     toProcess.push(grid.alignsCurry(Direction.North));
//     //   checkNorth = false;
//   }
//   if (position.y !== size - 1) {
//     toProcess.push(grid.alignsCurry(Direction.South));
//     //   checkSouth = false;
//   }
//   if (position.x !== size - 1) {
//     toProcess.push(grid.alignsCurry(Direction.East));
//     //   checkEast = false;
//   }
//   return toProcess;
// }

// Only check trailing orientations as I try to move forward, e.g. never check east or south
// function getOrientationsToProcess(grid: Grid<string>, size: number, position: Vector2) {
//   const toProcess = [];
//   if (position.x !== 0) {
//     toProcess.push(grid.alignsCurry(Direction.West));
//   }
//   if (position.y !== 0) {
//     toProcess.push(grid.alignsCurry(Direction.North));
//     //   checkNorth = false;
//   }
//   //   if (position.y !== size - 1) {
//   //     toProcess.push(grid.alignsCurry(Direction.South));
//   //     //   checkSouth = false;
//   //   }
//   //   if (position.x !== size - 1) {
//   //     toProcess.push(grid.alignsCurry(Direction.East));
//   //     //   checkEast = false;
//   //   }
//   return toProcess;
// }

// ONLY rotate one grid
// function canMatch(f: (a: Grid<string>) => boolean, nextGrid: Grid<string>): boolean {
//   let toCheck = nextGrid;
//   for (let i = 0; i < 4; i++) {
//     if (f(toCheck)) {
//       return true;
//     }
//     toCheck = new Grid(toCheck.rotate());
//   }
//   return false;
// }

/**
 * Store Grid of chosen decisions, check backwards then commit
 * e.g. at depth 0, iterate over all options (and orientations) and move to next, momemnt there is no move forward fail entire chain
 * each time there is a match lock in that rotation, commit it to the success object, decrement reamining grids, and move forward
 *
 * @param decisions
 * @param gridsRemaining
 * @param size
 * @param depth
 */
function alignGrid(decisions: KeyedGrid[] = [], gridsRemaining: KeyedGrid[], size: number, depth = 0) {
  const x = depth % size;
  const y = Math.floor(depth / size);
  if (gridsRemaining.length == 0) {
    uglyGlobalResponse = decisions;
    return true;
  }
  // If I pass all checks, move forward
  // check every grid
  return gridsRemaining.some((rawGrid, i) => {
    // Get every orientation of this grid
    const grid1 = new Grid(rawGrid.grid.values);
    const grid2 = grid1.rotate();
    const grid3 = grid2.rotate();
    const grid4 = grid3.rotate();
    // DIDN'T SEE FLIP RULES FOR 2 HOURS OMG
    const grid5 = grid1.flipOnYPlane();
    const grid6 = grid5.rotate();
    const grid7 = grid6.rotate();
    const grid8 = grid7.rotate();

    return [grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8]
      .filter((grid, i) => {
        if (x !== 0) {
          if (!grid.alignsXWardWith(Direction.West, decisions[depth - 1].grid)) {
            return false;
          }
        }
        if (y !== 0) {
          // must verify north
          // north would be decision depth - size
          if (depth == 8) {
            console.log(`Comparing ${rawGrid.title} northward to ${decisions[depth - size].title}`);
          }
          if (!grid.alignsXWardWith(Direction.North, decisions[depth - size].grid)) {
            return false;
          }
        }
        return true;
      })
      .some((gridOrientation: Grid<string>) => {
        const newDecision = [...decisions, { title: rawGrid.title, grid: gridOrientation }];
        const otherGrids = [...gridsRemaining.slice(0, i), ...gridsRemaining.slice(i + 1)];
        return alignGrid(newDecision, otherGrids, size, depth + 1);
      });
  });
}

const testGrid = new Grid([
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
]);

assert.deepStrictEqual(testGrid, new Grid(testGrid.values));
assert.deepStrictEqual(testGrid, new Grid(testGrid.values).rotate().rotate().rotate().rotate());
assert.deepStrictEqual(testGrid, new Grid(testGrid.values).flipOnYPlane().flipOnYPlane());

console.log(testGrid);

function part2(values: number[]): number {
  return 0;
}

// console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
console.time('Time');
const resultPart1 = part1(rawInput);
// const resultPart2 = part2(rawInput);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2); // 458 is too high
assert.strictEqual(part1(rawInput), 15405893262491);

// console.log('Result: ', part1(demoInput));
// console.log('Result: ', part1(rawInput));
// // part1(rawInput);
// console.log('Done');
