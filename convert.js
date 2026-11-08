var convert = function(s, numRows) {
    if (numRows === 1 || numRows >= s.length) {
        return s;
    }
    const n = s.length;
    const cycle = 2 * numRows - 2;
    const ans = [];
    for (let r = 0; r < numRows; r++) {
        for (let i = r; i < n; i += cycle) {
            ans.push(s[i]);
            const second = i + cycle - 2 * r;
            if (r !== 0 && r !== numRows - 1 && second < n) {
                ans.push(s[second]);
            }
        }
    }
    return ans.join('');
};