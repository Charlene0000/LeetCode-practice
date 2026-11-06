var addTwoNumbers = function(l1, l2) {
    const dummy = new ListNode(0);
    let cur = dummy;
    let carry = 0;
    while(l1 != null || l2 != null || carry !=0) {
        const x = l1 !== null ? l1.val : 0;
        const y = l2 !== null ? l2.val : 0;
        const sum = x + y + carry;
        carry = Math.floor(sum / 10);
        cur.next = new ListNode(sum % 10);
        cur = cur.next;
        if (l1 != null) l1 = l1.next;
        if (l2 != null) l2 = l2.next;
    }
    return dummy.next;
};