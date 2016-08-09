
    /* istanbul ignore next */
    if (typeof exports === "object") {
        module.exports = lamb;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return lamb;
        });
    } else {
        host.lamb = lamb;
    }
})(this);

/**
 * @callback AccumulatorCallback
 * @global
 * @param {*} previousValue - The value returned it the last execution of the accumulator or, in the first
 * iteration, the {@link module:lamb.reduce|initialValue} if supplied.
 * @param {*} currentValue - The value being processed in the current iteration.
 * @param {Number} idx - The index of the element being processed.
 * @param {ArrayLike} arrayLike - The list being traversed.
 */

/**
 * The built-in arguments object.
 * @typedef {arguments} arguments
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments|arguments} in Mozilla documentation.
 */

/**
 * The built-in Array object.
 * @typedef {Array} Array
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array|Array} in Mozilla documentation.
 */

/**
 * Any array-like object.
 * @typedef {Array|String|arguments|?} ArrayLike
 * @global
 */

/**
 * The built-in Boolean object.
 * @typedef {Boolean} Boolean
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean|Boolean} in Mozilla documentation.
 */

/**
 * The built-in Date object.
 * @typedef {Date} Date
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|Date} in Mozilla documentation.
 */

/**
 * The built-in Function object.
 * @typedef {Function} function
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function|Function} and
 *      {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions|Functions} in Mozilla documentation.
 */

/**
 * @callback ListIteratorCallback
 * @global
 * @param {*} element - The element being evaluated.
 * @param {Number} idx - The index of the element within the list.
 * @param {ArrayLike} arrayLike - The list being traversed.
 */

/**
 * The built-in Number object.
 * @typedef {Number} Number
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number|Number} in Mozilla documentation.
 */

/**
 * The built-in Object object.
 * @typedef {Object} Object
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object|Object} in Mozilla documentation.
 */

/**
 * @callback ObjectIteratorCallback
 * @global
 * @param {*} value - The value of the current property.
 * @param {String} key - The property name.
 * @param {Object} source - The object being traversed.
 */

/**
 * The built-in RegExp object.
 * @typedef {RegExp} RegExp
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp|RegExp} in Mozilla documentation.
 */

/**
 * Represent a sorting criteria used by {@link module:lamb.sortedInsert|sortedInsert},
 * {@link module:lamb.sort|sort} and {@link module:lamb.sortWith|sortWith}, and it's
 * usually built using {@link module:lamb.sorter|sorter} and {@link module:lamb.sorterDesc|sorterDesc}.
 * @typedef {Sorter} Sorter
 * @global
 * @property {Boolean} isDescending
 * @property {Function} compare
 */

/**
 * The built-in String object.
 * @typedef {String} String
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String|String} in Mozilla documentation.
 */

/**
 * The built-in primitive value <code>undefined</code>
 * @typedef {Undefined} Undefined
 * @global
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined|undefined} in Mozilla documentation.
 */
