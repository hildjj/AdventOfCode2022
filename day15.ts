#!/usr/bin/env node --loader ts-node/esm
import { Sequence } from "./sequence.js";
import Utils from "./utils.js"; // Really .ts

const LINE = 2000000;
const BOX = 4000000;

type Circle = [ x: number, y: number, r: number];

function manhattan(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function radii(inp: number[][]): Circle[] {
  const circles: Circle[] = [];
  for (const [sx, sy, bx, by] of inp) {
    const r = manhattan(sx, sy, bx, by);
    circles.push([sx, sy, r]);
  }
  return circles;
}

function covered(
  circles: Circle[],
  x: number,
  y: number
): boolean {
  for (const [cx, cy, r] of circles) {
    if (manhattan(cx, cy, x, y) <= r) {
      return true;
    }
  }
  return false;
}

function part1(inp: number[][]): number {
  // Only use circles that cross the line
  const circles = radii(inp)
    .filter(([, y, r]) => y - r <= LINE && y + r >= LINE);
  // The beacons on the line don't count
  const onLine = new Set(
    inp.filter(([,,, by]) => by === LINE).map(([,, bx]) => bx)
  );

  // Check from the left-most to the right-most potential points on LINE.
  let minX = Infinity;
  let maxX = -Infinity;
  circles.forEach(([x,, r]) => {
    minX = Math.min(minX, x - r);
    maxX = Math.max(maxX, x + r);
  });

  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    if (!onLine.has(x) && covered(circles, x, LINE)) {
      count++;
    }
  }

  return count;
}

function part2(inp: number[][]): number {
  const circles = radii(inp);
  const posI: number[] = [];
  const negI: number[] = [];

  // Slope of each side of the circle is either m=+1 or m=-1.
  // y = mx + b
  // b = y - mx
  for (const [x, y, r] of circles) {
    // Positive slope through left and right corners
    posI.push(y - (x - r), y - (x + r));
    // Negative slope through left and right corners
    negI.push(y + (x - r), y + (x + r));
  }

  const pos = new Sequence(posI)
    .combinations(2) // Account for overlaps, etc.
    .filter(([b1, b2]) => Math.abs(b2 - b1) === 2) // Two edges that are off by 2
    .map(([b1, b2]) => Math.min(b1, b2) + 1) // Midway between
    .dedup(); // Several might line up

  const neg = new Sequence(negI)
    .combinations(2)
    .filter(([b1, b2]) => Math.abs(b2 - b1) === 2)
    .map(([b1, b2]) => Math.min(b1, b2) + 1)
    .dedup();

  // Try all of the pos/neg pairs
  const p = Sequence.product([neg, pos])
    .map(([b2, b1]) => [(b2 - b1) / 2, b1]) // Intersection: x = (b2 - b1)/2
    .map(([x, b1]) => [x, x + b1]) // Corresponding y
    .filter(([x, y]) => x >= 0 // Inside the box
      && y >= 0
      && x <= BOX
      && y <= BOX
      && !covered(circles, x, y)); // And empty

  const [x, y] = p.first() ?? [NaN, NaN];
  return (x * 4000000) + y;
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[][] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
