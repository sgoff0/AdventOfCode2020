import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n\n');

/* Functions */

type MinMax = {
  min: number;
  max: number;
};

const re = /\s(\d+)-(\d+) or (\d+)-(\d+)$/;
function part1(values: string[]): number {
  const [rules, yours, nearby] = values;
  //   console.log(rules);

  const validRanges: MinMax[] = [];

  rules.split('\n').forEach((line) => {
    const match = re.exec(line);
    if (match) {
      const [_, min1, max1, min2, max2] = match;
      console.log(`Found ${min1} to ${max1} and ${min2} to ${max2}`);
      validRanges.push({ min: parseInt(min1, 10), max: parseInt(max1, 10) });
      validRanges.push({ min: +min2, max: +max2 });
    }
  });

  // yours ignore for now

  const failure = [];
  nearby
    .split('\n')
    .slice(1)
    .forEach((line) => {
      //   console.log(line);
      const numbers = line.split(',').map(Number);
      //   console.log(numbers);
      const passes = false;

      numbers.forEach((num) => {
        // check if number passes at least 1, if not add to fail list
        const isValid = validRanges.some(({ min, max }) => {
          return num >= min && num <= max;
        });
        console.log(`Num ${num} isValid: ${isValid}`);
        if (!isValid) {
          failure.push(num);
        }
      });
    });

  console.log('Rules: ', validRanges);
  console.log('Failed: ', failure);
  const sum = failure.reduce((acc, curr) => acc + curr, 0);
  //   return 0;
  return sum;
}

function part2(values: number[]): number {
  return 0;
}

/* Tests */

// assert.strictEqual(part1([1, 1, 1]), 0);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
