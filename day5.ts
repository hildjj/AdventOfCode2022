#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

// Parser outputs this:
interface Plan {
  stacks: string[][];
  moves: number[][];
}

function part1(inp: Plan): string {
  const stacks = Utils.deepCopy(inp.stacks);
  for (const [size, from, to] of inp.moves) {
    const crates = stacks[from - 1].splice(0, size);
    crates.reverse();
    stacks[to - 1].splice(0, 0, ...crates);
  }
  return stacks.map(s => s[0]).join("");
}

function part2(inp: Plan): string {
  const stacks = Utils.deepCopy(inp.stacks);
  for (const [size, from, to] of inp.moves) {
    const crates = stacks[from - 1].splice(0, size);
    stacks[to - 1].splice(0, 0, ...crates);
  }
  return stacks.map(s => s[0]).join("");
}

export default function main(inFile: string, trace: boolean) {
  const inp: Plan = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
