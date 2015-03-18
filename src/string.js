
function _getPadding (source, char, len) {
    return repeat(char[0] || " ", Math.ceil(len - source.length));
}

/**
 * Pads a string to the desired length with the given char starting from the beginning of the string.
 * @example
 * _.padLeft("foo", "-", 0) // => "foo"
 * _.padLeft("foo", "-", -1) // => "foo"
 * _.padLeft("foo", "-", 5) // => "--foo"
 * _.padLeft("foo", "-", 3) // => "foo"
 * _.padLeft("foo", "ab", 7) // => "aaaafoo"
 * _.padLeft("foo", "", 5) // => "  foo"
 * _.padLeft("", "-", 5) // => "-----"
 *
 * @memberof module:lamb
 * @category String
 * @param {String} source
 * @param {String} [char=" "] - The padding char. If a string is passed only the first char is used.
 * @param {Number} len
 * @returns {String}
 */
function padLeft (source, char, len) {
    return _getPadding(source, char, len) + source;
}

/**
 * Pads a string to the desired length with the given char starting from the end of the string.
 * @example
 * _.padRight("foo", "-", 0) // => "foo"
 * _.padRight("foo", "-", -1) // => "foo"
 * _.padRight("foo", "-", 5) // => "foo--"
 * _.padRight("foo", "-", 3) // => "foo"
 * _.padRight("foo", "ab", 7) // => "fooaaaa"
 * _.padRight("foo", "", 5) // => "foo  "
 * _.padRight("", "-", 5) // => "-----"
 *
 * @memberof module:lamb
 * @category String
 * @param {String} source
 * @param {String} [char=" "] - The padding char. If a string is passed only the first char is used.
 * @param {Number} len
 * @returns {String}
 */
function padRight (source, char, len) {
    return source + _getPadding(source, char, len);
}

/**
 * Builds a new string by repeating the source string the desired amount of times.<br/>
 * Note that unlike the current ES6 proposal for [String.prototype.repeat]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat},
 * this function doesn't throw a RangeError if <code>count</code> is negative, but returns an empty string instead.
 * @example
 * _.repeat("Hello", -1) // => ""
 * _.repeat("Hello", 1) // => "Hello"
 * _.repeat("Hello", 3) // => "HelloHelloHello"
 *
 * @memberof module:lamb
 * @category String
 * @param {String} source
 * @param {Number} count
 * @returns {String}
 */
function repeat (source, count) {
    var result = "";

    for (var i = 0; i < count; i++) {
        result += source;
    }

    return result;
}

/**
 * Builds a predicate expecting a string to test against the given regular expression pattern.
 * @example
 * var hasNumbersOnly = _.testWith(/^\d+$/);
 *
 * hasNumbersOnly("123") // => true
 * hasNumbersOnly("123 Kg") // => false
 *
 * @memberof module:lamb
 * @category String
 * @param {RegExp} pattern
 * @returns {Function}
 */
function testWith (pattern) {
    return _reProto.test.bind(pattern);
}

lamb.padLeft = padLeft;
lamb.padRight = padRight;
lamb.repeat = repeat;
lamb.testWith = testWith;
