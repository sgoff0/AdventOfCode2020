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
  return messagesToParse
    .split('\n')
    .reduce((acc, message) => acc + (isMessageValid(ruleMap, ruleMap.get('0'), message) ? 1 : 0), 0);
}

function isMessageValid(ruleMap: Map<string, string>, ruleSegment: string, message: string): boolean {
  return getRuleMessageMatchCount(ruleMap, ruleSegment, message) === message.length;
}

function getRuleMessageMatchCount(
  ruleMap: Map<string, string>,
  ruleSegment: string,
  message: string,
  index = 0,
): number {
  const match = /"(\w+)"/.exec(ruleSegment);
  if (match) {
    return message[index] === match[1] ? 1 : 0;
  } else {
    return ruleSegment
      .split(' | ')
      .map((segment) => {
        return segment.split(' ').reduce((acc, curr) => {
          return acc + getRuleMessageMatchCount(ruleMap, ruleMap.get(curr), message, index + acc);
        }, 0);
      })
      .reduce((prev, curr) => Math.max(prev, curr));
  }
}

function part2(values: number[]): number {
  return 0;
}

/* Tests */

// const ruleMap = parseRules();
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
assert.strictEqual(part1(rules, messages), 182);
