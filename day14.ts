#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

type Point = { x: number, y: number };
type Line = Point[]

function xy(x: number, y:number): number {
  // No negatives or large numbers in the input.
  return (x << 16) | y;
}

function rasterize(lines: Line[]): [Set<number>, number] {
  const points = new Set<number>();
  let maxy = -Infinity;

  for (const line of lines) {
    let prev: Point | null = null;
    for (const point of line) {
      if (prev) {
        if (point.x === prev.x) {
          // Vertical
          const ys = [point.y, prev.y].sort();
          for (let y = ys[0]; y <= ys[1]; y++) {
            points.add(xy(point.x, y));
          }
        } else if (point.y === prev.y) {
          // Horizontal
          const xs = [point.x, prev.x].sort();
          for (let x = xs[0]; x <= xs[1]; x++) {
            points.add(xy(x, point.y));
          }
        } else {
          throw new Error("diagonal");
        }
      }
      maxy = Math.max(maxy, point.y);
      prev = point;
    }
  }
  return [points, maxy];
}

function part1(inp: Line[]): number {
  const [points, maxy] = rasterize(inp);
  let count = 0;
  let full = false;

  while (!full) {
    const sand: Point = { x: 500, y: 0 };
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!points.has(xy(sand.x, sand.y + 1))) {
        sand.y++;
      } else if (!points.has(xy(sand.x - 1, sand.y + 1))) {
        sand.x--;
        sand.y++;
      } else if (!points.has(xy(sand.x + 1, sand.y + 1))) {
        sand.x++;
        sand.y++;
      } else {
        // Come to rest
        count++;
        points.add(xy(sand.x, sand.y));
        break;
      }
      if (sand.y > maxy) {
        full = true;
        break;
      }
    }
  }
  return count;
}

function part2(inp: Line[]): number {
  const [points, maxy] = rasterize(inp);
  const floorNext = maxy + 1;
  let count = 0;
  let full = false;

  while (!full) {
    const sand: Point = { x: 500, y: 0 };
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const notFloorNext = sand.y !== floorNext;
      if (!points.has(xy(sand.x, sand.y + 1)) && notFloorNext) {
        sand.y++;
      } else if (!points.has(xy(sand.x - 1, sand.y + 1)) && notFloorNext) {
        sand.x--;
        sand.y++;
      } else if (!points.has(xy(sand.x + 1, sand.y + 1)) && notFloorNext) {
        sand.x++;
        sand.y++;
      } else {
        // Come to rest
        count++;
        points.add(xy(sand.x, sand.y));
        if ((sand.x === 500) && (sand.y === 0)) {
          full = true;
        }
        break;
      }
    }
  }
  return count;
}

export default function main(inFile: string, trace: boolean) {
  const inp: Line[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
