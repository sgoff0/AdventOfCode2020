import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n\n');

/* Functions */

const unique = (input: string): string => [...new Set(input.split(''))].join('');

const intersect = (a: string[], b: string[]) => {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
};

const sum = (p: number, c: number) => p + c;

function part1(groups: string[]): number {
  return groups
    .map((group) => {
      const groupAnswers = group.split('\n').join('');
      return unique(groupAnswers).length;
    })
    .reduce(sum);
}

function part2(groups: string[]): number {
  return groups
    .map((group) => {
      const persons = group.split('\n');
      return persons.reduce((prevousPerson, currentPerson) => {
        return intersect(prevousPerson.split(''), currentPerson.split('')).join('');
      }).length;
    })
    .reduce(sum);
}

assert.strictEqual(part1(input), 6947);
assert.strictEqual(part2(input), 3398);

/* Results */
console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
