function isSparseArray (array) {
    return Array.isArray(array)
        && Object.keys(array).filter(v => String(v >>> 0) === v).length !== array.length;
}

function isSparseArrayCheckNeeded (a, b) {
    return isSparseArray(a) && Array.isArray(b) || isSparseArray(b) && Array.isArray(a);
}

expect.extend({
    toStrictArrayEqual: function (a, b) {
        const result = {
            message: function () {
                return "Expected " + a + " to strict array equal " + b;
            }
        };

        if (isSparseArrayCheckNeeded(a, b)) {
            const aLen = a.length;

            if (aLen !== b.length) {
                result.pass = false;

                return result;
            }

            for (let i = 0; i < aLen; i++) {
                if (i in a ^ i in b) {
                    result.pass = false;

                    return result;
                } else if (a[i] !== b[i]) {
                    result.pass = false;

                    return result;
                }
            }

            result.pass = true;

            return result;
        }

        result.pass = this.equals(a, b);

        return result;
    }
});
