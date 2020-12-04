// import { check } from 'prettier';
import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Functions */

function processChunk(chunk) {
  const passportFields = chunk.join(' ').split(' ');

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

function isValid(chunk) {
  const data = processChunk(chunk);
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
  let isValid = false;
  const parsed = parseInt(input, 10);
  if (!isNaN(parsed) && parsed >= min && parsed <= max) {
    isValid = true;
  }

  return isValid;
}

function isValidHeight(input: string, metric: string, min: number, max: number) {
  let isValid = false;

  const matches = heightRE.exec(input);

  if (matches) {
    const [_, heightValueString, measurement] = matches;
    const heightValue = parseInt(heightValueString, 10);
    if (measurement === metric && !isNaN(heightValue) && heightValue >= min && heightValue <= max) {
      isValid = true;
    }
  }
  return isValid;
}

function isValidHairColor(input: string) {
  return input?.match(hairColorRE);
}
function isValidEyeColor(input: string) {
  return validEyeColors.includes(input);
}
function isValidPassportID(input: string) {
  return input?.match(passportIDRE);
}

function isValidPart2(chunk) {
  const data = processChunk(chunk);

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

function part1(lines: string[]): number {
  let chunk = [];
  let valid = 0;
  lines.forEach((line) => {
    if (line.length > 0) {
      chunk.push(line);
    } else {
      if (isValid(chunk)) {
        valid += 1;
      }
      chunk = [];
    }
  });
  if (isValid(chunk)) {
    valid += 1;
  }
  return valid;
}

function part2(lines: string[]): number {
  let chunk = [];
  let valid = 0;
  lines.forEach((line) => {
    if (line.length > 0) {
      chunk.push(line);
    } else {
      if (isValidPart2(chunk)) {
        valid += 1;
      }
      chunk = [];
    }
  });
  if (isValidPart2(chunk)) {
    valid += 1;
  }

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

assert.strictEqual(part2([`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980 hcl:#623a2f`]), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1920', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1919', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:2003', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:2002', 'hcl:#623a2f']), 1);

//IYR
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2010 eyr:2030 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2009 eyr:2030 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2021 eyr:2030 byr:1980', 'hcl:#623a2f']), 0);

//eyr
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2010 eyr:2020 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2010 eyr:2019 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2020 eyr:2031 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2020 eyr:201 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2020 eyr:20100 byr:1980', 'hcl:#623a2f']), 0);

assert.strictEqual(part2(['pid:544267207 cid:113 iyr:2015 hgt:181cm hcl:#6b5442 ecl:gry byr:1971']), 0);

// hgt
assert.strictEqual(part2(['pid:087499704 hgt:59in ecl:grn iyr:2010 eyr:2020 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:76in ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:58in ecl:grn iyr:2010 eyr:2020 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:77in ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 0);

assert.strictEqual(part2(['pid:087499704 hgt:150cm ecl:grn iyr:2010 eyr:2020 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:193cm ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:149cm ecl:grn iyr:2010 eyr:2020 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:194cm ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:150am ecl:grn iyr:2020 eyr:2030 byr:1980', 'hcl:#623a2f']), 0);

// hcl
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#000000']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#ffffff ']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#gggggg']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#01234']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#012345']), 1);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#01234567']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:#0123456']), 0);
assert.strictEqual(part2(['pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980', 'hcl:012345']), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input); // not 259, not 227, not 226, not 229, 224
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
