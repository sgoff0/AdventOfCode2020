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

  //   console.log('Rules: ', validRanges);
  //   console.log('Failed: ', failure);
  const sum = failure.reduce((acc, curr) => acc + curr, 0);
  //   return 0;
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
  //   console.log(yours);

  const validTickets = nearbyRaw
    .split('\n')
    .slice(1)
    .map((line) => line.split(',').map(Number))
    .filter((ticket) => {
      return ticket.every((num) => {
        const isValid = rules.some(({ min, max, min2, max2 }) => {
          return (num >= min && num <= max) || (num >= min2 && num <= max2);
        });
        return isValid;
      });
    });

  //   console.log(validTickets);

  // Lists of tickets positions containing list of rules matched by index
  const ticketPositionIndexToRuleIndexes: number[][] = [];

  for (let ticketPosition = 0; ticketPosition < yours.length; ticketPosition++) {
    const ruleIndexesMatched: number[] = [];
    rules.forEach((rule, ruleIndex) => {
      const passed = didEveryonePassRuleIndex(validTickets, ticketPosition, ruleIndex, rules);
      if (passed) {
        ruleIndexesMatched.push(ruleIndex);
      }
    });
    ticketPositionIndexToRuleIndexes.push(ruleIndexesMatched);
  }

  // now figure out how we intersect.

  // if length one claim and filter all others

  console.log('All match: ', ticketPositionIndexToRuleIndexes);
  const resultMap = claim(ticketPositionIndexToRuleIndexes);
  console.log('Claim: ', resultMap);

  let sum = 1;
  let mult = 1;
  for (let i = 0; i < 6; i++) {
    // console.log('Match on ' + yours[resultMap[i]]);
    const allPassed = didEveryonePassRuleIndex(validTickets, resultMap[i], i, rules);
    console.log(
      `Multiplying ${yours[resultMap[i]]} at position ${
        resultMap[i]
      } which matched on rule ${i} since all passed: ${allPassed}`,
    );
    mult *= yours[resultMap[i]];
  }

  console.log('Final Value: ', mult);
  sum =
    yours[resultMap[0]] *
    yours[resultMap[1]] *
    yours[resultMap[2]] *
    yours[resultMap[3]] *
    yours[resultMap[4]] *
    yours[resultMap[5]];
  return sum;
}

function claim(matches: number[][], resultMap = {}) {
  let toClaim;
  let toClaimIndex;
  matches.some((value, i) => {
    // if only one possibility, let it take ownership
    if (value.length == 1) {
      toClaim = value[0];
      toClaimIndex = i;
      return true;
    }
  });

  if (toClaim != null) {
    // Remove anyone else who has claim now that it is taken
    // resultMap[toClaimIndex] = toClaim;
    resultMap[toClaim] = toClaimIndex;
    const removed = matches.map((numbers) => numbers.filter((value) => value != toClaim));
    return claim(removed, resultMap);
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

/* Tests */

// assert.strictEqual(part1(input), 23054);

// part 2 not 61, nor 952, nor 12483296203723
/* Results */

console.time('Time');
// const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

// console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
