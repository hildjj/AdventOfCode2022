#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

const [ROCK, PAPER, SCISSORS] = [0, 1, 2];
const WIN = [SCISSORS, ROCK, PAPER]; // ROCK beats SCISSORS
const LOSE = [PAPER, SCISSORS, ROCK]; // ROCK loses to PAPER
const SCORES = [0, 3, 6];

function part1(inp: number[][]): number {
  let score = 0;
  for (const [ABC, XYZ] of inp) {
    score += XYZ + 1;
    if (ABC === XYZ) { // Tie
      score += 3;
    } else if (WIN[XYZ] === ABC) { // Win
      score += 6;
    }
    // Otherwise lose
  }
  return score;
}

function part2(inp: number[][]): number {
  return inp.reduce((t, [ABC, XYZ]) => t
    + SCORES[XYZ] + 1
    + [WIN[ABC], ABC, LOSE[ABC]][XYZ]
  , 0);
}

export default function main(inFile: string, trace: boolean) {
  // Parse inFile into an array of [ABC, XYZ], where each is 0-2.
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
