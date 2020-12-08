import readInput from '../../utils/readInput';
import * as _ from 'lodash';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');
interface Instruction {
  operation: string;
  argument: number;
}

/* Functions */
function stringToInstructions(values: string[]): Instruction[] {
  return values.map((i) => {
    const [operation, argAsString] = i.split(' ');
    const argument = parseInt(argAsString, 10);
    return {
      operation,
      argument,
    };
  });
}

// Refactored way to solve
class Computer {
  instructions: Instruction[];

  duplicates = {};
  accumulator = 0;
  index = 0;
  earlyAbort = false;

  ops = {
    nop: (arg: number) => {
      this.index += 1;
    },
    jmp: (arg: number) => {
      this.index += arg;
    },
    acc: (arg: number) => {
      this.accumulator += arg;
      this.index += 1;
    },
  };

  constructor(instructions: Instruction[]) {
    this.instructions = instructions;
  }

  run() {
    while (this.index < this.instructions.length) {
      if (this.failOnDuplicate() === true) {
        break;
      }
      this.step();
    }

    return {
      earlyAbort: this.earlyAbort,
      accumulator: this.accumulator,
    };
  }

  failOnDuplicate() {
    this.duplicates[this.index] = (this.duplicates[this.index] || 0) + 1;
    if (this.duplicates[this.index] > 1) {
      this.earlyAbort = true;
      return true;
    }
    return false;
  }

  step() {
    const { operation, argument } = this.instructions[this.index];
    this.ops[operation](argument);
  }
}

// Original way I solved
function run(parsed: Instruction[]) {
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
    if (parsed[i].operation === 'nop') {
      // do nothing
      i += 1;
    } else if (parsed[i].operation == 'acc') {
      accumulator += parsed[i].argument;
      i += 1;
    } else if (parsed[i].operation === 'jmp') {
      i += parsed[i].argument;
    }
    // console.log(parsed[i]);
  }

  return {
    accumulator,
    earlyAbort,
  };
}

function part1(values: string[]) {
  //   return run(stringToInstructions(values));
  return new Computer(stringToInstructions(values)).run();
}

function part2(values: string[]) {
  const parsed = stringToInstructions(values);

  for (let i = 0; i < values.length; i++) {
    let skip = false;
    const cloned: Instruction[] = _.cloneDeep(parsed);
    if (cloned[i].operation === 'nop') {
      cloned[i].operation = 'jmp';
    } else if (cloned[i].operation === 'jmp') {
      cloned[i].operation = 'nop';
    } else {
      skip = true;
    }

    if (!skip) {
      const result = new Computer(cloned).run();
      if (result.earlyAbort == false) {
        return result;
      }
    }
  }
  return 0;
}

/* Tests */

assert.deepStrictEqual(part1(input), { accumulator: 1331, earlyAbort: true });
assert.deepStrictEqual(part2(input), { accumulator: 1121, earlyAbort: false });

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
