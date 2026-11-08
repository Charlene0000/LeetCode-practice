# LeetCode Practice

个人 LeetCode 刷题仓库。目标是每天完成 **5 道 Medium/Hard** 题目（3 道 Medium + 2 道 Hard），每题都包含可运行的 JavaScript 实现、`node:test` 测试和中文思路说明，并由 DSH 自动提交、推送到本仓库。

## 最近进度

<!-- STATS:START -->
- 累计完成：**5** 题（Medium 3 / Hard 2）
- 打卡天数：**1** 天
- 最近更新：2026-11-08

| # | 题目 | 难度 | 完成日期 | 题解 |
|---|------|------|----------|------|
| 5 | [N-Queens](https://leetcode.com/problems/n-queens/) | Hard | 2026-11-08 | [code](solutions/0051-n-queens/solution.js) |
| 4 | [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | 2026-11-08 | [code](solutions/0124-binary-tree-maximum-path-sum/solution.js) |
| 3 | [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Medium | 2026-11-08 | [code](solutions/0019-remove-nth-node-from-end-of-list/solution.js) |
| 2 | [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | 2026-11-08 | [code](solutions/0005-longest-palindromic-substring/solution.js) |
| 1 | [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium | 2026-11-08 | [code](solutions/0011-container-with-most-water/solution.js) |
<!-- STATS:END -->

## 目录结构

```text
solutions/
  0042-trapping-rain-water/
    solution.js       # 可运行实现（module.exports 导出）
    test_solution.js  # node:test + assert/strict
    notes.md          # 思路、复杂度、边界
scripts/
  fetch_problem.mjs    # 抓取题目描述、示例、标签
  pick_problems.mjs    # 按难度选题，自动跳过已做题目
  record_solution.mjs  # 写入 progress.json
  render_readme.mjs    # 刷新本文件的进度区
  publish.ps1          # 提交并推送（自动处理本机 GitHub 网络/凭据）
progress.json          # 已完成题目清单
```

> 仓库根目录下的 5 个 `.js` 文件是早期 LeetCode Hot 100 的手写练习，保留原样。

## 本地验证

```powershell
node --test solutions/0042-trapping-rain-water/test_solution.js
```

## 每日自动化

- 调度时间：每天 **20:00**（Asia/Shanghai）
- 选题：`scripts/pick_problems.mjs` 从题库中依次选择 3 Medium + 2 Hard，跳过 `progress.json` 中已完成的题目；题库耗尽后自动从 LeetCode 题库补足。
- 题面：`scripts/fetch_problem.mjs` 获取英文原题、示例和约束。
- 发布：`scripts/publish.ps1` 提交并推送到 `https://github.com/Charlene0000/LeetCode-practice`。

### 手动跑一次

```powershell
node scripts/pick_problems.mjs
node scripts/fetch_problem.mjs <slug>
# 写代码 + 测试后
node scripts/record_solution.mjs --id <id> --slug <slug> --title "<title>" --difficulty <Medium|Hard> --dir <dir>
node scripts/render_readme.mjs
pwsh -NoProfile -File scripts/publish.ps1 -Message "Daily practice: 5 problems"
```
