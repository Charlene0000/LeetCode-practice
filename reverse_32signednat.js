var reverse = function(x) {
    let rev = 0;
    while (x !== 0) {
        const digit = x % 10;
        x = Math.trunc(x / 10);
        if (rev > 214748364 || (rev === 214748364 && digit > 7)) {
            return 0;
        }
        if (rev < -214748364 || (rev === -214748364 && digit < -8)) {
            return 0;
        }
        rev = rev * 10 + digit;
    }
    return rev;
};