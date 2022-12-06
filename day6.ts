#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function findMarker(inp: string[], len: number): number {
  // The first len chars will dup with the first character.
  const q = Array.from(new Array(len), () => inp[0]);
  let count = 1;
  for (const c of inp) {
    q.shift();
    q.push(c);
    if (new Set(q).size === len) {
      return count;
    }
    count++;
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
