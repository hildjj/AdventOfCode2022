#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

const WIN = [NaN, 3, 1, 2];
const LOSE = [NaN, 2, 3, 1];
const SCORES = [NaN, 0, 3, 6];

function part1(inp: number[][]): number {
  let score = 0;
  for (const [ABC, XYZ] of inp) {
    score += XYZ;
    if (ABC === XYZ) {
      score += 3;
    } else if (WIN[XYZ] === ABC) {
      score += 6;
    }
  }
  return score;
}

function part2(inp: number[][]): number {
  return inp.reduce((t, [ABC, XYZ]) => t
    + SCORES[XYZ]
    + [NaN, WIN[ABC], ABC, LOSE[ABC]][XYZ]
  , 0);
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
