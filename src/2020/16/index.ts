import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n\n');

/* Functions */

type MinMax = {
  min: number;
  max: number;
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

  const rules: MinMax[] = [];

  rulesRaw.split('\n').forEach((line) => {
    const match = re.exec(line);
    if (match) {
      const [_, min1, max1, min2, max2] = match;
      rules.push({ min: parseInt(min1, 10), max: parseInt(max1, 10) });
      rules.push({ min: +min2, max: +max2 });
    }
  });

  const failure = [];
  nearby
    .split('\n')
    .slice(1)
    .map((line) => line.split(',').map(Number))
    .forEach((numbers) => {
      numbers.forEach((num) => {
        const isValid = rules.some(({ min, max }) => {
          return num >= min && num <= max;
        });
        if (!isValid) {
          failure.push(num);
        }
      });
    });

  return failure.reduce((acc, curr) => acc + curr, 0);
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

  // As an example array n is array of numbers represnting position n.  The second array are all the rules (by index) passed by this positon.
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

  // Rules we care about (departure) are index 0 - 5
  return yours.slice(0, 6).reduce((acc, val, i) => (acc *= yours[claims[i]]), 1);
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
