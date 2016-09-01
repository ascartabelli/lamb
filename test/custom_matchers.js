function toHaveSameValuesOf (util, customEqualityTesters) {
    return {
        compare: function (actual, expected) {
            var result = {pass: true};

            if (Array.isArray(actual) && Array.isArray(expected)) {
                var actualLen = actual.length;
                var expectedLen = expected.length;

                if (actualLen !== expectedLen) {
                    result.pass = false;
                } else {
                    for (var i = 0; i < actualLen; i++) {
                        if (actual[i] !== expected[i]) {
                            result.pass = false;
                            break;
                        }
                    }
                }
            } else {
                result.pass = false;
                result.message = "Both values need to be arrays to be compared";
            }

            return result;
        }
    };
}

module.exports = {
    toHaveSameValuesOf: toHaveSameValuesOf
};
