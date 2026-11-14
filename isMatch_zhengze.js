var isMatch = function(s, p) {
    const m = s.length;
    const n = p.length;

    // dp[i][j] 表示 s 的前 i 个字符能否匹配 p 的前 j 个字符
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
    dp[0][0] = true;

    // 处理 s 为空串时，p 形如 "a*b*c*" 的情况
    for (let j = 2; j <= n; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                // 情况 1：* 匹配零个前面的字符
                dp[i][j] = dp[i][j - 2];

                // 情况 2：* 再多吃一个当前字符
                if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
            } else {
                // 普通字符或 '.'
                if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
    }

    return dp[m][n];
};