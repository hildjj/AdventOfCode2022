#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function part1(elves: number[]): number {
  return Math.max(...elves);
}

function part2(elves: number[]): number {
  elves.sort((a, b) => b - a);
  return elves[0] + elves[1] + elves[2];
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  const elves = inp.map(elf => elf.reduce((t, v) => t + v, 0));
  return [part1(elves), part2(elves)];
}

Utils.main(import.meta.url, main);
