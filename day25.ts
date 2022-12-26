#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

const s2n: Record<string, number> = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": -1,
  "=": -2,
};

const n2s: Record<string, string> = {
  "-2": "=",
  "-1": "-",
  "0": "0",
  "1": "1",
  "2": "2",
};

function snafuToNumber(snafu: string): number {
  let ret = 0;
  for (const c of snafu) {
    ret = (5 * ret) + s2n[c];
  }
  return ret;
}

function numberToSnafu(num: number): string {
  let ret = "";
  let carry = 0;
  while (num > 0) {
    const dm = Utils.divmod(num, 5);
    const d = dm[0];
    let m = dm[1];
    m += carry;
    if (m > 2) {
      carry = 1;
      m -= 5;
    } else {
      carry = 0;
    }
    ret = n2s[m] + ret;
    num = d;
  }
  if (carry) {
    ret = n2s[carry] + ret;
  }
  return ret;
}

function part1(inp: string[]): string {
  const total = inp.map(snafuToNumber).reduce((t, v) => t + v);
  console.log(total);
  return numberToSnafu(total);
}

function part2(inp: string[]): number {
  return inp.length;
}

export default function main(inFile: string, trace: boolean) {
  const inp: string[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
