function isSparseArray (array) {
    return Array.isArray(array) && Object.keys(array).filter(function (v) {
        return String(v >>> 0) === v;
    }).length !== array.length;
}

function naiveSparseArrayEquality (a, b) {
    if (isSparseArray(a) && Array.isArray(b) || isSparseArray(b) && Array.isArray(a)) {
        var aLen = a.length;
        var bLen = b.length;

        if (aLen !== bLen) {
            return false;
        }

        for (var i = 0; i < aLen; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }
}

module.exports = {
    naiveSparseArrayEquality: naiveSparseArrayEquality
};
