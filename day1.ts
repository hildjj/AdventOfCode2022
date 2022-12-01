#!/usr/bin/env node --loader ts-node/esm
import { NumberSequence } from "./sequence.js";
import Utils from "./utils.js"; // Really .ts

function part1(elves: number[]): number {
  return elves[0];
}

function part2(elves: number[]): number {
  return new NumberSequence(elves).take(3).sum();
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  const elves = inp.map(elf => elf.reduce((t, v) => t + v, 0));
  // Descending order
  elves.sort((a, b) => b - a);
  return [part1(elves), part2(elves)];
}

Utils.main(import.meta.url, main);
