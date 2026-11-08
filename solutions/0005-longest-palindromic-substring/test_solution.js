"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { longestPalindrome } = require("./solution.js");

function isPalindrome(s) {
  for (let i = 0, j = s.length - 1; i < j; i += 1, j -= 1) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}

// Several answers of the same length may be valid, so check the contract:
// the result must be a palindromic substring of s with the expected length.
function assertValidAnswer(s, result, expectedLength) {
  assert.equal(result.length, expectedLength, `unexpected length for "${s}"`);
  assert.ok(isPalindrome(result), `"${result}" is not a palindrome`);
  assert.ok(s.includes(result), `"${result}" is not a substring of "${s}"`);
}

function bruteForceLongestLength(s) {
  let best = 0;
  for (let start = 0; start < s.length; start += 1) {
    for (let end = start; end < s.length; end += 1) {
      if (end - start + 1 > best && isPalindrome(s.slice(start, end + 1))) {
        best = end - start + 1;
      }
    }
  }
  return best;
}

// Small deterministic PRNG so the randomised cross-check is reproducible.
function mulberry32(seed) {
  let state = seed;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("example 1: s = \"babad\" (\"bab\" and \"aba\" are both valid)", () => {
  assertValidAnswer("babad", longestPalindrome("babad"), 3);
});

test("example 2: s = \"cbbd\"", () => {
  assert.equal(longestPalindrome("cbbd"), "bb");
});

test("edge: single character", () => {
  assert.equal(longestPalindrome("a"), "a");
  assert.equal(longestPalindrome("z"), "z");
});

test("edge: two different characters", () => {
  assertValidAnswer("ac", longestPalindrome("ac"), 1);
});

test("edge: every character identical (even length)", () => {
  assert.equal(longestPalindrome("aaaa"), "aaaa");
});

test("edge: no palindrome longer than one character", () => {
  assertValidAnswer("abcdef", longestPalindrome("abcdef"), 1);
});

test("edge: even-length palindrome at the end of the string", () => {
  assert.equal(longestPalindrome("abacdfggf"), "fggf");
});

test("edge: digits are allowed by the constraints", () => {
  assert.equal(longestPalindrome("12321x"), "12321");
});

test("cross-check: agrees with brute force on 300 deterministic random strings", () => {
  const rand = mulberry32(20261108);
  for (let round = 0; round < 300; round += 1) {
    const length = 1 + Math.floor(rand() * 12);
    let s = "";
    for (let i = 0; i < length; i += 1) {
      s += "abc"[Math.floor(rand() * 3)];
    }

    const result = longestPalindrome(s);
    assert.equal(result.length, bruteForceLongestLength(s), `input: "${s}"`);
    assert.ok(isPalindrome(result), `"${result}" is not a palindrome`);
  }
});

test("stress: 1000 identical characters", () => {
  const s = "a".repeat(1000);
  assert.equal(longestPalindrome(s), s);
});
