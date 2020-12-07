import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Globals */
// Parse ones into tree structure as I can reuse for both problems
const rootRE = /^(.*) bags contain (.*)/;
const childRE = /(\d+) (.*) bag/;
const nodes = {};

/* Functions */

const unique = (input: TreeNode[]): TreeNode[] => [...new Set(input)];

class TreeNode {
  name: string;
  descendents: TreeNode[];
  constructor(name: string) {
    this.name = name;
    this.descendents = [];
  }

  hasDescendent(name: string, depth = 0) {
    if (depth > 0 && this.name === name) {
      return true;
    } else {
      // No need to traverse dupliate children if we just want to know if one decendent exists
      return unique(this.descendents).some((child) => child.hasDescendent(name, depth + 1));
    }
  }

  getNestedBags(depth = 0) {
    const selfWorth = depth > 0 ? 1 : 0; // root is worth 0, all other bags count
    return this.descendents.reduce((p, c) => p + c.getNestedBags(depth + 1), 0) + selfWorth;
  }
}

function childToData(input: string) {
  const matches = childRE.exec(input);
  if (matches) {
    const [_, quantity, bag] = matches;
    return {
      quantity,
      bag,
    };
  } else {
    console.warn('No match on ' + input);
  }
  return null;
}

function getOrCreateNode(name: string): TreeNode {
  if (nodes[name] == null) {
    const retVal = new TreeNode(name);
    nodes[name] = retVal;
    return retVal;
  } else {
    return nodes[name];
  }
}

function rootToData(input: string): TreeNode {
  const matches = rootRE.exec(input);
  if (matches) {
    const [_, root, children] = matches;
    // console.log('Root: ' + root);

    const rootNode = getOrCreateNode(root);

    children.split(',').forEach((child) => {
      const childData = childToData(child);
      if (childData != null) {
        // console.log(`  Child data: ${childData?.bag} (${childData?.quantity})`);
        const childNode = getOrCreateNode(childData.bag);
        const quantity = parseInt(childData.quantity, 10);
        for (let i = 0; i < quantity; i++) {
          rootNode.descendents.push(childNode);
        }
      }
    });
    return rootNode;
  } else {
    console.warn('No match on ' + input);
    return null;
  }
}

function findBagCount(name: string) {
  let count = 0;
  //   Object.entries(nodes).forEach((node) => {
  for (const [key, node] of Object.entries(nodes)) {
    const myNode: TreeNode = node as any;
    // console.log('MyNode: ', myNode);
    if (myNode.hasDescendent(name)) {
      count += 1;
    }
    //   if (node.)
    // console.log(node.entries);
  }
  return count;
}

input.forEach((value) => {
  rootToData(value);
});

function part1(): number {
  const count = findBagCount('shiny gold');
  return count;

  // Use linked lists for tree traversal, sorta like airport problem
}

function part2(): number {
  const myNode: TreeNode = nodes['shiny gold'] as any;
  return myNode.getNestedBags();
  //   const count = findBagCount('shiny gold');
  //   return 0;
}

/* Tests */

assert.strictEqual(part1(), 355);
assert.strictEqual(part2(), 5312);

/* Results */

console.time('Time');
const resultPart1 = part1();
const resultPart2 = part2();
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
