#!/usr/bin/env node --loader ts-node/esm
import { Heap } from "heap-js";
import Utils from "./utils.js"; // Really .ts

type Point = [x: number, y: number, z: number];

function neighbors([i, j, k]: Point, min: Point, max: Point): Point[] {
  const ret: Point[] = [
    [i + 1, j, k], [i - 1, j, k],
    [i, j + 1, k], [i, j - 1, k],
    [i, j, k + 1], [i, j, k - 1],
  ];
  // Stay inside the min,max bounding box
  return ret.filter(
    p => p.reduce((t, v, i) => t && v >= min[i] && v <= max[i], true)
  );
}

function part1(inp: Point[], on: Set<string>, min: Point, max: Point): number {
  // This was so much slower than after the insight from part 2, but
  // I thought it was elegant, here it is in a comment:
  // const faces = new Sequence(inp)
  //   .combinations(2)
  //   .filter(([a, b]) => touch(a, b))
  //   .count();
  // return (inp.length * 6) - (2 * faces);

  let count = 0;
  for (const p of inp) {
    for (const n of neighbors(p, min, max)) {
      if (!on.has(n.toString())) {
        // If the neighbor isn't on, it must be on the surface.
        count++;
      }
    }
  }
  return count;
}

function part2(inp: Point[], on: Set<string>, min: Point, max: Point): number {
  // Flood from one corner.  Anything we can touch on the straight axes is a
  // candidate, but stop when you hit the edge of the bounding box, when you
  // get to a voxel that is on, or when you get to somewhere you've been.
  const outside = new Set<string>();
  const q = new Heap<Point>(() => 0);
  q.push(min);
  for (const p of q) {
    const s = p.toString();
    if (!on.has(s) && !outside.has(s)) {
      outside.add(s);
      q.push(...neighbors(p, min, max));
    }
  }

  let count = 0;
  for (const p of inp) {
    for (const n of neighbors(p, min, max)) {
      // If one of the faces is touching the outside, count it.
      if (outside.has(n.toString())) {
        count++;
      }
    }
  }
  return count;
}

export default function main(inFile: string, trace: boolean) {
  const inp: Point[] = Utils.parseFile(inFile, undefined, trace);
  const on = new Set<string>(inp.map(i => i.toString()));
  let min: Point = [Infinity, Infinity, Infinity];
  let max: Point = [-Infinity, -Infinity, -Infinity];
  for (const p of inp) {
    min = min.map((m, i) => Math.min(m, p[i] - 1)) as Point;
    max = max.map((m, i) => Math.max(m, p[i] + 1)) as Point;
  }

  return [part1(inp, on, min, max), part2(inp, on, min, max)];
}

Utils.main(import.meta.url, main);
