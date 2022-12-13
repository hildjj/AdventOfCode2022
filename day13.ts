#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

type List = (number|List)[];
type Pair = [List, List];

// Choose constants so that sort works for free.
enum Order {
  Good = -1,
  Indifferent = 0,
  Bad = 1
}

function compare(left: List|number, right: List|number): Order {
  if (typeof left === "number") {
    if (typeof right === "number") {
      if (left < right) {
        return Order.Good;
      } else if (right < left) {
        return Order.Bad;
      }
      return Order.Indifferent;
    } else {
      return compare([left], right);
    }
  } else {
    if (typeof right === "number") {
      return compare(left, [right]);
    } else {
      for (let i = 0; i < left.length; i++) {
        // If the right list runs out of items first, the inputs are not in
        // the right order.
        if (i >= right.length) {
          return Order.Bad;
        }
        const comp = compare(left[i], right[i]);
        if (comp !== Order.Indifferent) {
          return comp;
        }
      }
      // If the left list runs out of items first, the inputs are in the right
      // order.
      return (left.length === right.length) ? Order.Indifferent : Order.Good;
    }
  }
}

function part1(inp: Pair[]): number {
  let total = 0;
  for (const [i, [left, right]] of inp.entries()) {
    if (compare(left, right) === Order.Good) {
      total += i + 1;
    }
  }
  return total;
}

function part2(inp: Pair[]): number {
  const all = inp.flat(1);
  const two: List = [[2]];
  const six: List = [[6]];
  all.push(two);
  all.push(six);
  all.sort((a, b) => compare(a, b));
  return (all.findIndex(x => x === two) + 1)
    * (all.findIndex(x => x === six) + 1);
}

export default function main(inFile: string, trace: boolean) {
  const inp: Pair[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
