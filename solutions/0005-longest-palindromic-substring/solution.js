"use strict";

/**
 * LeetCode 5. Longest Palindromic Substring
 *
 * Manacher's algorithm in O(n) time. Insert '#' between every pair of
 * characters (and sentinels at both ends) so that odd- and even-length
 * palindromes are handled uniformly:
 *
 *   s = "abba"  ->  t = "^#a#b#b#a#$"
 *
 * p[i] is the radius of the longest palindrome centred at t[i], i.e. the
 * number of characters that match on each side. The mirror of i inside the
 * current right-most palindrome gives a lower bound for p[i], so each index
 * starts expanding only when that bound is exhausted; the right boundary only
 * moves forward, which makes the total work linear.
 *
 * @param {string} s
 * @return {string} any one of the longest palindromic substrings
 */
function longestPalindrome(s) {
  if (s.length <= 1) return s;

  const t = `^#${s.split("").join("#")}#$`;
  const p = new Array(t.length).fill(0);

  let center = 0; // centre of the palindrome reaching furthest right
  let right = 0; // right edge of that palindrome
  let bestCenter = 0;
  let bestRadius = 0;

  for (let i = 1; i < t.length - 1; i += 1) {
    if (i < right) {
      const mirror = 2 * center - i;
      p[i] = Math.min(right - i, p[mirror]);
    }

    // Expand around i using the sentinels '^' and '$' as guards.
    while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) {
      p[i] += 1;
    }

    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }

    if (p[i] > bestRadius) {
      bestRadius = p[i];
      bestCenter = i;
    }
  }

  // Radius in t equals the palindrome length in s; the start index is halved.
  const start = Math.floor((bestCenter - bestRadius) / 2);
  return s.slice(start, start + bestRadius);
}

module.exports = { longestPalindrome };
