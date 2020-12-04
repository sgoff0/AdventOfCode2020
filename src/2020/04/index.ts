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

function isValidPart2(chunk) {
  let isValid = true;
  let isMissingStuff = false;
  const data = processChunk(chunk);
  const valuesPresent = validate(data);
  if (!valuesPresent) {
    // console.log('Missing required values: ', data);
    // isValid = false;
    isMissingStuff = true;
  }
  //   if (valuesPresent) {
  const byr = parseInt(data['byr'], 10);
  if (!isFinite(byr) || byr < 1920 || byr > 2002 || data['byr'].length !== 4) {
    isValid = false;
  }

  const iyr = parseInt(data['iyr'], 10);
  if (!isFinite(iyr) || iyr < 2010 || iyr > 2020 || data['iyr'].length !== 4) {
    isValid = false;
  }

  const eyr = parseInt(data['eyr'], 10);
  //   console.log('EYR is : ', eyr);
  if (!isFinite(eyr) || eyr < 2020 || eyr > 2030 || data['eyr'].length !== 4) {
    isValid = false;
  }

  const hgt = data['hgt'];
  const matches = heightRE.exec(hgt);
  if (!matches) {
    isValid = false;
  } else {
    const [_, heightValueString, measurement] = matches;
    const heightValue = parseInt(heightValueString, 10);
    if (measurement === 'cm') {
      if (!isFinite(heightValue) || heightValue < 150 || heightValue > 193 || heightValueString.length !== 3) {
        isValid = false;
      }
    } else if (measurement === 'in') {
      if (!isFinite(heightValue) || heightValue < 59 || heightValue > 76 || heightValueString.length !== 2) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
  }

  const hcl = data['hcl'];
  const matchesHair = hairColorRE.exec(hcl);
  if (!matchesHair) {
    isValid = false;
  }

  const ecl = data['ecl'];
  if (!validEyeColors.includes(ecl)) {
    isValid = false;
  }

  const pid = data['pid'];
  const matchesPassport = passportIDRE.exec(pid);
  if (!matchesPassport) {
    // GRRRR my regex matched 6 fine but didn't fail if it was longer
    isValid = false;
  }
  //   }

  if (isMissingStuff && isValid) {
    console.log(`Missing required values: ${chunk}`);
  }
  return isValid;
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
      //   console.log(data);
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
      //   console.log(data);
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
