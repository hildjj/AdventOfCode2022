#!/usr/bin/env node --loader ts-node/esm
import { Heap } from "heap-js";
import StringBitSet from "./stringBitSet.js";
import Utils from "./utils.js"; // Really .ts

interface Valve {
  name: string;
  flow: number;
  outputs: string[];
}

type Valves = Record<string, Valve>;

function distance(paths: Record<string, number>, x: string, y: string): number {
  return paths[`${x}-${y}`] ?? Infinity;
}

// Floyd-Warshall.  Computes the shortest path from-to each pair of nodes.
// See https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
// Important nodes (those that have flow) computed as a side-effect.
function digest(inp: Valves): [StringBitSet, Record<string, number>] {
  let important = new StringBitSet();
  const paths: Record<string, number> = {};

  for (const v of Object.values(inp)) {
    paths[`${v.name}-${v.name}`] = 0;
    if (v.flow > 0) {
      important = important.add(v.name);
    }
    for (const o of v.outputs) {
      paths[`${v.name}-${o}`] = 1;
    }
  }
  const names = Object.values(inp).map(i => i.name);
  for (const k of names) {
    for (const i of names) {
      for (const j of names) {
        const candidate = distance(paths, i, k) + distance(paths, k, j);
        if (distance(paths, i, j) > candidate) {
          paths[`${i}-${j}`] = candidate;
        }
      }
    }
  }
  return [important, paths];
}

type State = [name: string, min: number, open: StringBitSet, total: number];

function visit(
  startTime: number,
  inp: Valves,
  important: StringBitSet,
  paths: Record<string, number>
): Map<bigint, number> {
  const best = new Map<bigint, number>();
  const visited = new Set<string>();

  // Order doesn't really matter.  This is just a convenient queue that allows
  // modification while iterating.
  const q = new Heap<State>((a, b) => b[1] - a[1]);
  q.push(["AA", startTime, new StringBitSet(), 0]);

  for (const item of q) {
    const vKey = item.join("-");
    if (visited.has(vKey)) {
      continue;
    }
    visited.add(vKey);

    const [name, min, open, total] = item;
    best.set(open.bits, Math.max(best.get(open.bits) ?? 0, total));

    // Out of time
    if (min === 0) {
      continue;
    }

    // Traverse to each important node from here.
    for (const i of important) {
      if (open.has(i)) {
        continue;
      }
      const iMin = min - paths[`${name}-${i}`] - 1;
      if (iMin < 0) {
        // Won't have enough time to get to that node.
        continue;
      }
      q.push([i, iMin, open.add(i), total + (iMin * inp[i].flow)]);
    }
  }

  return best;
}

function part1(
  inp: Valves,
  important: StringBitSet,
  paths: Record<string, number>
): number {
  const best = visit(30, inp, important, paths);
  return Math.max(...best.values());
}

function part2(
  inp: Valves,
  important: StringBitSet,
  paths: Record<string, number>
): number {
  const best = visit(26, inp, important, paths);

  // If we and the elephant have been on non-overlapping paths, it's optimal.
  let ret = -Infinity;
  for (const [k1, v1] of best) {
    for (const [k2, v2] of best) {
      const common = k1 & k2;
      if (common === 0n) {
        ret = Math.max(ret, v1 + v2);
      }
    }
  }
  return ret;
}

export default function main(inFile: string, trace: boolean) {
  const inp: Valves = Utils.parseFile(inFile, undefined, trace);
  const [important, paths] = digest(inp);
  return [part1(inp, important, paths), part2(inp, important, paths)];
}

Utils.main(import.meta.url, main);
