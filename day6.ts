#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function findMarker(inp: string[], len: number): number {
  // The first len chars will dup with the first character.
  for (let first = 0, last = len; last < inp.length; first++, last++) {
    if (new Set(inp.slice(first, last)).size === len) {
      return last;
    }
  }
  return NaN;
}

function part1(inp: string[]): number {
  return findMarker(inp, 4);
}

function part2(inp: string[]): number {
  return findMarker(inp, 14);
}

export default function main(inFile: string, trace: boolean) {
  const inp: string[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
