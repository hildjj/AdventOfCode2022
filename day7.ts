#!/usr/bin/env node --loader ts-node/esm
import Utils from "./utils.js"; // Really .ts

interface Command {
  type: "command",
  bin: string,
  args: string[],
}

interface Dir {
  type: "dir",
  name: string,
}

interface File {
  type: "file",
  size: number,
  name: string
}

type Line = Command | Dir | File;

type Entry = Directory | number;

const SIZE = Symbol("size");
interface Directory {
  [SIZE]: number,
  [id: string]: Entry
}

type Visitor = (
  name: string,
  entry: Entry,
  parent?: Directory
) => void;

function visit(
  dir: Directory,
  fn: Visitor,
  parent?: Directory,
  name = ""
): void {
  for (const [k, v] of Object.entries(dir)) {
    if (k === "..") {
      continue;
    }
    if (typeof v === "number") {
      fn(`${name}/${k}`, v, dir);
    } else {
      visit(v, fn, dir, `${name}/${k}`);
    }
  }
  fn(name, dir, parent);
}

function part1(FS: Directory): number {
  let total = 0;
  visit(FS, (name: string, entry: Entry) => {
    if ((typeof entry !== "number") && (entry[SIZE] <= 100000)) {
      total += entry[SIZE];
    }
  });
  return total;
}

function part2(FS: Directory): number {
  const available = 70000000 - FS[SIZE];
  const needed = 30000000 - available;
  let min = Infinity;
  visit(FS, (name: string, entry: Entry) => {
    if (typeof entry === "object" && entry[SIZE] > needed && entry[SIZE] < min) {
      min = entry[SIZE];
    }
  });
  return min;
}

export default function main(inFile: string, trace: boolean) {
  const inp: Line[] = Utils.parseFile(inFile, undefined, trace);

  // Root
  const FS: Directory = {
    [SIZE]: 0,
  };
  let pwd = FS;
  for (const line of inp) {
    switch (line.type) {
      case "command":
        if (line.bin === "cd") {
          if (line.args[0] === "/") {
            pwd = FS;
          } else {
            pwd = pwd[line.args[0]] as Directory;
          }
        }
        break;
      case "dir":
        pwd[line.name] = {
          [SIZE]: 0,
          "..": pwd,
        };
        break;
      case "file":
        pwd[line.name] = line.size;
        break;
      default:
        throw new Error(`unknown line: ${line}`);
    }
  }

  // Set directory sizes
  visit(FS, (name: string, entry: Entry, parent?: Directory) => {
    if (parent) {
      if (typeof entry === "number") {
        parent[SIZE] += entry;
      } else {
        parent[SIZE] += entry[SIZE];
      }
    }
  });

  return [part1(FS), part2(FS)];
}

Utils.main(import.meta.url, main);
