import readInput from '../../utils/readInput';
import * as _ from 'lodash';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Enums/Types */
enum Operation {
  nop = 'nop',
  jmp = 'jmp',
  acc = 'acc',
}

enum ExitCode {
  EOF,
  DUPLICATE,
}

interface Instruction {
  operation: Operation;
  argument: number;
}

interface Result {
  exitCode: ExitCode;
  accumulator: number;
}

/* Common Functions */

const parse = (values: string[]): Instruction[] =>
  values.map((i) => {
    const [o, a] = i.split(' ');
    return {
      operation: o as Operation,
      argument: parseInt(a, 10),
    };
  });

class BootCode {
  private instructions: Instruction[];
  private duplicates = new Set();
  private accumulator = 0;
  private index = 0;
  private exitCode: ExitCode;

  private operations = {
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

  public run(): Result {
    this.setPotentialExitCode();

    if (this.exitCode !== undefined) {
      return {
        exitCode: this.exitCode,
        accumulator: this.accumulator,
      };
    }
    this.step();
    return this.run();
  }

  private setPotentialExitCode() {
    if (this.index >= this.instructions.length) {
      this.exitCode = ExitCode.EOF;
    } else if (this.duplicates.has(this.index)) {
      this.exitCode = ExitCode.DUPLICATE;
    }
  }

  private step() {
    this.duplicates.add(this.index);
    const { operation, argument } = this.instructions[this.index];
    this.operations[operation](argument);
  }
}

/* Problem Execution */

function part1(values: string[]) {
  return new BootCode(parse(values)).run();
}

const swapMap: Record<Operation, Operation> = {
  acc: Operation.acc,
  jmp: Operation.nop,
  nop: Operation.jmp,
};

const swap = (i: Instruction): Instruction => ({
  operation: swapMap[i.operation],
  argument: i.argument,
});
const toVerboseInstructions = (op: Instruction, i: number, instructions: Instruction[]) => ({ op, i, instructions });
const isSwappable = ({ op }) => op.operation === Operation.nop || op.operation === Operation.jmp;
const toSwappedRunResult = ({ i, instructions }) =>
  new BootCode([...instructions.slice(0, i), swap(instructions[i]), ...instructions.slice(i + 1)]).run();
const toRunResult = (ops: Instruction[]) => new BootCode(ops).run();
const firstSuccess = (result: Result) => result.exitCode == ExitCode.EOF;

function part2(values: string[]) {
  return parse(values).map(toVerboseInstructions).filter(isSwappable).map(toSwappedRunResult).find(firstSuccess);
}

/* Tests */

assert.deepStrictEqual(part1(input), { accumulator: 1331, exitCode: ExitCode.DUPLICATE });
assert.deepStrictEqual(part2(input), { accumulator: 1121, exitCode: ExitCode.EOF });

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
