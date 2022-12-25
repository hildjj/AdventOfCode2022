#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts
import assert from "assert";

type Space = "." | "#";
type Positions = Set<string>;
type Dir = "N" | "S" | "W" | "E";

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

  offset(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

const AllDirs = [
  new Point(-1, -1),
  new Point(0, -1),
  new Point(1, -1),
  new Point(-1, 0),
  // Current is (0, 0)
  new Point(1, 0),
  new Point(-1, 1),
  new Point(0, 1),
  new Point(1, 1),
];

const DirPoint: Record<Dir, Point[]> = {
  "N": [
    new Point(-1, -1), // NW
    new Point(0, -1),
    new Point(1, -1),
  ],
  "S": [
    new Point(-1, 1),
    new Point(0, 1),
    new Point(1, 1),
  ],
  "W": [
    new Point(-1, -1),
    new Point(-1, 0),
    new Point(-1, 1),
  ],
  "E": [
    new Point(1, -1),
    new Point(1, 0),
    new Point(1, 1),
  ],
};

class Elf extends Point {
  directions: Dir[];

  proposed: Point | undefined;

  constructor(x: number, y: number) {
    super(x, y);
    this.directions = ["N", "S", "W", "E"];
  }

  phaseOne(all: Positions) {
    if (AllDirs.every(c => !all.has(this.offset(c).toString()))) {
      this.proposed = new Point(this);
      return;
    }

    for (const dir of this.directions) {
      const check = DirPoint[dir];
      if (check.every(c => !all.has(this.offset(c).toString()))) {
        this.proposed = this.offset(check[1]);
        return;
      }
    }
    this.proposed = new Point(this);
  }

  phaseTwo(min: Point, max: Point): boolean {
    let ret = false;
    if (this.proposed) {
      ret = (this.x !== this.proposed.x) || (this.y !== this.proposed.y);
      this.x = this.proposed.x;
      this.y = this.proposed.y;
      this.proposed = undefined;
    }
    min.x = Math.min(this.x, min.x);
    max.x = Math.max(this.x, max.x);
    min.y = Math.min(this.y, min.y);
    max.y = Math.max(this.y, max.y);

    const d = this.directions.shift();
    assert(d);
    this.directions.push(d);
    return ret;
  }
}

export default function main(inFile: string, trace: boolean) {
  const inp: Space[][] = Utils.parseFile(inFile, undefined, trace);
  const elves: Elf[] = [];
  let all: Positions = new Set();
  let part1 = Infinity;
  let part2 = Infinity;

  for (const [y, row] of inp.entries()) {
    for (const [x, c] of row.entries()) {
      if (c === "#") {
        const elf = new Elf(x, y);
        all.add(elf.toString());
        elves.push(elf);
      }
    }
  }

  let min = new Point(0, 0);
  let max = new Point(inp[0].length - 1, inp.length - 1);

  for (let i = 0; i < Infinity; i++) {
    if (i === 10) {
      part1 = ((max.x - min.x + 1) * (max.y - min.y + 1)) - all.size;
    }
    const proposed: Record<string, Elf> = {};
    for (const elf of elves) {
      elf.phaseOne(all);
      assert(elf.proposed);
      const propStr = elf.proposed.toString();
      const prev = proposed[propStr];
      if (prev) {
        prev.proposed = undefined;
        elf.proposed = undefined;
      } else {
        proposed[propStr] = elf;
      }
    }

    all = new Set();
    min = new Point(Infinity, Infinity);
    max = new Point(-Infinity, -Infinity);

    let moved = false;
    for (const elf of elves) {
      moved = elf.phaseTwo(min, max) || moved;
      all.add(elf.toString());
    }
    if (!moved) {
      part2 = i + 1;
      break;
    }
  }

  return [part1, part2];
}

Utils.main(import.meta.url, main);
