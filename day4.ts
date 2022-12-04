#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function part1(inp: number[][][]): number {
  let count = 0;
  for (const [[a, b], [c, d]] of inp) {
    if ((a >= c && b <= d) || (c >= a && d <= b)) {
      count++;
    }
  }
  return count;
}

function part2(inp: number[][][]): number {
  let count = 0;
  for (const [[a, b], [c, d]] of inp) {
    if (a <= c ? (c <= b) : (a <= d)) {
      count++;
    }
  }
  return count;
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][][] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
