const generic = Function.bind.bind(Function.call);
const concat = generic(Array.prototype.concat);

const coupleWithWrapper = values => values.reduce((result, value) => {
    const Ctor = Object.getPrototypeOf(value).constructor;

    return result.concat(value, new Ctor(value));
}, []);

const wrapInArray = value => [value];

const argsObject = (function () { return arguments; })();

const booleans = coupleWithWrapper([false, true]);

const nils = [null, void 0];

const numbersList = [-0.5, -0, 0, 0.5, -2.5, 2.5, 3];
const numbers = coupleWithWrapper(numbersList);

const objects = [Object.create(null), {}, { a: 1, b: 2 }, argsObject];

// discarding the first element in `objects` because you can't extract the
// primitive value of `Object.create(null)` and it's not worth adding checks for it
const objectsWithPrimitiveValue = objects.slice(1);

const others = [function () {}, /foo/, NaN];

const charStrings = coupleWithWrapper(["", "foo", "2a"]);
const numberStrings = coupleWithWrapper(numbersList.map(String));
const strings = concat(charStrings, numberStrings);

const arraysCastableToNumber = concat(
    [[]],
    numbers.map(wrapInArray),
    numberStrings.map(wrapInArray)
);

// values expected to be converted to empty objects
const wannabeEmptyObjects = concat(booleans, others, numbers, new Date(), "");

// values expected to be converted to empty arrays
const wannabeEmptyArrays = concat(wannabeEmptyObjects, objects);

// NaNs if converted to Number
const wannabeNaNs = concat(
    [[1, 2]],
    void 0,
    "2a",
    others,
    booleans.map(wrapInArray),
    objectsWithPrimitiveValue
);

// values that will be transformed to zeroes (even negative zeroes) if casted to numbers
const zeroesAsNumbers = concat(
    [[]],
    nils,
    others,
    booleans.slice(0, 2),
    charStrings,
    objectsWithPrimitiveValue
);

// values that will be transformed to zeroes (even negative zeroes) if casted to integers
// following this specification: https://www.ecma-international.org/ecma-262/7.0/#sec-tointeger
const zeroesAsIntegers = concat(
    zeroesAsNumbers,
    numbers.slice(0, 8),
    numberStrings.slice(0, 8)
);

const nonStrings = concat(
    [[1, 2]],
    new Date(),
    {},
    true,
    false,
    1.5,
    nils,
    others
);
const nonStringsAsStrings = nonStrings.map(String);

const nonArrayLikes = concat(nils, wannabeEmptyArrays);

const nonFunctions = concat(
    [[1, 2]],
    new Date(),
    nils,
    others.slice(1),
    booleans,
    numbers,
    objects,
    strings
);

const nonNils = concat(
    [[1, 2]],
    new Date(),
    others,
    booleans,
    numbers,
    objects,
    strings
);
const nonNulls = concat([void 0], nonNils);
const nonUndefineds = concat([null], nonNils);

const nonNumbers = concat(
    [[1, 2]],
    new Date(),
    arraysCastableToNumber,
    nils,
    others,
    booleans,
    objects,
    strings
);

const valuesList = concat(nils, nonNils);

export {
    nonStrings,
    nonStringsAsStrings,
    nonArrayLikes,
    nonFunctions,
    nonNils,
    nonNulls,
    nonNumbers,
    nonUndefineds,
    valuesList,
    wannabeEmptyArrays,
    wannabeEmptyObjects,
    wannabeNaNs,
    zeroesAsIntegers,
    zeroesAsNumbers
};
