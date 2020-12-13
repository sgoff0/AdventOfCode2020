import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

function part1(values: string[]): number {
  const departTimestamp = parseInt(values[0], 10);
  const busIDs = values[1]
    .split(',')
    .filter((val) => val != 'x')
    .map(Number);
  const { winner, time } = findEarliestDepartureAfterTime(busIDs, departTimestamp);
  return (time - departTimestamp) * winner;
}

function findEarliestDepartureAfterTime(busIDs: number[], time: number) {
  const winner = busIDs.find((id) => time % id == 0);
  if (!winner) {
    return findEarliestDepartureAfterTime(busIDs, time + 1);
  }
  return { winner, time };
}

function part2(values: string[]): number {
  const busIDs = values[1].split(',');
  return findConsecutiveDeparture(busIDs);
}

/**
 * Returns answer to the question What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?
 *
 * @param busIDs The list of positions, including 'x's
 * @param earliestTimestamp Timestamp all buses can leave
 * @param offset Index of a particular busID in the busIDs list
 * @param step Amount to increment earliestTimestamp by for each failed check.  Trick to problem is to use a variation on LCM of all previous matches.
 */
function findConsecutiveDeparture(busIDs: string[], earliestTimestamp = 0, offset = 0, step = 1) {
  if (offset >= busIDs.length) {
    return earliestTimestamp;
  } else if (busIDs[offset] == 'x') {
    return findConsecutiveDeparture(busIDs, earliestTimestamp, offset + 1, step);
  } else {
    const busID = parseInt(busIDs[offset], 10);
    const isBusLeaving = (earliestTimestamp + offset) % busID === 0;
    return isBusLeaving
      ? findConsecutiveDeparture(busIDs, earliestTimestamp, offset + 1, step * busID)
      : findConsecutiveDeparture(busIDs, earliestTimestamp + step, offset, step);
  }
}

assert.strictEqual(part1(input), 138);
assert.strictEqual(part2(input), 226845233210288);

const demoInput = '7,13,x,x,59,x,31,19'.split(',');
assert.strictEqual(findConsecutiveDeparture(demoInput), 1068781);

const trickExample1 = '7,13'.split(',');
assert.strictEqual(findConsecutiveDeparture(trickExample1), 77); // get first position of match
assert.strictEqual(findConsecutiveDeparture(trickExample1, 78), 168); // get second match
assert.strictEqual(findConsecutiveDeparture(trickExample1, 78), 7 * 13 + 77); // oh look, second match is just first match + LCM
assert.strictEqual(findConsecutiveDeparture(trickExample1, 169), 259); // get third match
assert.strictEqual(findConsecutiveDeparture(trickExample1, 169), 7 * 13 + 168); // Oh nice, third match - second match is LCM too
assert.strictEqual(findConsecutiveDeparture(trickExample1, 169), 7 * 13 + 7 * 13 + 77); // May as well just step by LCM (7 * 13)

const trickExample2 = '7,13,x,x,59'.split(',');
assert.strictEqual(findConsecutiveDeparture(trickExample2), 350); // get first position of match
assert.strictEqual(findConsecutiveDeparture(trickExample2, 351), 5719); // get second second match
assert.strictEqual(findConsecutiveDeparture(trickExample2, 351), 7 * 13 * 59 + 350); // Same holds true for matching for many numbers and LCM
assert.strictEqual(findConsecutiveDeparture(trickExample2, 5720), 11088); // get third match
assert.strictEqual(findConsecutiveDeparture(trickExample2, 5720), 7 * 13 * 59 + 7 * 13 * 59 + 350); // May as well just step by 7 * 13 * 59

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
