import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const demoInput = readDemoInput();

/* Functions */

function parseRules(raw: string) {
  const ruleMap = new Map<string, string>();
  const [rules, messages] = raw.split('\n\n');
  rules.split('\n').forEach((value) => {
    const [key, ruleText] = value.split(': ');
    ruleMap.set(key, ruleText);
  });
  return { ruleMap, messages: messages.split('\n') };
}

function part1(raw: string): number {
  const { ruleMap, messages } = parseRules(raw);
  return messages.reduce((acc, message) => acc + (isMessageValid(ruleMap, ruleMap.get('0'), message) ? 1 : 0), 0);
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

function part2(raw: string): number {
  const { ruleMap, messages } = parseRules(raw);
  ruleMap.set('8', '42 | 42 8');
  ruleMap.set('11', '42 31 | 42 11 31');
  return messages.reduce((acc, message) => acc + (isMessageValid(ruleMap, ruleMap.get('0'), message) ? 1 : 0), 0);
}

/* Tests */

const { ruleMap } = parseRules(demoInput);
assert.strictEqual(isMessageValid(ruleMap, '0', 'ababbb'), true);
assert.strictEqual(isMessageValid(ruleMap, '0', 'abbbab'), true);
assert.strictEqual(isMessageValid(ruleMap, '0', 'bababa'), false);
assert.strictEqual(isMessageValid(ruleMap, '0', 'aaabbb'), false);
assert.strictEqual(isMessageValid(ruleMap, '0', 'aaaabbb'), false);

/* Results */

console.time('Time');
const resultPart1 = part1(rawInput);
// const resultPart2 = part2(rawInput);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
// console.log('Solution to part 2:', resultPart2);
assert.strictEqual(part1(rawInput), 182);
