import readInput from '../../utils/readInput';
import * as _ from 'lodash';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Types */
enum Operation {
  nop = 'nop',
  jmp = 'jmp',
  acc = 'acc',
}
interface Instruction {
  operation: Operation;
  argument: number;
}

interface ComputerResponse {
  earlyAbort: boolean;
  accumulator: number;
}

/* Util Functions */
const parse = (values: string[]): Instruction[] =>
  values.map((i) => {
    const [o, a] = i.split(' ');
    return {
      operation: o as Operation,
      argument: parseInt(a, 10),
    };
  });

const swapMap: Record<Operation, Operation> = {
  acc: Operation.acc,
  jmp: Operation.nop,
  nop: Operation.jmp,
};

const swap = (i: Instruction): Instruction => ({
  operation: swapMap[i.operation],
  argument: i.argument,
});

/* Brains */

class Computer {
  instructions: Instruction[];
  duplicates = new Set();
  accumulator = 0;
  index = 0;
  earlyAbort = false;

  operations = {
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

  run(): ComputerResponse {
    while (this.index < this.instructions.length && !this.failOnDuplicate()) {
      this.step();
    }
    return {
      earlyAbort: this.earlyAbort,
      accumulator: this.accumulator,
    };
  }

  step() {
    const { operation, argument } = this.instructions[this.index];
    this.operations[operation](argument);
  }

  failOnDuplicate() {
    if (this.duplicates.has(this.index)) {
      this.earlyAbort = true;
      return true;
    }
    this.duplicates.add(this.index);
    return false;
  }
}

function part1(values: string[]) {
  return new Computer(parse(values)).run();
}

const toVerboseInstructions = (op: Instruction, i: number, instructions: Instruction[]) => ({ op, i, instructions });
const isSwappable = ({ op }) => op.operation === Operation.nop || op.operation === Operation.jmp;
const toSwappedRunResult = ({ i, instructions }) =>
  new Computer([...instructions.slice(0, i), swap(instructions[i]), ...instructions.slice(i + 1)]).run();
const toRunResult = (ops: Instruction[]) => new Computer(ops).run();
const firstSuccess = (result: ComputerResponse) => result.earlyAbort == false;

function part2(values: string[]) {
  return parse(values).map(toVerboseInstructions).filter(isSwappable).map(toSwappedRunResult).find(firstSuccess);
}

// .map(toSwappedInstruction)
// .map(toRunResult)
// const toSwappedInstruction = ({ i, instructions }) => [
//   ...instructions.slice(0, i),
//   swap(instructions[i]),
//   ...instructions.slice(i + 1),
// ];
// const toRunResult = (ops: Instruction[]) => new Computer(ops).run();

/* Tests */

assert.deepStrictEqual(part1(input), { accumulator: 1331, earlyAbort: true });
assert.deepStrictEqual(part2(input), { accumulator: 1121, earlyAbort: false });

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);

/* Original way I solved */

// function run(parsed: Instruction[]) {
//   const dupliateChecks: number[] = parsed.map((i) => 0);
//   let accumulator = 0;
//   let earlyAbort = false;

//   for (let i = 0; i < parsed.length; ) {
//     dupliateChecks[i] += 1;
//     if (dupliateChecks[i] > 1) {
//       earlyAbort = true;
//       return {
//         earlyAbort,
//         accumulator,
//       };
//     }
//     if (parsed[i].operation === 'nop') {
//       // do nothing
//       i += 1;
//     } else if (parsed[i].operation == 'acc') {
//       accumulator += parsed[i].argument;
//       i += 1;
//     } else if (parsed[i].operation === 'jmp') {
//       i += parsed[i].argument;
//     }
//   }

//   return {
//     accumulator,
//     earlyAbort,
//   };
// }
