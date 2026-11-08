"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { solveNQueens } = require("./solution.js");

function sortBoards(boards) {
  return boards.map((board) => board.join("\n")).sort();
}

function isValidSolution(board, n) {
  if (board.length !== n) return false;

  const queens = [];
  for (let row = 0; row < n; row += 1) {
    const line = board[row];
    if (line.length !== n || !/^[.Q]+$/.test(line)) return false;
    const col = line.indexOf("Q");
    if (col === -1 || line.lastIndexOf("Q") !== col) return false;
    queens.push([row, col]);
  }

  for (let i = 0; i < queens.length; i += 1) {
    for (let j = i + 1; j < queens.length; j += 1) {
      const [r1, c1] = queens[i];
      const [r2, c2] = queens[j];
      if (c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) return false;
    }
  }

  return true;
}

test("example 1: n = 4 has the two expected boards", () => {
  const expected = [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]];
  assert.deepEqual(sortBoards(solveNQueens(4)), sortBoards(expected));
});

test("example 2: n = 1", () => {
  assert.deepEqual(solveNQueens(1), [["Q"]]);
});

test("edge: n = 2 has no solution", () => {
  assert.deepEqual(solveNQueens(2), []);
});

test("edge: n = 3 has no solution", () => {
  assert.deepEqual(solveNQueens(3), []);
});

test("edge: n = 6 has the four known solutions, all valid and distinct", () => {
  const boards = solveNQueens(6);
  assert.equal(boards.length, 4);
  assert.equal(new Set(sortBoards(boards)).size, boards.length);
  for (const board of boards) assert.ok(isValidSolution(board, 6));
});

test("edge: n = 8 classic count is 92", () => {
  const boards = solveNQueens(8);
  assert.equal(boards.length, 92);
  for (const board of boards) assert.ok(isValidSolution(board, 8));
});

test("edge: n = 9 (maximum constraint) has 352 valid, distinct boards", () => {
  const boards = solveNQueens(9);
  assert.equal(boards.length, 352);
  const unique = new Set(sortBoards(boards));
  assert.equal(unique.size, boards.length);
  for (const board of boards) assert.ok(isValidSolution(board, 9));
});

test("edge: n = 5 count is 10 and every board places exactly five queens", () => {
  const boards = solveNQueens(5);
  assert.equal(boards.length, 10);
  for (const board of boards) {
    assert.equal(board.length, 5);
    assert.equal(board.join("").split("Q").length - 1, 5);
    assert.ok(isValidSolution(board, 5));
  }
});
