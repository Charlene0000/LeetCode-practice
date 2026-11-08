#!/usr/bin/env node
// Refresh the "recent progress" block in README.md from progress.json.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const progressFile = path.join(repo, "progress.json");
const readmeFile = path.join(repo, "README.md");

const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
const solved = [...(progress.solved ?? [])].reverse();
const medium = solved.filter((item) => item.difficulty === "Medium").length;
const hard = solved.filter((item) => item.difficulty === "Hard").length;
const days = new Set(solved.map((item) => item.date)).size;

const escape = (text) => String(text).replace(/\|/g, "\\|");

let block;
if (solved.length === 0) {
  block = "还没有记录，等待第一次自动刷题。";
} else {
  const rows = solved.slice(0, 10).map((item, index) => {
    const url = `https://leetcode.com/problems/${item.slug}/`;
    const code = `solutions/${item.dir}/solution.js`;
    return `| ${solved.length - index} | [${escape(item.title)}](${url}) | ${item.difficulty} | ${item.date} | [code](${code}) |`;
  });
  block = [
    `- 累计完成：**${solved.length}** 题（Medium ${medium} / Hard ${hard}）`,
    `- 打卡天数：**${days}** 天`,
    `- 最近更新：${solved[0].date}`,
    "",
    "| # | 题目 | 难度 | 完成日期 | 题解 |",
    "|---|------|------|----------|------|",
    ...rows,
  ].join("\n");
}

const readme = fs.readFileSync(readmeFile, "utf8");
const pattern = /<!-- STATS:START -->[\s\S]*?<!-- STATS:END -->/;
if (!pattern.test(readme)) {
  console.error("README.md is missing the STATS markers.");
  process.exit(1);
}
const updated = readme.replace(
  pattern,
  `<!-- STATS:START -->\n${block}\n<!-- STATS:END -->`,
);
fs.writeFileSync(readmeFile, updated);
console.log(`README updated: ${solved.length} solved, ${days} day(s).`);
