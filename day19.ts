#!/usr/bin/env node --loader ts-node/esm
import { Heap } from "heap-js";
import Utils from "./utils.js"; // Really .ts

enum Mat {
  ORE,
  CLAY,
  OBSIDIAN,
  GEODE
}

const MATS: Mat[] = [Mat.ORE, Mat.CLAY, Mat.OBSIDIAN, Mat.GEODE];

type PerMat<T> = [ore: T, clay: T, obsidian: T, geode: T]
type NumberPerMat = PerMat<number>;
type Costs = NumberPerMat;

interface Blueprint {
  name: number,
  costs: PerMat<Costs>,
}

interface State {
  time: number,
  have: NumberPerMat,
  robots: NumberPerMat,
}

function timeToRobot(s: State, bp: Blueprint, mat: Mat): number {
  // We can build in 1 step if we have all inputs.
  // If we will have the inputs in Min(inp1, inp2), we can build then.
  // Otherwise, we'll have to wait until we have Max(inp1, inp2)
  const times = bp.costs[mat]
    .map((c, i) => c && Math.ceil((c - s.have[i]) / s.robots[i]));
  // Note that times will have negative for the 1 step case, so the
  // extra zero is to clamp.  Infinity if we don't have robots for this
  // resource, because we're dividing by zero *intentionally*.
  return Math.max(0, ...times) + 1;
}

function maxGeodes(blueprint: Blueprint, maxTime: number): [number, number] {
  const pq = new Heap<State>((a, b) => b.have[Mat.GEODE] - a.have[Mat.GEODE]
    || b.robots[Mat.GEODE] - a.robots[Mat.GEODE]
    || b.time - a.time);
  const initial: State = {
    time: 0,
    have: [0, 0, 0, 0],
    robots: [1, 0, 0, 0],
  };

  pq.push(initial);
  let earliestGeodeTime = Infinity;
  let max = 0;
  // If we have enough robots to build the biggest thing in one step, we
  // don't need any more.
  const maxNeeded = blueprint.costs.map(
    (_, i) => Math.max(...blueprint.costs.map(c => c[i]))
  ) as NumberPerMat;
  maxNeeded[Mat.GEODE] = Infinity; // Never enough!

  for (const s of pq) {
    // Whichever path gets to a geode first will always win.
    if ((s.time > earliestGeodeTime) && (s.have[Mat.GEODE] === 0)) {
      continue;
    }
    if ((s.have[Mat.GEODE] > 0) && (s.time < earliestGeodeTime)) {
      earliestGeodeTime = s.time;
    }

    const timeLeft = maxTime - s.time;
    const geodes = s.have[Mat.GEODE];
    if (geodes > max) {
      // Found a new max path.
      max = geodes;
    } else if (
      geodes
      + (s.robots[Mat.GEODE] * timeLeft)
      + ((timeLeft * (timeLeft - 1)) / 2) <= max
    ) {
      // If we built a geode bot every turn remaining, would it help?
      // This cuts out a startlingly large number of paths.
      continue;
    }

    // At each step, we can choose to build any kind of robot, waiting the
    // number of steps required to ammass all of the needed materials.  We
    // can't build a robot if it wouldn't be done before the end.
    for (const m of MATS) {
      const time = timeToRobot(s, blueprint, m);
      if (s.robots[m] >= maxNeeded[m]) {
        continue;
      }
      if (timeLeft <= time) {
        continue;
      }
      const robots: NumberPerMat = [...s.robots];
      robots[m]++;
      const have = s.have.map(
        (h, i) => h + (s.robots[i] * time) - blueprint.costs[m][i]
      ) as NumberPerMat;

      pq.push({
        time: s.time + time,
        have,
        robots,
      });
    }

    // If we have at least one geode robot, waiting until the end might
    // be fastest.
    if (s.robots[Mat.GEODE] > 0) {
      const have
        = s.have.map((h, i) => h + (s.robots[i] * timeLeft)) as NumberPerMat;
      pq.push({
        time: s.time + timeLeft,
        have,
        robots: [...s.robots],
      });
    }
  }

  return [max, blueprint.name];
}

function part1(inp: Blueprint[]): number {
  return inp
    .map(bp => maxGeodes(bp, 24))
    .reduce((t, [g, id]) => t + (g * id), 0);
}

function part2(inp: Blueprint[]): number {
  return inp
    .slice(0, 3)
    .map(bp => maxGeodes(bp, 32))
    .reduce((t, [g]) => t * g, 1);
}

export default function main(inFile: string, trace: boolean) {
  const inp: Blueprint[] = Utils.parseFile(inFile, undefined, trace);
  return [part1(inp), part2(inp)];
}

Utils.main(import.meta.url, main);
