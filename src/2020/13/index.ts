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
 * @param step How far we can jump forward between each check.  The trick here is to build the LCM as we go, each time isBusLeaving is true multiple ID * current step.
 * Example with demo input when isBusLeaving is true
 * Step by 1, find 7, now step by 7 (7 * 1)
 * Step by 7, find 13, now step by 91 (7 * 13)
 * Step by 91, find 59, now step by 5369 (59 * 91) aka (1 * 7 * 13 * 59)
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

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
