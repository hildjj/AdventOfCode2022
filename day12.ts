#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

function findAll(char: number, field: number[][]): [number, number][] {
  const res: [number, number][] = [];
  for (const [i, s] of field.entries()) {
    for (const [j, c] of s.entries()) {
      if (c === char) {
        res.push([j, i]);
      }
    }
  }
  return res;
}

function route(
  inp: number[][],
  pos: [number, number],
  end: [number, number],
  cur: number,
  distance: number,
  visited: Record<string, number>
): number {
  // Edges
  if ((pos[0] === end[0]) && (pos[1] === end[1])) {
    return distance;
  }
  if (pos[0] < 0 || pos[1] < 0) {
    return Infinity;
  }
  if ((pos[1] >= inp.length) || (pos[0] >= inp[pos[1]].length)) {
    return Infinity;
  }
  // Too tall
  const n = inp[pos[1]][pos[0]];
  if (n > cur + 1) {
    return Infinity;
  }

  // Been there quicker
  const ps = pos.toString();
  const prev = visited[ps];
  if (prev && (distance >= prev)) {
    return Infinity;
  }
  visited[ps] = distance;

  return Math.min(
    route(inp, [pos[0] + 1, pos[1]], end, n, distance + 1, visited),
    route(inp, [pos[0] - 1, pos[1]], end, n, distance + 1, visited),
    route(inp, [pos[0], pos[1] + 1], end, n, distance + 1, visited),
    route(inp, [pos[0], pos[1] - 1], end, n, distance + 1, visited)
  );
}

function part1(inp: number[][]): number {
  const start = findAll(-1, inp)[0];
  const end = findAll(Infinity, inp)[0];
  return route(inp, start, end, 0, 0, {});
}

function part2(inp: number[][]): number {
  const starts = findAll(0, inp);
  starts.push(findAll(-1, inp)[0]); // Also try S.
  const end = findAll(Infinity, inp)[0];
  // Share this between runs.  If you can't get to this pos quicker, your
  // starting point isn't better.
  const visited = {};
  return Math.min(...starts.map(s => route(inp, s, end, 0, 0, visited)));
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
