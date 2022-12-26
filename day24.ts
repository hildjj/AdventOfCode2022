#!/usr/bin/env node --loader ts-node/esm
import { Heap } from "heap-js";
import Utils from "./utils.js"; // Really .ts
import assert from "assert";

class Point {
  x: number;

  y: number;

  constructor(x: number, y: number);

  constructor(p: Point);

  constructor(...args: any[]) {
    if (args.length === 1) {
      this.x = args[0].x;
      this.y = args[0].y;
    } else {
      this.x = args[0];
      this.y = args[1];
    }
  }

  equals(p: Point) {
    return (this.x === p.x) && (this.y === p.y);
  }

  offset(size: Point, x: number, y: number): Point;

  offset(size: Point, p: Point): Point;

  offset(size: Point, ...args: any[]): Point {
    const [x, y] = (args.length === 1) ? [args[0].x, args[0].y] : args;
    return new Point(
      Utils.mod(this.x + x, size.x),
      Utils.mod(this.y + y, size.y)
    );
  }

  times(n: number): Point {
    return new Point(this.x * n, this.y * n);
  }

  toString() {
    return `${this.x},${this.y}`;
  }

  start(): boolean {
    return this.x === 0 && this.y === -1;
  }

  clamp<T extends Point>(size: Point, points: T[]): T[] {
    return points.filter(p => p.equals(START)
      || p.equals(FINISH)
      || (p.x >= 0 && p.x < size.x
          && p.y >= 0 && p.y < size.y));
  }
}

const START = new Point(0, -1);
let FINISH: Point;

class Blizzard extends Point {
  direction: Point;

  constructor(x: number, y: number, dir: string) {
    super(x, y);
    const d = {
      "^": new Point(0, -1),
      ">": new Point(1, 0),
      "v": new Point(0, 1),
      "<": new Point(-1, 0),
    }[dir];
    assert(d, dir);
    this.direction = d;
  }

  atStep(size: Point, step: number): Point {
    return this.offset(size, this.direction.times(step));
  }
}

class Node extends Point {
  step: number;

  maxStep: number;

  constructor(x: number, y: number, step: number, maxStep: number) {
    super(x, y);
    this.step = step;
    this.maxStep = maxStep;
  }

  empty(size: Point, blizzards: Blizzard[]): boolean {
    return blizzards.every(b => !this.equals(b.atStep(size, this.step)));
  }

  withOffset(x: number, y: number): Node {
    return new Node(
      this.x + x,
      this.y + y,
      this.step + 1,
      this.maxStep
    );
  }

  neighbors(size: Point): Node[] {
    return this.clamp(size, [
      // Don't wrap.
      this.withOffset(-1, 0),
      this.withOffset(1, 0),
      this.withOffset(0, 0), // Stay in place.
      this.withOffset(0, -1),
      this.withOffset(0, 1),
    ]);
  }

  modStep(): number {
    return this.step % this.maxStep;
  }

  toString() {
    return `S${this.modStep()} ${super.toString()}`;
  }
}

function arrayFill<T>(len: number, init: (i: number) => T): T[] {
  return Array.from(new Array(len), (_, i) => init(i));
}

class Bitmap {
  size: Point;

  points: boolean[][];

  constructor(size: Point) {
    this.size = size;
    this.points = arrayFill(size.y, () => arrayFill(size.x, () => false));
  }

  set(p: Point) {
    this.points[p.y][p.x] = true;
  }

  get(p: Point): boolean {
    if (p.equals(START) || p.equals(FINISH)) {
      return false;
    }
    return this.points[p.y][p.x];
  }

  print() {
    for (const row of this.points) {
      let s = "";
      for (const b of row) {
        s += b ? "#" : ".";
      }
      console.log(s);
    }
  }
}

function dijkstra(
  bitmaps: Bitmap[],
  init: Node,
  done: (node: Node, size: Point) => boolean
): number {
  const size = bitmaps[0].size;
  const seen = new Set<string>();
  const pq = new Heap<Node>(
    (a, b) => a.step - b.step || b.x - a.x || b.y - a.y
  );
  pq.push(init);
  for (const node of pq) {
    const ns = node.toString();
    if (seen.has(ns)) {
      continue;
    }
    seen.add(ns);

    if (done(node, size)) {
      return node.step;
    }

    for (const n of node.neighbors(size)) {
      if ((n.y < 0) || !bitmaps[n.modStep()].get(n)) {
        pq.push(n);
      }
    }
  }
  return Infinity;
}

function part1(bitmaps: Bitmap[]): number {
  // We start with ~332 open spaces.  Approach:
  // Graph the open spaces at each step, with an edge to spaces in the
  // next step that are the same, or off by one up/down/left/right.

  return dijkstra(
    bitmaps,
    new Node(START.x, START.y, 0, bitmaps.length),
    n => n.equals(FINISH)
  );
}

function part2(bitmaps: Bitmap[], first: number): number {
  // Make sure the start step is the end of phase 1.
  const second = dijkstra(
    bitmaps,
    new Node(FINISH.x, FINISH.y, first, bitmaps.length),
    n => n.equals(START)
  );
  return dijkstra(
    bitmaps,
    new Node(START.x, START.y, second, bitmaps.length),
    n => n.equals(FINISH)
  );
}

export default function main(inFile: string, trace: boolean) {
  const inp: string[] = Utils.parseFile(inFile, undefined, trace);

  const size = new Point(inp[0].length, inp.length);
  const repeats = Utils.lcm(size.x, size.y);
  FINISH = new Point(size.x - 1, size.y);

  // Pre-calculate the bitmaps for every possible step, mod the time
  // when a step repeats.
  const bitmaps: Bitmap[] = [];
  const blizzards = inp.map(
    (row, y) => [...[...row].entries()]
      .filter(([_, c]) => c !== ".")
      .map(([x, c]) => new Blizzard(x, y, c))
  ).flat();

  for (let step = 0; step < repeats; step++) {
    const bitmap = new Bitmap(size);
    for (const b of blizzards) {
      bitmap.set(b.atStep(size, step));
    }
    bitmaps.push(bitmap);
  }

  const first = part1(bitmaps);
  return [first, part2(bitmaps, first)];
}

Utils.main(import.meta.url, main);
