import readInput from '../../utils/readInput';
import * as _ from 'lodash';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

interface Parsed {
  instruction: string;
  value: number;
}
/* Functions */

function doIt(parsed: Parsed[]) {
  const dupliateChecks: number[] = parsed.map((i) => 0);
  let accumulator = 0;
  let earlyAbort = false;

  for (let i = 0; i < parsed.length; ) {
    dupliateChecks[i] += 1;
    if (dupliateChecks[i] > 1) {
      earlyAbort = true;
      return {
        earlyAbort,
        accumulator,
      };
    }
    if (parsed[i].instruction === 'nop') {
      // do nothing
      i += 1;
    } else if (parsed[i].instruction == 'acc') {
      accumulator += parsed[i].value;
      i += 1;
    } else if (parsed[i].instruction === 'jmp') {
      i += parsed[i].value;
    }
    // console.log(parsed[i]);
  }

  return {
    accumulator,
    earlyAbort,
  };
}

function parse(values: string[]) {
  return values.map((i) => {
    const [instruction, valueAsString] = i.split(' ');
    const value = parseInt(valueAsString, 10);
    return {
      instruction,
      value,
    };
  });
}

function part1(values: string[]) {
  return doIt(parse(values));
}

function part2(values: string[]) {
  const parsed = parse(values);

  for (let i = 0; i < values.length; i++) {
    let skip = false;
    const cloned = _.cloneDeep(parsed);
    if (cloned[i].instruction === 'nop') {
      cloned[i].instruction = 'jmp';
    } else if (cloned[i].instruction === 'jmp') {
      cloned[i].instruction = 'nop';
    } else {
      //skip
      skip = true;
    }

    if (!skip) {
      //   console.log('\nIndex ' + i);
      const result = doIt(cloned);

      if (result.earlyAbort == false) {
        return result;
      }
    }
  }
  return 0;
}

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
