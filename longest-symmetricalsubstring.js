var longestPalindrome = function(s) {
    if (s.length < 2) return s;
    let start = 0;
    let maxLen = 1;
    function expand(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }
    for (let i = 0; i < s.length; i++) {
        const len1 = expand(i, i);
        const len2 = expand(i, i + 1);
        const len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - Math.floor((len - 1) / 2);
        }
    }
    return s.substring(start, start + maxLen);
};