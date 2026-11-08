"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { removeNthFromEnd, buildList, toArray } = require("./solution.js");

test("example 1: head = [1,2,3,4,5], n = 2", () => {
  const result = removeNthFromEnd(buildList([1, 2, 3, 4, 5]), 2);
  assert.deepEqual(toArray(result), [1, 2, 3, 5]);
});

test("example 2: single node, n = 1 -> empty list", () => {
  const result = removeNthFromEnd(buildList([1]), 1);
  assert.equal(result, null);
});

test("example 3: head = [1,2], n = 1 removes the tail", () => {
  const result = removeNthFromEnd(buildList([1, 2]), 1);
  assert.deepEqual(toArray(result), [1]);
});

test("edge: n equals the list length removes the head", () => {
  const result = removeNthFromEnd(buildList([1, 2, 3]), 3);
  assert.deepEqual(toArray(result), [2, 3]);
});

test("edge: n = 1 on a longer list removes the tail", () => {
  const result = removeNthFromEnd(buildList([1, 2, 3, 4]), 1);
  assert.deepEqual(toArray(result), [1, 2, 3]);
});

test("edge: duplicate values are removed by position, not by value", () => {
  const result = removeNthFromEnd(buildList([7, 7, 7, 7]), 2);
  assert.deepEqual(toArray(result), [7, 7, 7]);
});

test("edge: maximum length list (30 nodes)", () => {
  const values = Array.from({ length: 30 }, (_, index) => index);
  const result = removeNthFromEnd(buildList(values), 15);
  const expected = values.filter((_, index) => index !== values.length - 15);
  assert.deepEqual(toArray(result), expected);
});

test("edge: mixed values including zero are removed by position", () => {
  const result = removeNthFromEnd(buildList([-5, 0, 100]), 2);
  assert.deepEqual(toArray(result), [-5, 100]);
});

test("edge: input list head is not returned after it is removed", () => {
  const head = buildList([9, 8, 7]);
  const result = removeNthFromEnd(head, 3);
  assert.notEqual(result, head);
  assert.deepEqual(toArray(result), [8, 7]);
});
