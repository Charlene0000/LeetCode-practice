#!/usr/bin/env node
// Pick today's problems: 3 Medium + 2 Hard, excluding anything already solved.
// Usage: node scripts/pick_problems.mjs [--medium 3] [--hard 2]

import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

function argValue(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? Number(process.argv[index + 1]) : fallback;
}

const wanted = { Medium: argValue("medium", 3), Hard: argValue("hard", 2) };
const total = wanted.Medium + wanted.Hard;

const pool = readJson(path.join(repo, "scripts", "problem-pool.json"), []);
const progress = readJson(path.join(repo, "progress.json"), { solved: [] });
const solved = new Set((progress.solved ?? []).map((item) => item.slug));

// Also skip folders that already exist but were not recorded yet.
const solutionsDir = path.join(repo, "solutions");
if (fs.existsSync(solutionsDir)) {
  for (const name of fs.readdirSync(solutionsDir)) {
    const match = name.match(/^\d+-([a-z0-9-]+)$/);
    if (match) solved.add(match[1]);
  }
}

const available = pool.filter((problem) => !solved.has(problem.slug));
const chosen = [];
const shortfall = [];

for (const [difficulty, count] of Object.entries(wanted)) {
  const candidates = available.filter((problem) => problem.difficulty === difficulty);
  const usedTopics = new Set(chosen.map((problem) => problem.topic));
  const selected = [];

  // Prefer a different topic for each problem so a day is not five variations of one pattern.
  for (const problem of candidates) {
    if (selected.length >= count) break;
    if (!usedTopics.has(problem.topic)) {
      selected.push(problem);
      usedTopics.add(problem.topic);
    }
  }
  for (const problem of candidates) {
    if (selected.length >= count) break;
    if (!selected.includes(problem)) selected.push(problem);
  }

  chosen.push(...selected);
  if (selected.length < count) shortfall.push({ difficulty, missing: count - selected.length });
}

let usedFallback = false;
if (shortfall.length > 0) {
  usedFallback = true;
  const dynamic = await fetchDynamicProblems(solved, chosen);
  for (const { difficulty, missing } of shortfall) {
    const extras = dynamic
      .filter(
        (problem) =>
          problem.difficulty === difficulty &&
          !chosen.some((item) => item.slug === problem.slug),
      )
      .slice(0, missing);
    chosen.push(...extras);
  }
}

if (chosen.length < total) {
  console.error(
    `Only ${chosen.length}/${total} problems available. Add more entries to scripts/problem-pool.json.`,
  );
  process.exit(1);
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
console.log(
  JSON.stringify(
    { date: today, count: chosen.length, source: usedFallback ? "pool+dynamic" : "pool", problems: chosen },
    null,
    2,
  ),
);

async function fetchDynamicProblems(excludeSlugs, alreadyChosen) {
  const excluded = new Set([...excludeSlugs, ...alreadyChosen.map((p) => p.slug)]);
  const payload = await new Promise((resolve, reject) => {
    const req = https.get(
      "https://leetcode.cn/api/problems/all/",
      {
        timeout: 30000,
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`leetcode.cn returned HTTP ${res.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("leetcode.cn returned invalid JSON"));
          }
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error("leetcode.cn timed out")));
    req.on("error", reject);
  });

  const levels = { 2: "Medium", 3: "Hard" };
  return payload.stat_status_pairs
    .filter(
      (pair) =>
        !pair.paid_only &&
        levels[pair.difficulty.level] &&
        !excluded.has(pair.stat.question__title_slug),
    )
    .sort((a, b) => b.stat.total_acs - a.stat.total_acs)
    .map((pair) => ({
      id: pair.stat.frontend_question_id,
      slug: pair.stat.question__title_slug,
      title: pair.stat.question__title,
      difficulty: levels[pair.difficulty.level],
      topic: "dynamic",
    }));
}
