"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { TreeNode, maxPathSum, buildTree } = require("./solution.js");

test("example 1: root = [1,2,3]", () => {
  assert.equal(maxPathSum(buildTree([1, 2, 3])), 6);
});

test("example 2: root = [-10,9,20,null,null,15,7]", () => {
  assert.equal(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])), 42);
});

test("classic wide tree: root = [5,4,8,11,null,13,4,7,2,null,null,null,1]", () => {
  const values = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1];
  assert.equal(maxPathSum(buildTree(values)), 48);
});

test("edge: single positive node", () => {
  assert.equal(maxPathSum(new TreeNode(7)), 7);
});

test("edge: single negative node must still be returned", () => {
  assert.equal(maxPathSum(new TreeNode(-3)), -3);
});

test("edge: all values negative, best is the largest single node", () => {
  assert.equal(maxPathSum(buildTree([-10, -20, -30])), -10);
  assert.equal(maxPathSum(buildTree([-2, -1])), -1);
});

test("edge: a negative child is better left out of the path", () => {
  // 2 alone beats 2 + (-5); 3 -> 2 gives 5.
  assert.equal(maxPathSum(buildTree([2, -5, 3])), 5);
});

test("edge: path does not have to include the root", () => {
  // Root -100 is abandoned; the right subtree [4,5] contributes 4 + 5.
  assert.equal(maxPathSum(buildTree([-100, 4, null, 5])), 9);
});

test("edge: constraint extremes, 30000-node chain of 1000s", () => {
  let root = new TreeNode(1000);
  let cursor = root;
  for (let i = 0; i < 29999; i += 1) {
    cursor.left = new TreeNode(1000);
    cursor = cursor.left;
  }
  assert.equal(maxPathSum(root), 30000 * 1000);
});

test("edge: constraint extremes, 30000-node chain of -1000s", () => {
  let root = new TreeNode(-1000);
  let cursor = root;
  for (let i = 0; i < 29999; i += 1) {
    cursor.right = new TreeNode(-1000);
    cursor = cursor.right;
  }
  assert.equal(maxPathSum(root), -1000);
});
