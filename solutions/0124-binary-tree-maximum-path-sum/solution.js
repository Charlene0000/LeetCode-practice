"use strict";

/**
 * LeetCode 124. Binary Tree Maximum Path Sum
 *
 * Definition for a binary tree node.
 */
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Tree DP in post-order.
 *
 * For every node we compute `gain(node)`: the best sum of a downward path that
 * starts at `node` and goes into at most one subtree. A path whose highest node
 * is `node` combines `node.val` with the best downward gains of both children,
 * so it is checked separately.
 *
 * The traversal is iterative (children are processed before their parent by
 * walking a pre-order node list backwards) so a 3 * 10^4-node chain cannot
 * overflow the call stack. Gains are stored in a Map keyed by node.
 *
 * @param {TreeNode|null} root
 * @return {number}
 */
function maxPathSum(root) {
  if (root === null) return 0;

  const order = [];
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    order.push(node);
    if (node.left !== null) stack.push(node.left);
    if (node.right !== null) stack.push(node.right);
  }

  const gain = new Map();
  let best = -Infinity;

  for (let i = order.length - 1; i >= 0; i -= 1) {
    const node = order[i];

    // A negative branch is never worth taking: clamp it to 0.
    const left = Math.max(0, gain.get(node.left) ?? 0);
    const right = Math.max(0, gain.get(node.right) ?? 0);

    // Path that turns at this node (its two branches + itself).
    best = Math.max(best, node.val + left + right);

    // Path that continues upward through this node can use only one branch.
    gain.set(node, node.val + Math.max(left, right));
  }

  return best;
}

// --- Helpers for building trees in tests -------------------------------------

/**
 * Build a binary tree from LeetCode's level-order array, where `null` marks a
 * missing child (e.g. [1, 2, 3, null, null, 4]).
 */
function buildTree(values) {
  if (!values || values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root];
  let head = 0;
  let index = 1;

  while (head < queue.length && index < values.length) {
    const node = queue[head];
    head += 1;

    if (index < values.length) {
      const leftValue = values[index];
      index += 1;
      if (leftValue !== null) {
        node.left = new TreeNode(leftValue);
        queue.push(node.left);
      }
    }

    if (index < values.length) {
      const rightValue = values[index];
      index += 1;
      if (rightValue !== null) {
        node.right = new TreeNode(rightValue);
        queue.push(node.right);
      }
    }
  }

  return root;
}

module.exports = { TreeNode, maxPathSum, buildTree };
