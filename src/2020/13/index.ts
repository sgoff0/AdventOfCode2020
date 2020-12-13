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
  const data = values[1].split(',');
  let time = 0; // per rules could probably start at 100000000000000, but just in case leaving 0
  let step = 1;
  for (let i = 0; i < data.length; ) {
    if (data[i] == 'x') i++;
    else {
      const busId = parseInt(data[i], 10);
      if ((time + i) % busId == 0) {
        // Secret sauce....
        // Stepping by 1 isn't efficient, this is to find least common multiple (LCM)
        // Example with demo input:
        // if stepping by 1 and find time % 7 is 0, new LCM is 7 (1 * 7)
        // now if stepping by 7 and find time % 13 is 0, new LCM is 91 (7 * 13)
        // now if stepping by 91 and find time % 59 is 0, next step is 5369 (91 * 59)
        // and so on... This way I don't have to know LCM function for many numbers AND I can easily start the check on proper index
        step *= busId;
        i += 1;
      } else {
        time += step;
      }
    }
  }
  return time;
}

assert.strictEqual(part1(input), 138);
assert.strictEqual(part2(input), 226845233210288);

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
