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

// Shift the rock left/right so that there are pos spaces to the left of it
export function shift(shape: Shape, pos: number): number[] {
  return shape[0].map(s => s << (7 - pos - shape[1]));
}

// Does the rock touch anything at this depth?
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

// Place the rock into the chamber at the given depth.
function stop(chamber: number[], rock: number[], depth: number) {
  const len = chamber.length;
  for (let i = rock.length - 1; i >= 0; i--) {
    chamber[len - depth--] |= rock[i];
  }
}

// Map out the top of the stack.  If this same pattern happens again,
// we will have found a loop.
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

type NumberFlexer = (
  rockNum: number,
  blow: number,
  chamber: number[]
) => [number, number];

function dropRocks(
  inp: number[],
  iterations: number,
  flexer: NumberFlexer
): number[] {
  const chamber: number[] = [ALL];
  let blow = 0;
  for (let rockNum = 0; rockNum < iterations; rockNum++) {
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
    [rockNum, blow] = flexer(rockNum, blow, chamber);
  }
  return chamber;
}

function part1(inp: number[]): number {
  const chamber = dropRocks(inp, 2022, (x, y) => [x, y]);
  return chamber.length - 1; // The bottom row, which we added manually
}

function part2(inp: number[]): number {
  const BIG = 1000000000000;
  const tops: Record<string, [
    rockNum: number, stackLen: number, oldBlow: number
  ]> = {};
  let root = NaN;
  const chamber = dropRocks(inp, BIG, (rockNum, blow, chamber) => {
    if (Number.isNaN(root)) {
      // Look for a cycle.
      const top = measureTop(chamber) + `-${blow}`;
      if (tops[top] !== undefined) {
        // If cycle found, run forward until there's a partial cycle left,
        // rather than repating yourself a large number of times.

        const [num, len, oldBlow] = tops[top];
        const times = Math.floor((BIG - num) / (rockNum - num));
        // Leave chamber as-is, but remove it's current length so when it
        // gets added back later it won't count.
        root = times * (chamber.length - len) + len - chamber.length;
        // Reset to the correct state for the last bits that will run
        // from the repeat point until the end.
        return [times * (rockNum - num) + num, oldBlow];
      } else {
        tops[top] = [rockNum, chamber.length, blow];
      }
    }
    return [rockNum, blow];
  });

  return root + chamber.length - 1;
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
