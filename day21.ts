#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts
import assert from "assert";

type Operation = [name1: string, op: string, name2: string, human?: boolean];
type Job = Operation | number;
type Line = [name: string, job: Job];
type Program = Record<string, Job>;

const OP: Record<string, (a: number, b: number) => number> = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

// Inverse of OP, when using LHS
const LOP: Record<string, (a: number, b: number) => number> = {
  "+": (a, b) => a - b,
  "-": (a, b) => a + b,
  "*": (a, b) => a / b,
  "/": (a, b) => a * b,
};

// Inverse of OP, when using RHS
const ROP: Record<string, (a: number, b: number) => number> = {
  "+": (a, b) => a - b,
  "-": (a, b) => b - a,
  "*": (a, b) => a / b,
  "/": (a, b) => a * b,
};

function value(prog: Program, name: string): number {
  let res = prog[name];
  if (typeof res === "number") {
    return res;
  }
  res = OP[res[1]](value(prog, res[0]), value(prog, res[2]));

  prog[name] = res;
  return res;
}

function part1(inp: Line[]): number {
  const prog = Object.fromEntries(inp);

  return value(prog, "root");
}

function isHuman(prog: Program, name: string): boolean {
  if (name === "humn") {
    return true;
  }
  const job = prog[name];
  if (typeof job === "number") {
    return false;
  }
  if (job[3] !== undefined) {
    return job[3];
  }
  const res = isHuman(prog, job[0]) || isHuman(prog, job[2]);
  job[3] = res;
  return res;
}

function solve(prog: Program, name: string, prev: number): number {
  if (name === "humn") {
    return prev;
  }
  const job = prog[name];
  assert(typeof job !== "number");
  if (isHuman(prog, job[0])) {
    assert(!isHuman(prog, job[2]));
    const b = value(prog, job[2]);
    return solve(prog, job[0], LOP[job[1]](prev, b));
  }
  assert(isHuman(prog, job[2]));
  const a = value(prog, job[0]);
  return solve(prog, job[2], ROP[job[1]](prev, a));
}

function part2(inp: Line[]): number {
  const prog = Object.fromEntries(inp);
  if (typeof prog.root === "object") {
    if (isHuman(prog, prog.root[0])) {
      return solve(prog, prog.root[0], value(prog, prog.root[2]));
    }
    if (isHuman(prog, prog.root[2])) {
      return solve(prog, prog.root[2], value(prog, prog.root[0]));
    }
  }
  return NaN;
}

export default function main(inFile: string, trace: boolean) {
  const inp: Line[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
