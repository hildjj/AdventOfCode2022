#!/usr/bin/env node --loader ts-node/esm
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Utils from "./utils.js"; // Really .ts

export type Shape = [mask:number[], width: number];
const ALL = 0b1111111;

export const shapes: Shape[] = [
  [[0b1111], 4],
  [[
    0b010,
    0b111,
    0b010,
  ], 3],
  [[
    0b001,
    0b001,
    0b111,
  ], 3],
  [[
    0b1,
    0b1,
    0b1,
    0b1,
  ], 1],
  [[
    0b11,
    0b11,
  ], 2],
];

export function print(chamber: number[], on = "#") {
  for (let i = chamber.length - 1; i >= 0; i--) {
    let line = "";
    for (let k = 6; k >= 0; k--) {
      line += (chamber[i] & (1 << k)) ? on : ".";
    }
    console.log(line);
  }
  console.log("-------\n");
}

export function shift(shape: Shape, pos: number): number[] {
  return shape[0].map(s => s << (7 - pos - shape[1]));
}

function touches(chamber: number[], rock: number[], depth: number): boolean {
  if (depth <= 0) {
    return false;
  }

  for (let i = rock.length - 1; i >= 0; i--) {
    if (chamber[chamber.length - depth--] & rock[i]) {
      return true;
    }
  }
  return false;
}

function stop(chamber: number[], rock: number[], depth: number) {
  const len = chamber.length;
  for (let i = rock.length - 1; i >= 0; i--) {
    chamber[len - depth--] |= rock[i];
  }
}

function measureTop(chamber: number[]): string {
  let all = 0;
  let depths = Array.from(new Array(7), () => Infinity);
  for (let depth = 0; depth < chamber.length; depth++) {
    // eslint-disable-next-line no-loop-func
    depths = depths.map((d, i): number => {
      const ishift = 1 << i;
      if (!(all & ishift) && (chamber[chamber.length - depth - 1] & ishift)) {
        all |= ishift;
        return depth;
      }
      return d;
    });
  }
  return depths.join(",");
}

function part1(inp: number[]): number {
  const chamber: number[] = [ALL];
  let blow = 0;
  for (let rockNum = 0; rockNum < 2022; rockNum++) {
    const rockShape = shapes[rockNum % shapes.length];
    let rockLeft = 2;
    chamber.push(0, 0, 0);

    for (let depth = 1; depth < chamber.length + 1; depth++) {
      // Blow
      const prevLeft = rockLeft;
      const b = inp[blow];
      blow = (blow + 1) % inp.length;

      rockLeft += b;
      rockLeft = Math.max(rockLeft, 0); // Left side
      rockLeft = Math.min(rockLeft, 7 - rockShape[1]); // Right side

      let s = shift(rockShape, rockLeft);
      if ((prevLeft !== rockLeft) && touches(chamber, s, depth - 1)) {
        // Blown into existing stuff, go back.
        s = shift(rockShape, prevLeft);
        rockLeft = prevLeft;
      }

      // Drop
      if (touches(chamber, s, depth)) {
        // Interferes, stop.
        stop(chamber, s, depth - 1);
        break;
      }
    }
    // Clear off any extra empties at the top.
    while (!chamber.at(-1)!) {
      chamber.pop();
    }
  }
  return chamber.length - 1; // The bottom row, which we added manually
}

function part2(inp: number[]): number {
  const chamber: number[] = [ALL];
  let blow = 0;
  const tops: Record<string, [
    rockNum: number, stackLen: number, oldBlow: number
  ]> = {};
  let root = NaN;
  for (let rockNum = 0; rockNum < 1000000000000; rockNum++) {
    const rockShape = shapes[rockNum % shapes.length];
    let rockLeft = 2;
    chamber.push(0, 0, 0);

    for (let depth = 1; depth < chamber.length + 1; depth++) {
      // Blow
      const prevLeft = rockLeft;
      const b = inp[blow];
      blow = (blow + 1) % inp.length;

      rockLeft += b;
      rockLeft = Math.max(rockLeft, 0); // Left side
      rockLeft = Math.min(rockLeft, 7 - rockShape[1]); // Right side

      let s = shift(rockShape, rockLeft);
      if ((prevLeft !== rockLeft) && touches(chamber, s, depth - 1)) {
        // Blown into existing stuff, go back.
        s = shift(rockShape, prevLeft);
        rockLeft = prevLeft;
      }

      // Drop
      if (touches(chamber, s, depth)) {
        // Interferes, stop.
        stop(chamber, s, depth - 1);
        break;
      }
    }
    // Clear off any extra empties at the top.
    while (!chamber.at(-1)!) {
      chamber.pop();
    }
    const top = measureTop(chamber) + `-${blow}`;
    if (Number.isNaN(root) && tops[top] !== undefined) {
      const [num, len, oldBlow] = tops[top];
      const times = Math.floor((1000000000000 - num) / (rockNum - num));
      rockNum = times * (rockNum - num) + num;
      // Leave chamber as-is, but remove it's current length so when it
      // gets added back later it won't count.
      root = times * (chamber.length - len) + len - chamber.length;
      blow = oldBlow;
    } else {
      tops[top] = [rockNum, chamber.length, blow];
    }
  }

  return root + chamber.length - 1;
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
