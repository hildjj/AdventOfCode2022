#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

interface Pos {
  x: number;
  y: number;
}
type PosSet = Set<string>;

const DELTAS: Record<string, Pos> = {
  U: { x: 0,  y: -1 },
  D: { x: 0,  y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1,  y: 0 },
};

type Direction = keyof typeof DELTAS;
type Move = [Direction, number];

function posToString(p: Pos): string {
  return `${p.x},${p.y}`;
}

function moveTail(head: Pos, tail: Pos) {
  const xdiff = head.x - tail.x;
  const ydiff = head.y - tail.y;

  if (!xdiff) {
    if (Math.abs(ydiff) > 1) {
      tail.y += Math.sign(ydiff);
    }
  } else if (!ydiff) {
    if (Math.abs(xdiff) > 1) {
      tail.x += Math.sign(xdiff);
    }
  } else {
    // Must be diagonal since both xdiff and ydiff
    if ((Math.abs(xdiff) !== 1) || (Math.abs(ydiff) !== 1)) {
      tail.x += Math.sign(xdiff);
      tail.y += Math.sign(ydiff);
    }
  }
}

function moveSnake(inp: Move[], LEN: number): number {
  const snake: Pos[] = Array.from(new Array(LEN), () => ({ x: 0, y: 0 }));
  const tailPos: PosSet = new Set();

  for (const [dir, len] of inp) {
    const delta = DELTAS[dir];
    for (let i = 0; i < len; i++) {
      snake[0].x += delta.x;
      snake[0].y += delta.y;

      for (let j = 1; j < LEN; j++) {
        moveTail(snake[j - 1], snake[j]);
      }
      tailPos.add(posToString(snake[LEN - 1]));
    }
  }
  return tailPos.size;
}

function part1(inp: Move[]): number {
  return moveSnake(inp, 2);
}

function part2(inp: Move[]): number {
  return moveSnake(inp, 10);
}

export default function main(inFile: string, trace: boolean) {
  const inp: Move[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
