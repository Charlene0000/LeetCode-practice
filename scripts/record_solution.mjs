#!/usr/bin/env node
// Record one solved problem in progress.json.
// Usage: node scripts/record_solution.mjs --id 42 --slug trapping-rain-water \
//          --title "Trapping Rain Water" --difficulty Hard --dir 0042-trapping-rain-water

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (key.includes("=")) {
      const [name, ...rest] = key.split("=");
      result[name] = rest.join("=");
    } else {
      result[key] = argv[++i];
    }
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const required = ["id", "slug", "title", "difficulty", "dir"];
const missing = required.filter((key) => !args[key]);
if (missing.length) {
  console.error(`Missing arguments: ${missing.join(", ")}`);
  process.exit(1);
}
if (!["Medium", "Hard"].includes(args.difficulty)) {
  console.error("difficulty must be Medium or Hard");
  process.exit(1);
}
if (!/^\d+-[a-z0-9-]+$/.test(args.dir)) {
  console.error("dir must look like 0042-trapping-rain-water");
  process.exit(1);
}
const solutionFile = path.join(repo, "solutions", args.dir, "solution.js");
if (!fs.existsSync(solutionFile)) {
  console.error(`Missing solution file: ${solutionFile}`);
  process.exit(1);
}

const progressFile = path.join(repo, "progress.json");
const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
progress.solved ??= [];

if (progress.solved.some((item) => item.slug === args.slug)) {
  console.error(`Already recorded: ${args.slug}`);
  process.exit(1);
}

const date = args.date ?? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
progress.solved.push({
  id: args.id,
  slug: args.slug,
  title: args.title,
  difficulty: args.difficulty,
  date,
  dir: args.dir,
});

fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + "\n");
console.log(`Recorded ${args.slug} (${args.difficulty}) on ${date}. Total: ${progress.solved.length}`);
