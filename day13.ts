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

function isNumber(n: any): n is number {
  return typeof n === "number" && !Number.isNaN(n);
}

function compare(left: List|number, right: List|number): Order {
  if (isNumber(left)) {
    if (isNumber(right)) {
      if (left < right) {
        return Order.Good;
      } else if (right < left) {
        return Order.Bad;
      }
      return Order.Indifferent;
    }
    return compare([left], right);
  } else {
    if (isNumber(right)) {
      return compare(left, [right]);
    }
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
    return (left.length < right.length) ? Order.Good : Order.Indifferent;
  }
}

function part1(inp: Pair[]): number {
  return inp.reduce(
    (t, [left, right], i) => t
      + ((compare(left, right) === Order.Good) ? i + 1 : 0),
    0
  );
}

function part2(inp: Pair[]): number {
  const all = inp.flat(1);
  const two: List = [[2]];
  const six: List = [[6]];
  all.push(two, six);
  all.sort(compare);
  // Note: pointer equality
  return (all.findIndex(x => x === two) + 1)
    * (all.findIndex(x => x === six) + 1);
}

export default function main(inFile: string, trace: boolean) {
  const inp: Pair[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
