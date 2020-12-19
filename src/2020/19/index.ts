import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const [rules, messages] = rawInput.split('\n\n');

/* Functions */

function parseRules() {
  const ruleMap = new Map<string, string>();
  rules.split('\n').forEach((value) => {
    const [key, ruleText] = value.split(': ');
    ruleMap.set(key, ruleText);
  });
  return ruleMap;
}

function part1(rulesToParse: string, messagesToParse: string): number {
  const ruleMap = parseRules();

  // Do it
  //   const startingRule = ruleMap.get('0');
  //   console.log(startingRule);
  let count = 0;
  // TODO just 1 for now
  messagesToParse
    .split('\n')

    // .slice(0, 1)
    .forEach((message) => {
      //   messagesToParse.split('\n').forEach((message) => {
      const isPass = processRuleHelper(ruleMap, ruleMap.get('0'), message);
      if (isPass) {
        count += 1;
      }
    });

  //   console.log(ruleMap);
  return count;
}

// function processRule(ruleMap: Map<string, string>, ruleKey: string, message: string, i = 0): boolean {

const stringMatch = /"(\w+)"/;

function processRuleHelper(ruleMap: Map<string, string>, ruleSegment: string, message: string, index = 0): boolean {
  const ruleResult = processRule(ruleMap, ruleSegment, message, index);
  //   console.log(`Got ${ruleResult} matches on ${message}`);
  return message.length === ruleResult;
}

function processRule(ruleMap: Map<string, string>, ruleSegment: string, message: string, index = 0): number {
  //   console.log(`\n Processing rule: [${ruleSegment}] at index: ${index}`);

  const match = stringMatch.exec(ruleSegment);
  if (match) {
    const [_, char] = match;
    if (message[index] === char) {
      //   console.log(`Rule ${ruleSegment} matches message: ${message[index]} at ${char} and index ${index}`);
      return 1;
      //   if (message.length - 1 == index) {
      //     return true;
      //   }
      //   } else {
      //     // Process next step
      //     console.log(`Full text not matched, trying index ${index + 1}`);
      //     return processRule(ruleMap, ruleSegment, message, index + 1);
      //   }
    } else {
      //   console.log(`${message[index]} DOES NOT MATCH ${char}`);
      //   console.log(`Rule ${ruleSegment} MISMATCH message: ${message[index]} at ${char} and index ${index}`);
      return 0;
    }
    //   } else if (ruleSegment.includes(' | ')) {
    //split and try both paths
    // return ruleSegments.some((segment) => processRule(ruleMap, segment, messageSegment));
  } else {
    let matches = 0;
    ruleSegment.split(' | ').forEach((segment) => {
      if (segment.length != ruleSegment.length) {
        // console.log(`Checking Segment ${segment} of ${ruleSegment}:`);
      }
      const currentMatches = segment.split(' ').reduce((acc, curr, i) => {
        // console.log(`Checking ${curr} at index ${i}`);
        return acc + processRule(ruleMap, ruleMap.get(curr), message, index + acc);
      }, 0);
      if (currentMatches > matches) {
        matches = currentMatches;
      }
    });
    return matches;
  }
  //     const ruleSegments = ruleSegment.split(' | ');
  //     return ruleSegments.some((segment) => {
  //         processRule(ruleMap, segment, messageSegment))};
  //       // Need to drive deeper
  //     //   return processRule(ruleMap, rulese)
  //   return ruleSegment.split(' ').reduce((acc, curr) => {
  //     return acc && processRuleOld(ruleMap, curr, message);
  //   }, true);
  //   }

  //   if (messageSegment.length === 1) {
  //     const match = stringMatch.exec(ruleSegment);
  //   }
}

function processRuleOld(ruleMap: Map<string, string>, ruleKey: string, message: string, i = 0): boolean {
  // TODO break all into segments

  // if only 1 segment

  // if a "x" match, return true

  const rule = ruleMap.get(ruleKey);
  //   console.log('Testing rule ' + rule);
  const match = stringMatch.exec(rule);
  // If at an end node
  if (match) {
    const [_, chars] = match;
    // TODO optimize this so it matches from the start
    // increment count of charsuccesses?
    // return message.indexOf(chars) === 0;

    // Todo shrink message length as it's being matched
    return message.includes(chars);
  } else {
    // if has |, split and return either
    const ruleSegments = rule.split(' | ');
    return ruleSegments.some((segment) => processSingleRuleDeep(ruleMap, segment, message));
    // return processSingleRuleDeep(ruleMap, rule, message);
    // Likely more rules to follow
  }
}

// Ors already handled
function processSingleRuleDeep(ruleMap: Map<string, string>, ruleSegment: string, message: string): boolean {
  return ruleSegment.split(' ').reduce((acc, curr) => {
    return acc && processRuleOld(ruleMap, curr, message);
  }, true);
  // return
}

function part2(values: number[]): number {
  return 0;
}

/* Tests */

const ruleMap = parseRules();
// assert.strictEqual(processRuleHelper(ruleMap, '0', 'ababbb'), true);
// assert.strictEqual(processRuleHelper(ruleMap, '0', 'abbbab'), true);
// assert.strictEqual(processRuleHelper(ruleMap, '0', 'bababa'), false);
// assert.strictEqual(processRuleHelper(ruleMap, '0', 'aaabbb'), false);
// assert.strictEqual(processRuleHelper(ruleMap, '0', 'aaaabbb'), false);

// assert.strictEqual(part2([1, -1]), 0);

/* Results */

console.time('Time');
const resultPart1 = part1(rules, messages);
// const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
