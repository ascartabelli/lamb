var lamb = require("../dist/lamb.js");
var equalities = require("./custom_equalities.js");

var concat = lamb.generic(Array.prototype.concat);

var coupleWithWrapper = function (values) {
    return values.reduce(function (result, value) {
        var ctor = Object.getPrototypeOf(value).constructor;

        return result.concat(value, new ctor(value));
    }, []);
};

var wrapInArray = function (value) {
    return [value];
};

var argsObject = (function () { return arguments; })();

var booleans = coupleWithWrapper([false, true]);

var nils = [null, void 0];

var numbersList = [-0.5, -0, 0, 0.5, -2.5, 2.5, 3];
var numbers = coupleWithWrapper(numbersList);

var objects = [Object.create(null), {}, {a: 1, b: 2}, argsObject];
var others = [function () {}, /foo/, NaN];

var charStrings = coupleWithWrapper(["", "foo", "2a"]);
var numberStrings = coupleWithWrapper(numbersList.map(String));
var strings = concat(charStrings, numberStrings);

var arraysCastableToNumber = concat(
    [[]],
    numbers.map(wrapInArray),
    numberStrings.map(wrapInArray)
);

// values expected to be converted to empty objects
var wannabeEmptyObjects = concat(booleans, others, numbers, new Date());

// values expected to be converted to empty arrays
var wannabeEmptyArrays = concat(wannabeEmptyObjects, objects);

// NaNs if converted to Number
var wannabeNaNs = concat(
    [[1, 2]],
    void 0,
    "2a",
    others,
    booleans.map(wrapInArray),
    objects.slice(1) // can't extract the primitive value of `Object.create(null)` and it's not worth adding checks for it
);

// values that will be transformed to zeroes (even negative zeroes) if casted to numbers
var zeroesAsNumbers = concat(
    [[]],
    nils,
    others,
    booleans.slice(0, 2),
    charStrings,
    objects.slice(1) // can't extract the primitive value of `Object.create(null)` and it's not worth adding checks for it
);

// values that will be transformed to zeroes (even negative zeroes) if casted to integers
// following this specification: https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger
var zeroesAsIntegers = concat(
    zeroesAsNumbers,
    numbers.slice(0, 8),
    numberStrings.slice(0, 8)
);

var nonStrings = concat(
    [[1, 2]],
    new Date(),
    {},
    true,
    false,
    1.5,
    nils,
    others
);
var nonStringsAsStrings = nonStrings.map(String);

var nonArrayLikes = concat(nils, wannabeEmptyArrays);

var nonFunctions = concat(
    [[1, 2]],
    new Date(),
    nils,
    others.slice(1),
    booleans,
    numbers,
    objects,
    strings
);

var nonNils = concat(
    [[1, 2]],
    new Date(),
    others,
    booleans,
    numbers,
    objects,
    strings
);
var nonNulls = concat([void 0], nonNils);
var nonUndefineds = concat([null], nonNils);

var nonNumbers = concat(
    [[1, 2]],
    new Date(),
    arraysCastableToNumber,
    nils,
    others,
    booleans,
    objects,
    strings
);

var valuesList = concat(nils, nonNils);

module.exports = {
    lamb: lamb,
    equalities: equalities,
    vars: lamb.immutable({
        nonStrings: nonStrings,
        nonStringsAsStrings: nonStringsAsStrings,
        nonArrayLikes: nonArrayLikes,
        nonFunctions: nonFunctions,
        nonNils: nonNils,
        nonNulls: nonNulls,
        nonNumbers: nonNumbers,
        nonUndefineds: nonUndefineds,
        valuesList: valuesList,
        wannabeEmptyArrays: wannabeEmptyArrays,
        wannabeEmptyObjects: wannabeEmptyObjects,
        wannabeNaNs: wannabeNaNs,
        zeroesAsIntegers: zeroesAsIntegers,
        zeroesAsNumbers: zeroesAsNumbers
    })
};
