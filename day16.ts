#!/usr/bin/env node --loader ts-node/esm
import StringBitSet from "./stringBitSet.js";
import Utils from "./utils.js"; // Really .ts

interface Valve {
  name: string;
  flow: number;
  outputs: string[];
}

type Valves = Record<string, Valve>;

function part1(inp: Valves): number {
  let max = -Infinity;
  const seen: Record<string, number> = {};

  function search(
    cur: string,
    time: number,
    pressure: number,
    open: StringBitSet
  ) {
    const curTime = `${cur},${time}`;
    if ((seen[curTime] ?? -Infinity) >= pressure) {
      return;
    }
    seen[curTime] = pressure;
    if (time === 30) {
      max = Math.max(max, pressure);
      return;
    }
    const net = [...open].map(o => inp[o].flow).reduce((t, v) => t + v, 0);
    if (!open.has(cur) && inp[cur].flow) {
      search(cur, time + 1, pressure + net + inp[cur].flow, open.add(cur));
    }
    for (const o of inp[cur].outputs) {
      search(o, time + 1, pressure + net, open);
    }
  }

  search("AA", 1, 0, new StringBitSet());
  return max;
}

type State = [name: string, min: number, open: StringBitSet, total: number];

function part2(inp: Valves): number {
  let important = new StringBitSet();
  const paths: Record<string, number> = {};

  // Floyd-Warshall.  Computes the shortest path from-to each pair of nodes.
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
  for (const i of names) {
    for (const j of names) {
      for (const k of names) {
        paths[`${j}-${k}`] = Math.min(
          paths[`${j}-${k}`] ?? Infinity,
          (paths[`${j}-${i}`] ?? Infinity) + (paths[`${i}-${k}`] ?? Infinity)
        );
      }
    }
  }

  const q: State[] = [["AA", 26, new StringBitSet(), 0]];
  const visited = new Set<string>();
  const best = new Map<bigint, number>();

  while (q.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const item = q.pop()!;
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
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
