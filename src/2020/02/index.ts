import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

function getLetterCountInWord(password: string, letterToMatch: string): number {
  return (password.match(new RegExp(letterToMatch, 'g')) || []).length;
}

function matchesPosition(password: string, letterToMatch: string, pos1: number, pos2: number): boolean {
  const pos1Normalized = pos1 - 1;
  const pos2Normalized = pos2 - 1;
  let isMatch1 = false;
  let isMatch2 = false;

  if (pos1Normalized < password.length && password[pos1Normalized] === letterToMatch) {
    isMatch1 = true;
  }
  if (pos2Normalized < password.length && password[pos2Normalized] === letterToMatch) {
    isMatch2 = true;
  }

  if (isMatch1 == isMatch2) {
    return false;
  } else if (isMatch1 || isMatch2) {
    return true;
  }
}

function part1(lines: string[]): number {
  const re = /(\d+)-(\d+) (\w): (.+)/;

  let validPasswordCount = 0;
  lines.forEach((line) => {
    const matches = re.exec(line);
    if (matches == null) {
      return;
    }
    const [all, min, max, letter, password] = matches;

    const letterCount = getLetterCountInWord(password, letter);
    if (letterCount >= parseInt(min) && letterCount <= parseInt(max)) {
      validPasswordCount += 1;
    }
    // console.log('Matches: ' + getLetterCountInWord(password, letter));
  });

  return validPasswordCount;
}

function part2(lines: string[]): number {
  const re = /(\d+)-(\d+) (\w): (.+)/;

  let validPasswordCount = 0;
  lines.forEach((line) => {
    const matches = re.exec(line);
    if (matches == null) {
      return;
    }
    const [all, pos1, pos2, letter, password] = matches;

    const isMatch = matchesPosition(password, letter, parseInt(pos1), parseInt(pos2));
    if (isMatch) {
      validPasswordCount += 1;
    }
  });

  return validPasswordCount;
}
assert.strictEqual(getLetterCountInWord('abcde', 'a'), 1);
assert.strictEqual(getLetterCountInWord('cdefg', 'b'), 0);
assert.strictEqual(getLetterCountInWord('ccccccccc', 'c'), 9);

assert.strictEqual(matchesPosition('abcde', 'a', 1, 3), true);
assert.strictEqual(matchesPosition('cdefg', 'b', 1, 3), false);
assert.strictEqual(matchesPosition('ccccccccc', 'c', 2, 9), false);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
