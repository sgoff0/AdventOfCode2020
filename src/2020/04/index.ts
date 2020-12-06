// import { check } from 'prettier';
import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n\n');

/* Functions */

function processLine(line: string) {
  const passportFields = line.split(' ');

  const data = {};

  if (passportFields.length < 7) {
  } else {
    passportFields.forEach((i) => {
      const [key, value] = i.split(':');
      data[key] = value;
    });
  }

  return data;
}

function isValid(line: string) {
  const data = processLine(line);
  return validate(data);
}

const requiredProperties = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

function validate(data) {
  let isValid = true;
  requiredProperties.forEach((i) => {
    if (!data.hasOwnProperty(i)) {
      isValid = false;
    }
  });
  return isValid;
}

const heightRE = /(\d+)(\w+)/;
const hairColorRE = /#[0-9a-f]{6}$/;
const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const passportIDRE = /^\d{9}$/;
function isNumberInRange(input: string, min: number, max: number) {
  const parsed = parseInt(input, 10);
  return !isNaN(parsed) && parsed >= min && parsed <= max;
}
function isValidHeight(input: string, metric: string, min: number, max: number) {
  const matches = heightRE.exec(input);
  if (matches) {
    const [_, heightValueString, measurement] = matches;
    const heightValue = parseInt(heightValueString, 10);
    return measurement === metric && !isNaN(heightValue) && heightValue >= min && heightValue <= max;
  }
  return false;
}
const isValidHairColor = (input: string) => input?.match(hairColorRE);
const isValidEyeColor = (input: string) => validEyeColors.includes(input);
const isValidPassportID = (input: string) => input?.match(passportIDRE);
function isValidPart2(line: string) {
  const data = processLine(line);
  return (
    isNumberInRange(data['byr'], 1920, 2002) &&
    isNumberInRange(data['iyr'], 2010, 2020) &&
    isNumberInRange(data['eyr'], 2020, 2030) &&
    (isValidHeight(data['hgt'], 'cm', 150, 193) || isValidHeight(data['hgt'], 'in', 59, 76)) &&
    isValidHairColor(data['hcl']) &&
    isValidEyeColor(data['ecl']) &&
    isValidPassportID(data['pid'])
  );
}

function part1(chunks: string[]): number {
  let valid = 0;
  chunks.forEach((chunk) => {
    const line = chunk.split('\n').join(' ');
    if (isValid(line)) {
      valid += 1;
    }
  });
  return valid;
}

function part2(chunks: string[]): number {
  let valid = 0;
  chunks.forEach((chunk) => {
    const line = chunk.split('\n').join(' ');
    if (isValidPart2(line)) {
      valid += 1;
    }
  });
  return valid;
}

/* Tests */

// BYR
assert.strictEqual(isNumberInRange('1920', 1920, 2002), true);
assert.strictEqual(isNumberInRange('2002', 1920, 2002), true);
assert.strictEqual(isNumberInRange('1919', 1920, 2002), false);
assert.strictEqual(isNumberInRange('2003', 1920, 2002), false);
assert.strictEqual(isNumberInRange('', 1920, 2002), false);

assert.strictEqual(isValidHeight('74in', 'in', 59, 76), true);
assert.strictEqual(isValidHeight('76in', 'in', 59, 76), true);
assert.strictEqual(isValidHeight('59in', 'in', 59, 76), true);
assert.strictEqual(isValidHeight('77in', 'in', 59, 76), false);
assert.strictEqual(isValidHeight('58in', 'in', 59, 76), false);
assert.strictEqual(isValidHeight('58inz', 'in', 59, 76), false);

/* Results */

assert.strictEqual(part1(input), 264);
assert.strictEqual(part2(input), 224);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
