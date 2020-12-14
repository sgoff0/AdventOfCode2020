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

function applyValueMask(original: string, mask: string): string {
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
      const newValue = applyValueMask(toBinary(parseInt(value, 10)), mask);
      addresses.set(memory, newValue);
    }
  });

  let sum = 0;
  addresses.forEach((v) => {
    sum += fromBinary(v);
  });
  return sum;
}

function applyMemoryMask(original: string, mask: string): string {
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
        return 'X';
      }
    })
    .join('');
}

function replaceAt(s: string, index: number, char: string): string {
  return s.substring(0, index) + char + s.substring(index + 1);
}

function findPermutationsImperative(value: string): string[] {
  let addresses = [value];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === 'X') {
      const nextSetOfPermutations = [];
      addresses.forEach((v) => {
        nextSetOfPermutations.push(replaceAt(v, i, '1'));
        nextSetOfPermutations.push(replaceAt(v, i, '0'));
      });
      addresses = nextSetOfPermutations;
    }
  }
  return addresses;
}

function findPermutations(addresses: string[], i = 0): string[] {
  if (i >= addresses[0].length) {
    return addresses;
  } else if (addresses[0][i] === 'X') {
    const nextSetOfPermutations = [];
    addresses.forEach((v) => {
      nextSetOfPermutations.push(replaceAt(v, i, '1'));
      nextSetOfPermutations.push(replaceAt(v, i, '0'));
    });
    return findPermutations(nextSetOfPermutations, i + 1);
  } else {
    return findPermutations(addresses, i + 1);
  }
}

function part2(lines: string[]): number {
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
      const masked = applyMemoryMask(toBinary(parseInt(memory, 10)), mask);
      //   const permutations = findPermutationsImperative(masked);
      const permutations = findPermutations([masked]);
      permutations.forEach((memoryAddress) => {
        const memoryLoc = fromBinary(memoryAddress);
        const binaryValue = toBinary(parseInt(value));
        addresses.set(memoryLoc, binaryValue);
      });
    }
  });

  let sum = 0;
  addresses.forEach((v) => {
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
  applyValueMask('000000000000000000000000000000001011', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001001001',
);
// Step 1
assert.strictEqual(
  applyValueMask('000000000000000000000000000000001011', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001001001',
);
assert.strictEqual(fromBinary('000000000000000000000000000001001001'), 73);
// Step 2
assert.strictEqual(
  applyValueMask('000000000000000000000000000001100101', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001100101',
);
assert.strictEqual(fromBinary('000000000000000000000000000001100101'), 101);
// Step 3 demo
assert.strictEqual(
  applyValueMask('000000000000000000000000000000000000', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'),
  '000000000000000000000000000001000000',
);
assert.strictEqual(fromBinary('000000000000000000000000000001000000'), 64);
const part2DemoMask = '000000000000000000000000000000X1001X';
assert.strictEqual(applyMemoryMask(toBinary(42), part2DemoMask), '000000000000000000000000000000X1101X'); // first part, still need to process

/* Results */
assert.strictEqual(part1(input), 6386593869035);
assert.strictEqual(part2(input), 4288986482164);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
