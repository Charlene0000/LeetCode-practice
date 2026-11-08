"use strict";

/**
 * LeetCode 11. Container With Most Water
 *
 * Two pointers. The area between lines i < j is (j - i) * min(height[i], height[j]).
 * Start with the widest pair and always move the pointer at the shorter line:
 * widening is impossible from here, so only a taller line can improve the area.
 * Moving the taller line instead would keep the same shorter side and lose width,
 * so it can never beat the best area already seen.
 *
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const shorter = Math.min(height[left], height[right]);
    const area = (right - left) * shorter;
    if (area > best) best = area;

    // The shorter line bounds the current container; replacing it is the only
    // way to possibly find a taller bottleneck (width can only decrease).
    if (height[left] < height[right]) {
      left += 1;
    } else {
      right -= 1;
    }
  }

  return best;
}

module.exports = { maxArea };
