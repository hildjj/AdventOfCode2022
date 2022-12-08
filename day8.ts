#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function part1(inp: number[][]): number {
  const height = inp.length;
  const width = inp[0].length;
  const visible: number[][] = inp.map((row, i) => row.map(
    (_, j) => (
      (i === 0)             // Top edge
      || (j === 0)          // Left edge
      || (i === height - 1) // Bottom edge
      || (j === width - 1)  // Right edge
    )
      ? 1
      : 0
  ));

  for (let i = 1; i < height - 1; i++) {
    // LtoR
    let max = -Infinity;
    for (let j = 0; j < height - 1; j++) {
      if (inp[i][j] > max) {
        max = inp[i][j];
        visible[i][j] = 1;
      }
    }
    // RtoL
    max = -Infinity;
    for (let j = width - 1; j > 0; j--) {
      if (inp[i][j] > max) {
        max = inp[i][j];
        visible[i][j] = 1;
      }
    }
  }

  // TtoB
  for (let j = 1; j < width - 1; j++) {
    let max = -Infinity;
    for (let i = 0; i < height - 1; i++) {
      if (inp[i][j] > max) {
        max = inp[i][j];
        visible[i][j] = 1;
      }
    }

    // BtoT
    max = -Infinity;
    for (let i = height - 1; i > 0; i--) {
      if (inp[i][j] > max) {
        max = inp[i][j];
        visible[i][j] = 1;
      }
    }
  }

  return visible.reduce((t, row) => t + row.reduce((u, v) => u + v, 0), 0);
}

function part2(inp: number[][]): number {
  let max = -Infinity;
  const height = inp.length;
  const width = inp[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let up = 0;
      for (let k = i - 1; k >= 0; k--) {
        up++;
        if (inp[k][j] >= inp[i][j]) {
          break;
        }
      }
      let down = 0;
      for (let k = i + 1; k < height; k++) {
        down++;
        if (inp[k][j] >= inp[i][j]) {
          break;
        }
      }
      let left = 0;
      for (let k = j - 1; k >= 0; k--) {
        left++;
        if (inp[i][k] >= inp[i][j]) {
          break;
        }
      }
      let right = 0;
      for (let k = j + 1; k < width; k++) {
        right++;
        if (inp[i][k] >= inp[i][j]) {
          break;
        }
      }
      const score = left * right * up * down;
      max = Math.max(max, score);
    }
  }
  return max;
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
