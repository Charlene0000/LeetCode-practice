var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) {
        const tmp = nums1;
        nums1 = nums2;
        nums2 = tmp;
    }
    const m = nums1.length;
    const n = nums2.length;
    const totalLeft = Math.floor((m + n + 1) / 2);
    let left = 0;
    let right = m;
    while (left <= right) {
        const i = left + Math.floor((right - left) / 2);
        const j = totalLeft - i;
        const l1 = (i === 0) ? -Infinity : nums1[i - 1];
        const r1 = (i === m) ?  Infinity : nums1[i];
        const l2 = (j === 0) ? -Infinity : nums2[j - 1];
        const r2 = (j === n) ?  Infinity : nums2[j];
        if (l1 <= r2 && l2 <= r1) {
            if ((m + n) % 2 === 1) {
                return Math.max(l1, l2);
            }
            return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
        }
        if (l1 > r2) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    return 0;
};