#!/usr/bin/env node --loader ts-node/esm
import { Heap } from "heap-js";
import Utils from "./utils.js"; // Really .ts

interface Cell {
  x: number;
  y: number;
  value: number;
  distance: number;
}

const cells: Record<string, Cell> = {};

function getCell(inp: number[][], x: number, y: number): Cell {
  const xy = `${x},${y}`;
  let c = cells[xy];
  if (!c) {
    c = { x, y, value: inp[y][x], distance: Infinity };
    cells[xy] = c;
  }
  return c;
}

function findAll(char: number, field: number[][]): Cell[] {
  const res: Cell[] = [];
  for (const [i, s] of field.entries()) {
    for (const [j, c] of s.entries()) {
      if (c === char) {
        res.push(getCell(field, j, i));
      }
    }
  }
  return res;
}

function neighbors(inp: number[][], cell: Cell): Cell[] {
  const ret: Cell[] = [];
  if (cell.x > 0) {
    ret.push(getCell(inp, cell.x - 1, cell.y));
  }
  if (cell.y > 0) {
    ret.push(getCell(inp, cell.x, cell.y - 1));
  }
  if (cell.x < inp[cell.y].length - 1) {
    ret.push(getCell(inp, cell.x + 1, cell.y));
  }
  if (cell.y < inp.length - 1) {
    ret.push(getCell(inp, cell.x, cell.y + 1));
  }
  return ret.filter(c => cell.value <= (c.value + 1));
}

function flood(inp: number[][], cell: Cell) {
  // A*, more or less
  const pq = new Heap<Cell>((a, b) => a.distance - b.distance);
  pq.add(cell); // Starting point
  for (const cell of pq) {
    const dist = cell.distance + 1;
    for (const n of neighbors(inp, cell)) {
      if (dist < n.distance) {
        // Since we're visiting the shortest paths first, n is never already
        // visited.
        n.distance = dist;
        pq.push(n);
      }
    }
  }
}

function part1(inp: number[][]): number {
  const sc = findAll(-1, inp)[0];
  return sc.distance;
}

function part2(inp: number[][]): number {
  const starts = findAll(0, inp);
  starts.push(findAll(-1, inp)[0]); // Also try S.
  return Math.min(...starts.map(s => s.distance));
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  const ec = findAll(Infinity, inp)[0];
  ec.distance = 0;
  ec.value = 25;
  // Find the shortest distance to the end for each cell that can reach the end.
  flood(inp, ec);

  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
