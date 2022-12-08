#!/usr/bin/env node --loader ts-node/esm
import * as fs from "./fs.js";
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

function part1(FS: fs.Directory): number {
  let total = 0;
  FS.visit((node: fs.Node) => {
    if (fs.isDirectory(node) && node.size <= 100000) {
      total += node.size;
    }
  });
  return total;
}

function part2(FS: fs.Directory): number {
  const available = 70000000 - FS.size;
  const needed = 30000000 - available;
  let min = Infinity;
  FS.visit((node: fs.Node) => {
    if (fs.isDirectory(node) && node.size > needed && node.size < min) {
      min = node.size;
    }
  });
  return min;
}

export default function main(inFile: string, trace: boolean) {
  const inp: Line[] = Utils.parseFile(inFile, undefined, trace);

  const FS = fs.root();
  let pwd = FS;
  for (const line of inp) {
    switch (line.type) {
      case "command":
        if (line.bin === "cd") {
          if (line.args[0] === "/") {
            pwd = FS;
          } else {
            pwd = pwd.cd(line.args[0]);
          }
        }
        break;
      case "dir":
        pwd.createDirectory(line.name);
        break;
      case "file":
        pwd.createFile(line.name, { size: line.size });
        break;
      default:
        throw new Error(`unknown line: ${line}`);
    }
  }

  return [part1(FS), part2(FS)];
}

Utils.main(import.meta.url, main);
