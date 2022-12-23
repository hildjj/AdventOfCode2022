#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

// Linked list of original order
interface Item {
  value: number;
  next?: Item;
}

function mix(moved: Item[], start: Item) {
  for (
    let item: Item | undefined = start;
    item !== undefined;
    item = item.next
  ) {
    const from = moved.indexOf(item);
    // NOTE: length -1 makes this all go.
    const newSpot = Utils.mod(from + item.value, moved.length - 1);
    if (newSpot !== from) {
      moved.splice(from, 1);
      moved.splice(newSpot, 0, item);
    }
  }
}

function prepare(inp: number[]): Item[] {
  const moved: Item[] = inp.map(value => ({ processed: false, value }));
  for (let i = 0; i < moved.length - 1; i++) {
    moved[i].next = moved[i + 1];
  }
  return moved;
}
function part1(inp: number[]): number {
  const moved = prepare(inp);
  mix(moved, moved[0]);
  const zed = moved.findIndex(({ value }) => value === 0);
  return [1000, 2000, 3000]
    .map(i => moved[(i + zed) % moved.length].value)
    .reduce((t, v) => t + v, 0);
}

function part2(inp: number[]): number {
  const moved = prepare(inp);
  moved.forEach(i => (i.value *= 811589153));
  const start = moved[0];
  for (let i = 0; i < 10; i++) {
    mix(moved, start);
  }
  const zed = moved.findIndex(({ value }) => value === 0);
  return [1000, 2000, 3000]
    .map(i => moved[(i + zed) % moved.length].value)
    .reduce((t, v) => t + v, 0);
}

export default function main(inFile: string, trace: boolean) {
  const inp: number[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
