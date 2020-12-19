import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';
import { memoize } from '../../utils/memoize';

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

function isMessageValid(ruleMap: Map<string, string>, ruleSegment: string, message: string): boolean {
  return getRuleMessageMatchCount(ruleMap, ruleSegment, message) === message.length;
}
// // const memoizedMatchRule = memoize(matchRule, cache);

// function cachedMatch(ruleNumber: string, message: string, i: number) {
//   const key = JSON.stringify({ ruleNumber, message, i });
//   return cache.get(key);
//   // if (cached) {
//   //   return cached;
//   // } else {
//   //   const result = f(...args);
//   //   cache.set(hash, result);
//   //   return result;
//   // }
// }
let cacheHit = 0;

function getRuleMessageMatchCount(
  ruleMap: Map<string, string>,
  ruleSegment: string,
  message: string,
  depth = 0,
): number {
  const match = /"(\w+)"/.exec(ruleSegment);
  if (match) {
    return message[0] === match[1] ? 1 : 0;
  } else if (depth > 100) {
    // brute force way to abort?
    return 0;
  } else {
    const ruleValue = ruleSegment
      .split(' | ')
      .map((segment) => {
        const segmentValue = segment.split(' ').reduce((acc, curr, i, array) => {
          const key = `${curr}:${message.slice(acc)}`;
          if (cache.has(key)) {
            cacheHit += 1;
            return acc + cache.get(key);
          } else {
            const matchCount = getRuleMessageMatchCount(ruleMap, ruleMap.get(curr), message.slice(acc), depth + 1);
            cache.set(key, matchCount);
            if (matchCount === 0) {
              array.splice(0, array.length); // ugly hack to early return early by removing all elements from array we're reducing
            }
            return acc + matchCount;
          }
        }, 0);
        return segmentValue;
      })
      .reduce((prev, curr) => Math.max(prev, curr));
    return ruleValue;
  }
}

const cache = new Map<string, number>();
function part1(raw: string): number {
  const { ruleMap, messages } = parseRules(raw);
  cache.clear();
  // return messages.reduce((acc, message) => acc + (isMessageValid(ruleMap, ruleMap.get('0'), message) ? 1 : 0), 0);
  return messages.filter((message) => isMessageValid(ruleMap, ruleMap.get('0'), message)).length;
}

function part2(raw: string): number {
  const { ruleMap, messages } = parseRules(raw);
  cache.clear();
  ruleMap.set('8', '42 | 42 8');
  ruleMap.set('11', '42 31 | 42 11 31');
  // return messages.reduce((acc, message) => acc + (isMessageValid(ruleMap, ruleMap.get('0'), message) ? 1 : 0), 0);
  return messages.filter((message) => isMessageValid(ruleMap, ruleMap.get('0'), message)).length;
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
cacheHit = 0;
const resultPart1 = part1(rawInput);
const resultPart2 = part2(rawInput);
console.timeEnd('Time');
console.log('Cache Hits: ', cacheHit);

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2); // 458 is too high
assert.strictEqual(part1(rawInput), 182);
