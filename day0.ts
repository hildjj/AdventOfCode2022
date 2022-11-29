#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function part1(inp: number[]): number {
  return inp.length;
}

function part2(inp: number[]): number {
  return inp.length;
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
