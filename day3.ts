#!/usr/bin/env node --loader ts-node/esm
import { Sequence } from "./sequence.js";
import Utils from "./utils.js"; // Really .ts

const PRIORITIES: Record<string, number> = {};
const a = "a".charCodeAt(0);
const A = "A".charCodeAt(0);
for (let i = 0; i < 26; i++) {
  PRIORITIES[String.fromCharCode(a + i)] = i + 1;
  PRIORITIES[String.fromCharCode(A + i)] = i + 27;
}

function intersect<T>(s: T[], ...others: T[][]) {
  const os = others.map(o => new Set(o));
  return s.filter(t => os.every(o => o.has(t)));
}

function part1(inp: number[][]): number {
  return inp.reduce((t, v) => {
    const half = v.length / 2;
    return t + intersect(v.slice(0, half), v.slice(half))[0];
  }, 0);
}

function part2(inp: number[][]): number {
  const s = new Sequence(inp);
  return s.chunks(3).reduce((t, [x, y, z]) => t + intersect(x, y, z)[0], 0);
}

export default function main(inFile: string, trace: boolean) {
  const inp: string[][] = Utils.parseFile(inFile, undefined, trace);
  const priorities = inp.map(s => s.map(c => PRIORITIES[c]));
  return [part1(priorities), part2(priorities)];
}

Utils.main(import.meta.url, main);
