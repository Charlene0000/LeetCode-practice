"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { maxArea } = require("./solution.js");

test("example 1: height = [1,8,6,2,5,4,8,3,7]", () => {
  assert.equal(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
});

test("example 2: two lines of height 1", () => {
  assert.equal(maxArea([1, 1]), 1);
});

test("edge: two lines, one of them zero", () => {
  assert.equal(maxArea([0, 0]), 0);
  assert.equal(maxArea([0, 7]), 0);
  assert.equal(maxArea([7, 0]), 0);
});

test("edge: tallest lines sit at both ends", () => {
  assert.equal(maxArea([4, 3, 2, 1, 4]), 16);
});

test("edge: ascending heights, best pair is not the two ends", () => {
  assert.equal(maxArea([1, 2, 3, 4, 5]), 6);
});

test("edge: all heights equal", () => {
  assert.equal(maxArea([5, 5, 5, 5]), 15);
});

test("edge: height[i] at the maximum constraint", () => {
  assert.equal(maxArea([10000, 1, 10000]), 20000);
});

test("stress: 100000 lines is handled in linear time", () => {
  const height = new Array(100000).fill(1);
  assert.equal(maxArea(height), 99999);
});
