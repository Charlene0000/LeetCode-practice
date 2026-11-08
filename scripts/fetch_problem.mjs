#!/usr/bin/env node
// Fetch one LeetCode problem as structured JSON.
// Usage: node scripts/fetch_problem.mjs <title-slug>

import https from "node:https";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/fetch_problem.mjs <title-slug>");
  process.exit(1);
}

const query = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    titleSlug
    difficulty
    content
    exampleTestcases
    topicTags { name }
    hints
    metaData
  }
}`;

function requestJson(host, path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(
      {
        host,
        path,
        method: "POST",
        timeout: 25000,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
          Accept: "application/json",
          Origin: `https://${host}`,
          Referer: `https://${host}/problems/${slug}/`,
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`${host} returned HTTP ${res.statusCode}: ${data.slice(0, 160)}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error(`${host} returned non-JSON: ${data.slice(0, 160)}`));
          }
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error(`${host} timed out`)));
    req.on("error", reject);
    req.end(payload);
  });
}

const namedEntities = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  le: "≤",
  ge: "≥",
  ne: "≠",
  minus: "−",
  times: "×",
  hellip: "…",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
};

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[name.toLowerCase()] ?? match);
}

function htmlToText(html) {
  if (!html) return "";
  let text = html
    .replace(/\r\n/g, "\n")
    .replace(/<pre[^>]*>/gi, "\n```\n")
    .replace(/<\/pre>/gi, "\n```\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<code[^>]*>/gi, "`")
    .replace(/<\/code>/gi, "`")
    .replace(/<(strong|b)[^>]*>/gi, "**")
    .replace(/<\/(strong|b)>/gi, "**")
    .replace(/<(em|i)[^>]*>/gi, "_")
    .replace(/<\/(em|i)>/gi, "_")
    .replace(/<sup[^>]*>/gi, "^")
    .replace(/<\/sup>/gi, "")
    .replace(/<sub[^>]*>/gi, "_")
    .replace(/<\/sub>/gi, "")
    .replace(/<[^>]+>/g, "");
  text = decodeEntities(text)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

async function fetchQuestion() {
  const attempts = [];
  for (const [host, path] of [
    ["leetcode.cn", "/graphql/"],
    ["leetcode.com", "/graphql"],
  ]) {
    for (let i = 0; i < 2; i++) {
      try {
        const json = await requestJson(host, path, {
          query,
          variables: { titleSlug: slug },
          operationName: "questionData",
        });
        if (json.errors?.length) {
          throw new Error(json.errors.map((e) => e.message).join("; "));
        }
        if (!json.data?.question) {
          throw new Error("question not found (it may be premium-only)");
        }
        return json.data.question;
      } catch (error) {
        attempts.push(`${host}#${i + 1}: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }
  }
  throw new Error(`All endpoints failed:\n${attempts.join("\n")}`);
}

let question;
try {
  question = await fetchQuestion();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

let metaData = null;
try {
  metaData = question.metaData ? JSON.parse(question.metaData) : null;
} catch {
  metaData = null;
}

const result = {
  id: question.questionFrontendId,
  title: question.title,
  slug: question.titleSlug,
  difficulty: question.difficulty,
  url: `https://leetcode.com/problems/${question.titleSlug}/`,
  content: htmlToText(question.content),
  examples: question.exampleTestcases ?? "",
  topics: (question.topicTags ?? []).map((tag) => tag.name),
  hints: question.hints ?? [],
  metaData,
};

console.log(JSON.stringify(result, null, 2));
