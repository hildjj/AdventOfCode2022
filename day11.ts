#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

type Operation = [string, string|number];

interface Monkey {
  monkey: number;
  items: number[];
  op: Operation;
  divisibleBy: number;
  t: number;
  f: number;
  count: number;
}

function monkeyToss(
  inp: Monkey[],
  rounds: number,
  reduce: (i: number) => number
): number {
  for (let i = 0; i < rounds; i++) {
    for (const m of inp) {
      for (const item of m.items) {
        const operand = (typeof m.op[1] === "string") ? item : m.op[1];
        const i = reduce((m.op[0] === "+") ? item + operand : item * operand);
        inp[(i % m.divisibleBy === 0) ? m.t : m.f].items.push(i);
        m.count++;
      }
      m.items = [];
    }
  }
  inp.sort((a, b) => b.count - a.count);

  return inp[0].count * inp[1].count;
}

function part1(inp: Monkey[]): number {
  return monkeyToss(inp, 20, i => Math.floor(i / 3));
}

function part2(inp: Monkey[]): number {
  const biggest = inp.map(m => m.divisibleBy).reduce((t, v) => t * v, 1);
  return monkeyToss(inp, 10000, i => i % biggest);
}

export default function main(inFile: string, trace: boolean) {
  // Ugh, my deepCopy isn't deep enough.
  const inp1: Monkey[] = Utils.parseFile(inFile, undefined, trace);
  const inp2: Monkey[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp1), part2(inp2)];
}

Utils.main(import.meta.url, main);
