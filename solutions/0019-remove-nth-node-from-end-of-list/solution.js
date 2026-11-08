"use strict";

/**
 * LeetCode 19. Remove Nth Node From End of List
 *
 * Definition for singly-linked list.
 */
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * One pass with a dummy node and a fixed gap.
 *
 * `fast` is advanced n + 1 nodes ahead of `slow`, so when `fast` falls off the
 * end `slow` is exactly the node before the one to remove. The dummy node makes
 * the "remove the head" case identical to every other case.
 *
 * @param {ListNode|null} head
 * @param {number} n 1 <= n <= length of the list
 * @return {ListNode|null}
 */
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;

  for (let step = 0; step < n + 1; step += 1) {
    fast = fast.next;
  }

  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next;
  return dummy.next;
}

// --- Helpers for building lists in tests -------------------------------------

/** Build a linked list from an array, returning its head. */
function buildList(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}

/** Convert a linked list (or null) into a plain array. */
function toArray(head) {
  const values = [];
  for (let node = head; node !== null; node = node.next) {
    values.push(node.val);
  }
  return values;
}

module.exports = { ListNode, removeNthFromEnd, buildList, toArray };
