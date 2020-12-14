import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

function toBinary(value: number): string {
  return value.toString(2);
}

function fromBinary(value: string): number {
  return parseInt(value, 2);
}

function applyMask(original: string, mask: string): string {
  //   console.log('Using input: ' + original);
  const paddedOriginal = original.padStart(36, '0');
  const m = mask.split('');
  return paddedOriginal
    .split('')
    .map((value, i) => {
      if (m[i] == 'X') {
        return value;
      } else {
        return m[i];
      }
    })
    .join('');
}

function part1(lines: string[]): number {
  const addresses = new Map();
  const re = /mem\[(\d+)\]/;

  let mask;
  lines.forEach((line) => {
    const [command, value] = line.split(' = ');
    if (command === 'mask') {
      mask = value;
    } else {
      const matches = re.exec(line);
      if (matches == null) {
        return;
      }
      const [_, memory] = matches;
      const newValue = applyMask(toBinary(parseInt(value, 10)), mask);
      addresses.set(memory, newValue);
      //   console.log('Using mask: ' + mask);
      //   console.log('Just wrote ' + newValue + ' (' + fromBinary(newValue) + ') to memory ' + memory);
    }
  });

  let sum = 0;
  addresses.forEach((v, k) => {
    // console.log(`${v} or ${fromBinary(v)} at index ${k}`);
    sum += fromBinary(v);
  });
  return sum;
}

/* Tests */

assert.strictEqual(toBinary(2), '10');
assert.strictEqual(toBinary(17), '10001');
assert.strictEqual(fromBinary('10001'), 17);
assert.strictEqual(fromBinary(toBinary(500)), 500);
assert.strictEqual(
  applyMask('000000000000000000000000000000001011', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001001001',
);
// Step 1
assert.strictEqual(
  applyMask('000000000000000000000000000000001011', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001001001',
);
assert.strictEqual(fromBinary('000000000000000000000000000001001001'), 73);
// Step 2
assert.strictEqual(
  applyMask('000000000000000000000000000001100101', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001100101',
);
assert.strictEqual(fromBinary('000000000000000000000000000001100101'), 101);
// Step 3 demo
assert.strictEqual(
  applyMask('000000000000000000000000000000000000', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001000000',
);
assert.strictEqual(fromBinary('000000000000000000000000000001000000'), 64);

// assert.strictEqual(part2([1, -1]), 0);

function applyMask2(original: string, mask: string): string {
  //   console.log('Using input: ' + original);
  const paddedOriginal = original.padStart(36, '0');
  const m = mask.split('');
  return paddedOriginal
    .split('')
    .map((value, i) => {
      if (m[i] == '0') {
        return value;
      } else if (m[i] == '1') {
        return '1';
      } else if (m[i] == 'X') {
        // TODO deal with floating
        return 'X';
      }
    })
    .join('');
}

function replaceAt(s: string, index: number, char: string): string {
  return s.substring(0, index) + char + s.substring(index + 1);
}

function createPermutations(value: string): string[] {
  let existingValues = [value];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === 'X') {
      //   console.log('Found match');
      const temp = [];
      existingValues.forEach((v) => {
        temp.push(replaceAt(v, i, '1'));
        temp.push(replaceAt(v, i, '0'));
      });
      existingValues = temp;
    }
  }
  //   console.log('Returning: ', existingValues);
  return existingValues;
}

// function createPermutationsHelper(values: string[], index = 0) {
//   if (index >= values[0].length) {
//     return values;
//   }
//   const value = values[0];
//   //   return values.map((value) => {
//   if (value[index] === 'X') {
//     return createPermutationsHelper([replaceAt(value, index, '1'), replaceAt(value, index, '0')]);
//   } else {
//     return createPermutationsHelper(values, index + 1);
//   }
//   //   });
// }

function part2(lines: string[]): number {
  const addresses2 = new Map();
  const re = /mem\[(\d+)\]/;

  let mask;
  lines.forEach((line) => {
    // console.log('Tick');
    const [command, value] = line.split(' = ');
    if (command === 'mask') {
      mask = value;
    } else {
      const matches = re.exec(line);
      if (matches == null) {
        return;
      }
      const [_, memory] = matches;

      //   const masked = applyMask2()
      //   console.log('Mem: ', memory);
      //   console.log('Mem Bin: ', toBinary(parseInt(memory, 10)));
      //   console.log('Mask: ', mask);
      const masked = applyMask2(toBinary(parseInt(memory, 10)), mask);
      //   console.log('Result: ', masked);
      const permutations = createPermutations(masked);
      //   console.log(permutations);

      //   console.log(`\nAttempting to write ${value} to memory location ${memory}`);
      permutations.forEach((memoryAddress) => {
        const memoryLoc = fromBinary(memoryAddress);
        const binaryValue = toBinary(parseInt(value));
        // console.log('V: ', value);
        // const binaryValue = value;
        // console.log(`Setting ${binaryValue} to ${memoryLoc}`);
        addresses2.set(memoryLoc, binaryValue);
      });
    }
  });

  let sum = 0;
  addresses2.forEach((v, k) => {
    // console.log(`${v} or ${fromBinary(v)} at index ${k}`);
    sum += fromBinary(v);
  });
  return sum;
}

const part2DemoMask = '000000000000000000000000000000X1001X';
assert.strictEqual(applyMask2(toBinary(42), part2DemoMask), '000000000000000000000000000000X1101X'); // first part, still need to process

/* Results */
assert.strictEqual(part1(input), 6386593869035);
assert.strictEqual(part2(input), 4288986482164);

console.time('Time');
// const resultPart1 = part1(input); // not 3113174009201
const resultPart2 = part2(input);
console.timeEnd('Time');

// console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
