var lengthOfLongestSubstring = function(s) {
    const seen = new Map();
    let left = 0;
    let maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        if (seen.has(ch)) {
            left = Math.max(left, seen.get(ch) + 1);
        }
        seen.set(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
};