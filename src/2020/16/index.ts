import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n\n');

/* Functions */

type MinMax = {
  min: number;
  max: number;
};
type MinMaxIndex = {
  min: number;
  max: number;
  index: number;
};
type MinMaxPosition = {
  min: number;
  max: number;
  //   index: number;
  min2: number;
  max2: number;
};

const re = /\s(\d+)-(\d+) or (\d+)-(\d+)$/;
function part1(values: string[]): number {
  const [rulesRaw, yoursRaw, nearby] = values;
  //   console.log(rules);

  const rules: MinMax[] = [];

  rulesRaw.split('\n').forEach((line) => {
    const match = re.exec(line);
    if (match) {
      const [_, min1, max1, min2, max2] = match;
      //   console.log(`Found ${min1} to ${max1} and ${min2} to ${max2}`);
      //   validRanges.push({ min: parseInt(min1, 10), max: parseInt(max1, 10) });
      //   validRanges.push({ min: +min2, max: +max2 });
      rules.push({ min: parseInt(min1, 10), max: parseInt(max1, 10) });
      rules.push({ min: +min2, max: +max2 });
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
        const isValid = rules.some(({ min, max }) => {
          return num >= min && num <= max;
        });
        // console.log(`Num ${num} isValid: ${isValid}`);
        if (!isValid) {
          failure.push(num);
        }
      });
    });

  const sum = failure.reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function part2(values: string[]): number {
  const [rulesRaw, yoursRaw, nearbyRaw] = values;

  const rules: MinMaxPosition[] = rulesRaw.split('\n').map((line, i) => {
    const match = re.exec(line);
    const [_, min1, max1, min2, max2] = match;
    return { min: +min1, max: +max1, min2: +min2, max2: +max2 };
  });

  const yours = yoursRaw.split('\n')[1].split(',').map(Number);

  const validTickets = nearbyRaw
    .split('\n')
    .slice(1)
    .map((line) => line.split(',').map(Number))
    .filter((ticket) => {
      return ticket.every((num) =>
        rules.some(({ min, max, min2, max2 }) => (num >= min && num <= max) || (num >= min2 && num <= max2)),
      );
    });

  // Index 0 is an array of all the rules position 0 passes and so on
  const ticketPositionIndexToRuleIndexes = yours.map((value, ticketPosition) => {
    return rules
      .map((rule, ruleIndex) => ({
        passed: didEveryonePassRuleIndex(validTickets, ticketPosition, ruleIndex, rules),
        ruleIndex,
      }))
      .filter(({ passed }) => passed === true)
      .map(({ ruleIndex }) => ruleIndex);
  });

  const claims = claimRuleForPositions(ticketPositionIndexToRuleIndexes);

  let product = 1;
  // Rules we care about (departure) are index 0 - 5
  for (let i = 0; i < 6; i++) {
    product *= yours[claims[i]];
  }
  //   const product = yours.slice(0, 6).reduce((acc, val, i, array) => (acc *= array[claims[i]]), 1);

  return product;
}

function claimRuleForPositions(matches: number[][], resultMap = {}) {
  let claimed = undefined;
  matches.some((value, i) => {
    if (value.length == 1) {
      claimed = { ruleIndex: value[0], ticketPosition: i };
      return true;
    }
  });

  if (claimed !== undefined) {
    const removed = matches.map((numbers) => numbers.filter((value) => value != claimed.ruleIndex));
    return claimRuleForPositions(removed, { ...resultMap, [claimed.ruleIndex]: claimed.ticketPosition });
  } else {
    return resultMap;
  }
}

function didEveryonePassRuleIndex(
  validTickets: number[][],
  position: number,
  ruleIndex: number,
  rules: MinMaxPosition[],
) {
  const { min, max, min2, max2 } = rules[ruleIndex];
  return validTickets.every((ticket) => {
    const num = ticket[position];
    return (num >= min && num <= max) || (num >= min2 && num <= max2);
  });
}

assert.strictEqual(part1(input), 23054);
assert.strictEqual(part2(input), 51240700105297);
/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
