"use strict";

/**
 * LeetCode 51. N-Queens
 *
 * Backtracking row by row. Because exactly one queen is placed per row, we only
 * need to detect attacks along columns and the two diagonals. `row - col` is
 * constant on one diagonal and `row + col` is constant on the other, so three
 * Sets give O(1) conflict checks and prune the search tree heavily.
 *
 * @param {number} n 1 <= n <= 9
 * @return {string[][]} every distinct board, each row a string of 'Q' and '.'
 */
function solveNQueens(n) {
  const solutions = [];
  const queens = []; // queens[row] = column of the queen in that row
  const columns = new Set();
  const descending = new Set(); // row - col
  const ascending = new Set(); // row + col

  function place(row) {
    if (row === n) {
      solutions.push(buildBoard(queens, n));
      return;
    }

    for (let col = 0; col < n; col += 1) {
      if (columns.has(col) || descending.has(row - col) || ascending.has(row + col)) {
        continue;
      }

      columns.add(col);
      descending.add(row - col);
      ascending.add(row + col);
      queens.push(col);

      place(row + 1);

      queens.pop();
      columns.delete(col);
      descending.delete(row - col);
      ascending.delete(row + col);
    }
  }

  place(0);
  return solutions;
}

function buildBoard(queens, n) {
  const board = [];
  for (const col of queens) {
    board.push(".".repeat(col) + "Q" + ".".repeat(n - col - 1));
  }
  return board;
}

module.exports = { solveNQueens };
