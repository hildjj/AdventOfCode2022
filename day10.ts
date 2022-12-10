#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts
import { ocr } from "./ocr.js";

type Op = Noop | Addx
type Noop = ["noop"];
type Addx = ["addx", number];
type OpAction = (x: number, operand: number) => number;
type StatusCallback = (cycle: number, x: number) => void;

const OpInfo: Record<string, OpAction[]> = {
  noop: [x => x],
  addx: [x => x, (x, y) => x + y],
  // More opcodes here, x => x for dead cycle
};

function run(prog: Op[], cycles: number, cb: StatusCallback) {
  let X = 1;
  let opNum = 0;
  let subOp = 0;
  for (let cycle = 1; cycle <= cycles; cycle++) {
    cb(cycle, X);
    if (subOp >= OpInfo[prog[opNum][0]].length) {
      subOp = 0;
      opNum++;
    }
    X = OpInfo[prog[opNum][0]][subOp++](X, prog[opNum][1] as number);
  }
}

function part1(inp: Op[]): number {
  const checks = new Set([20, 60, 100, 140, 180, 220]);
  let total = 0;
  run(inp, 220, (cycle, x) => {
    if (checks.has(cycle)) {
      total += x * cycle;
    }
  });

  return total;
}

function part2(inp: Op[]): string {
  const image: string[] = [];
  let line = "";
  run(inp, 240, (cycle, x) => {
    const pos = (cycle - 1) % 40;
    line += (Math.abs(pos - x) <= 1) ? "#" : " ";
    if (pos === 39) {
      image.push(line);
      line = "";
    }
  });
  return ocr(image);
}

export default function main(inFile: string, trace: boolean) {
  const inp: Op[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
