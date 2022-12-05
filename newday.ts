#!/usr/bin/env node --loader ts-node/esm
import { execa } from "execa";
import { fileURLToPath } from "url";
import path from "path";
import { readdir } from "fs/promises";

const YEAR = 2022;
const day = process.argv[2];
const p = path.parse(fileURLToPath(import.meta.url));

if (!day) {
  console.error(`Usage: ${p.base} <day>`);
  process.exit(64);
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    if (ms <= 0) {
      resolve();
    } else {
      setTimeout(resolve, ms);
    }
  });
}

async function copyDir(dir: string) {
  const rel = path.relative(p.dir, dir) || ".";
  for (const fn of await readdir(dir)) {
    const m = fn.match(/^day0\.(.*)$/);
    if (m) {
      const target = `${dir}/day${day}.${m[1]}`;
      try {
        await execa("cp", ["-n", `${dir}/${fn}`, target]);
        console.log(`Created "${rel}/day${day}.${m[1]}"`);
      } catch (e: any) {
        console.log(`Skipping "${rel}/day${day}.${m[1]}"`);
      }
      await execa("code", [target]);
    }
  }
}

const d = new Date();
d.setUTCHours(5);
d.setMinutes(0);
d.setSeconds(0);
d.setMilliseconds(500);
console.log(`Waiting until ${d}`);
await wait(d.getTime() - Date.now());

await execa("git", ["co", "-b", `day${day}`]);
await execa("open", [`https://adventofcode.com/${YEAR}/day/${day}`]);
await copyDir(p.dir);
await copyDir(`${p.dir}/test`);

await execa("curl", [
  "-b", ".cookies",
  `https://adventofcode.com/${YEAR}/day/${day}/input`,
  "-o", `inputs/day${day}.txt`,
]);
console.log(`Downloaded "inputs/day${day}.txt"`);
await execa("code", [`inputs/day${day}.txt`]);
