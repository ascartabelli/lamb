var commons = require("../commons.js");

var lamb = commons.lamb;

var nonStrings = commons.vars.nonStrings;
var nonStringsAsStrings = commons.vars.nonStringsAsStrings;
var nonFunctions = commons.vars.nonFunctions;
var wannabeEmptyObjects = commons.vars.wannabeEmptyObjects;
var wannabeEmptyArrays = commons.vars.wannabeEmptyArrays;

describe("lamb.object", function () {
    describe("enumerables", function () {
        it("should build an array with all the enumerables keys of an object", function () {
            var baseFoo = Object.create({a: 1}, {b: {value: 2}});
            var foo = Object.create(baseFoo, {
                c: {value: 3},
                d: {value: 4, enumerable: true}
            });

            expect(lamb.enumerables(foo)).toEqual(["d", "a"]);
        });

        it("should work with arrays and array-like objects", function () {
            expect(lamb.enumerables([1, 2, 3])).toEqual(["0", "1", "2"]);
            expect(lamb.enumerables("abc")).toEqual(["0", "1", "2"]);
        });

        it("should retrieve only defined keys in sparse arrays", function () {
            expect(lamb.enumerables([, 5, 6, ,])).toEqual(["1", "2"]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.enumerables).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () {lamb.enumerables(null)}).toThrow();
            expect(function () {lamb.enumerables(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.enumerables(value)).toEqual([]);
            });
        });
    });

    describe("fromPairs", function () {
        it("should build an object from a list of key / value pairs", function () {
            expect(lamb.fromPairs([["a", 1], ["b", 2], ["c", 3]])).toEqual({a: 1, b: 2, c: 3});
        });

        it("should use the last key / value pair in case of duplicate keys", function () {
            expect(lamb.fromPairs([["a", 1], ["b", 2], ["a", 3]])).toEqual({a: 3, b: 2});
        });

        it("should convert missing or non-string keys to strings and missing values to `undefined`", function () {
            var pairs = [[1], [void 0, 2], [null, 3], [, 4], ["z", ,]];
            var result = {"1": void 0, "undefined": 2, "null": 3, "undefined": 4, "z": void 0};

            expect(lamb.fromPairs(pairs)).toEqual(result);
        });

        it("should return an empty object if supplied with an empty array", function () {
            expect(lamb.fromPairs([])).toEqual({});
        });

        it("should accept array-like objects as pairs", function () {
            expect(lamb.fromPairs(["a1", "b2"])).toEqual({"a": "1", "b": "2"});
        });

        it("should try to retrieve pairs from array-like objects", function () {
            expect(lamb.fromPairs("foo")).toEqual({"f": void 0, "o": void 0});
        });

        it("should throw an exception if any of the pairs is `nil`", function () {
            expect(function () { lamb.fromPairs([["a", 1], null, ["c", 3]]); }).toThrow();
            expect(function () { lamb.fromPairs([["a", 1], void 0, ["c", 3]]); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.fromPairs).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.fromPairs(null); }).toThrow();
            expect(function () { lamb.fromPairs(void 0); }).toThrow();
        });

        it("should treat every other value as an empty array and return an empty object", function () {
            wannabeEmptyArrays.forEach(function (value) {
                expect(lamb.fromPairs(value)).toEqual({});
            });
        });
    });

    describe("immutable", function () {
        var persons;
        var newPerson;

        beforeEach(function () {
            persons = [
                {"name": "Jane", "surname": "Doe", "age": 12, "city" : "New York"},
                {"name": "John", "surname": "Doe", "age": 40, "city" : "London"},
                {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"}
            ];

            newPerson = {
                "name": "Paolo",
                "surname": "Bianchi",
                "age": null,
                "city": "Amsterdam",
                "contact": {
                    "mail": "paolo@bianchi.it",
                    "phone": "+39123456789"
                },
                "luckyNumbers": [13, 17]
            };
        });

        it("should make an object immutable", function () {
            "use strict";

            var immutableNewPerson = lamb.immutable(newPerson);

            expect(immutableNewPerson).toBe(newPerson);
            expect(function () {
                newPerson.name = "Foo";
            }).toThrow();
            expect(function () {
                newPerson.luckyNumbers.splice(0, 1);
            }).toThrow();
            expect(Array.isArray(newPerson.luckyNumbers)).toBe(true);
            expect(newPerson.name).toBe("Paolo");

            var immutablePersons = lamb.immutable(persons);

            expect(immutablePersons).toBe(persons);
            expect(Array.isArray(immutablePersons)).toBe(true);
            expect(function () {
                persons.push(newPerson);
            }).toThrow();
            expect(persons.length).toBe(3);

            expect(function () {
                persons[0].age = 50;
            }).toThrow();
            expect(persons[0].age).toBe(12);
        });

        it("should handle circular references", function () {
            var foo = {
                bar: 2,
                baz: persons
            };
            persons.push(foo);

            lamb.immutable(persons);

            expect(Object.isFrozen(persons[3])).toBe(true);
            expect(persons[3].baz).toBe(persons);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.immutable).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () { lamb.immutable(null); }).toThrow();
            expect(function () { lamb.immutable(void 0); }).toThrow();
        });

        it("should not throw an exception when a `nil` value is in a nested property", function () {
            var o = {
                a: null,
                b: void 0,
                c: {d: null, e: void 0}
            };

            expect(function () { lamb.immutable(o); }).not.toThrow();
        });
    });

    describe("keys", function () {
        it("should build an array with all the enumerables own keys of an object", function () {
            var baseFoo = Object.create({a: 1}, {b: {value: 2}});
            var foo = Object.create(baseFoo, {
                c: {value: 3},
                d: {value: 4, enumerable: true}
            });

            expect(lamb.keys(foo)).toEqual(["d"]);
        });

        it("should work with arrays and array-like objects", function () {
            expect(lamb.keys([1, 2, 3])).toEqual(["0", "1", "2"]);
            expect(lamb.keys("abc")).toEqual(["0", "1", "2"]);
        });

        it("should retrieve only defined keys in sparse arrays", function () {
            expect(lamb.keys([, 5, 6, ,])).toEqual(["1", "2"]);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.keys).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () {lamb.keys(null)}).toThrow();
            expect(function () {lamb.keys(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.keys(value)).toEqual([]);
            });
        });
    });

    describe("make", function () {
        it("should build an object with the given keys and values lists", function () {
            expect(lamb.make(["a", "b", "c"], [1, 2, 3])).toEqual({a: 1, b: 2, c: 3});
        });

        it("should create undefined values if the keys list is longer", function () {
            expect(lamb.make(["a", "b", "c"], [1, 2])).toEqual({a: 1, b: 2, c: void 0});
        });

        it("should ignore extra values if the keys list is shorter", function () {
            expect(lamb.make(["a", "b"], [1, 2, 3])).toEqual({a: 1, b: 2});
        });

        it("should convert non-string keys to strings", function () {
            expect(lamb.make([null, void 0, 2], [1, 2, 3])).toEqual({"null": 1, "undefined": 2, "2": 3});
        });

        it("should convert unassigned or deleted indexes in sparse arrays to `undefined` values", function () {
            expect(lamb.make(["a", "b", "c"], [1, , 3])).toEqual({a: 1, b: void 0, c: 3});
            expect(lamb.make(["a", , "c"], [1, 2, 3])).toEqual({a: 1, "undefined": 2, c: 3});
        });

        it("should accept array-like objects in both parameters", function () {
            expect(lamb.make("abcd", "1234")).toEqual({a: "1", b: "2", c: "3", d: "4"});
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.make).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` in the `keys` or in the `values` parameter", function () {
            expect(function () {lamb.make(null, [])}).toThrow();
            expect(function () {lamb.make(void 0, [])}).toThrow();
            expect(function () {lamb.make([], null)}).toThrow();
            expect(function () {lamb.make([], void 0)}).toThrow();
        });

        it("should consider other values for the `keys` parameter as empty arrays and return an empty object", function () {
            wannabeEmptyArrays.forEach(function (v) {
                expect(lamb.make(v, [])).toEqual({});
            });
        });

        it("should consider other values for the `values` parameter to be empty arrays", function () {
            wannabeEmptyArrays.forEach(function (v) {
                expect(lamb.make(["foo", "bar"], v)).toEqual({"foo": void 0, "bar": void 0});
            });
        });
    });

    describe("merge / mergeOwn", function () {
        var baseFoo = Object.create({a: 1}, {b: {value: 2, enumerable: true}, z: {value: 5}});
        var foo = Object.create(baseFoo, {
            c: {value: 3, enumerable: true}
        });

        var bar = {d: 4};

        var fooEquivalent = {a: 1, b: 2, c: 3, z: 5};

        // seems that this version of jasmine (2.2.1) checks only own enumerable properties with the "toEqual" expectation
        afterEach(function () {
            for (var key in fooEquivalent) {
                expect(foo[key]).toEqual(fooEquivalent[key]);
            }

            expect(bar).toEqual({d: 4});
        });

        describe("merge", function () {
            it("should merge the enumerable properties of the provided sources into a new object without mutating them", function () {
                var newObj = lamb.merge(foo, bar);

                expect(newObj).toEqual({a: 1, b: 2, c: 3, d: 4});
                expect(newObj.z).toBeUndefined();
            });
        });

        describe("mergeOwn", function () {
            it("should merge the enumerable own properties of the provided sources into a new object without mutating them", function () {
                var newObj = lamb.mergeOwn(foo, bar);

                expect(newObj).toEqual({c: 3, d: 4});
                expect(newObj.a).toBeUndefined();
                expect(newObj.b).toBeUndefined();
                expect(newObj.z).toBeUndefined();
            });
        });

        it("should transform array-like objects in objects with numbered string as properties", function () {
            expect(lamb.merge([1, 2], {a: 2})).toEqual({"0": 1, "1": 2, "a": 2});
            expect(lamb.mergeOwn([1, 2], {a: 2})).toEqual({"0": 1, "1": 2, "a": 2});
            expect(lamb.merge("foo", {a: 2})).toEqual({"0": "f", "1": "o", "2": "o", "a": 2});
            expect(lamb.mergeOwn("foo", {a: 2})).toEqual({"0": "f", "1": "o", "2": "o", "a": 2});
        });

        it("should handle key homonymy by giving to each source precedence over the previous ones", function (){
            expect(lamb.merge({a: 1}, {b: 3, c: 4}, {b: 5})).toEqual({a: 1, b: 5, c: 4});
            expect(lamb.mergeOwn({a: 1}, {b: 3, c: 4}, {b: 5})).toEqual({a: 1, b: 5, c: 4});
        });

        it("should return an empty object if called without arguments", function () {
            expect(lamb.merge()).toEqual({});
            expect(lamb.mergeOwn()).toEqual({});
        });

        it("should throw an exception if called with `nil` values", function () {
            expect(function () { lamb.merge({a: 2}, null); }).toThrow();
            expect(function () { lamb.merge(null, {a: 2}); }).toThrow();
            expect(function () { lamb.merge({a: 2}, void 0); }).toThrow();
            expect(function () { lamb.merge(void 0, {a: 2}); }).toThrow();

            expect(function () { lamb.mergeOwn({a: 2}, null); }).toThrow();
            expect(function () { lamb.mergeOwn(null, {a: 2}); }).toThrow();
            expect(function () { lamb.mergeOwn({a: 2}, void 0); }).toThrow();
            expect(function () { lamb.mergeOwn(void 0, {a: 2}); }).toThrow();
        });

        it("should consider other values as empty objects", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.merge({a: 2}, value)).toEqual({a: 2});
                expect(lamb.merge(value, {a: 2})).toEqual({a: 2});

                expect(lamb.mergeOwn({a: 2}, value)).toEqual({a: 2});
                expect(lamb.mergeOwn(value, {a: 2})).toEqual({a: 2});
            });
        });
    });

    describe("ownPairs / pairs", function () {
        var baseFoo = Object.create({a: 1}, {b: {value: 2}});
        var foo = Object.create(baseFoo, {
            c: {value: 3},
            d: {value: 4, enumerable: true}
        });

        it("should convert an object in a list of key / value pairs", function () {
            var source = {a: 1, b: 2, c: 3};
            var result = [["a", 1], ["b", 2], ["c", 3]];

            expect(lamb.ownPairs(source)).toEqual(result);
            expect(lamb.pairs(source)).toEqual(result);
        });

        it("should keep `undefined` values in the result", function () {
            var source = {a: null, b: void 0};
            var result = [["a", null], ["b", void 0]];

            expect(lamb.ownPairs(source)).toEqual(result);
            expect(lamb.pairs(source)).toEqual(result);
        });

        it("should work with array-like objects", function () {
            var r1 = [["0", 1], ["1", 2],["2", 3]];
            var r2 = [["0", "a"], ["1", "b"],["2", "c"]];

            expect(lamb.ownPairs([1, 2, 3])).toEqual(r1);
            expect(lamb.ownPairs("abc")).toEqual(r2);
            expect(lamb.pairs([1, 2, 3])).toEqual(r1);
            expect(lamb.pairs("abc")).toEqual(r2);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.ownPairs).toThrow();
            expect(lamb.pairs).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () {lamb.ownPairs(null)}).toThrow();
            expect(function () {lamb.ownPairs(void 0)}).toThrow();
            expect(function () {lamb.pairs(null)}).toThrow();
            expect(function () {lamb.pairs(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.ownPairs(value)).toEqual([]);
                expect(lamb.pairs(value)).toEqual([]);
            });
        });

        describe("ownPairs", function () {
            it("should use only the own enumerable properties of the source object", function () {
                expect(lamb.ownPairs(foo)).toEqual([["d", 4]]);
            });
        });

        describe("pairs", function () {
            it("should use all the enumerable properties of the source object, inherited or not", function () {
                expect(lamb.pairs(foo)).toEqual([["d", 4], ["a", 1]]);
            });
        });
    });

    describe("ownValues / values", function () {
        var baseFoo = Object.create({a: 1}, {b: {value: 2}});
        var foo = Object.create(baseFoo, {
            c: {value: 3},
            d: {value: 4, enumerable: true}
        });

        it("should return an array of values of the given object properties", function () {
            var source = {a: 1, b: 2, c: 3};
            var result = [1, 2, 3];

            expect(lamb.ownValues(source)).toEqual(result);
            expect(lamb.values(source)).toEqual(result);
        });

        it("should accept array-like objects, returning an array copy of their values", function () {
            expect(lamb.ownValues([1, 2, 3])).toEqual([1, 2, 3]);
            expect(lamb.ownValues("abc")).toEqual(["a", "b", "c"]);
            expect(lamb.values([1, 2, 3])).toEqual([1, 2, 3]);
            expect(lamb.values("abc")).toEqual(["a", "b", "c"]);
        });

        it("should keep `undefined` values in the result", function () {
            var source = {a: null, b: void 0};
            var result = [null, void 0];

            expect(lamb.ownValues(source)).toEqual(result);
            expect(lamb.values(source)).toEqual(result);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.ownValues).toThrow();
            expect(lamb.values).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () {lamb.ownValues(null)}).toThrow();
            expect(function () {lamb.ownValues(void 0)}).toThrow();
            expect(function () {lamb.values(null)}).toThrow();
            expect(function () {lamb.values(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.ownValues(value)).toEqual([]);
                expect(lamb.values(value)).toEqual([]);
            });
        });

        describe("ownValues", function () {
            it("should pick only from the own enumerable properties of the given object", function () {
                expect(lamb.ownValues(foo)).toEqual([4]);
            });
        });

        describe("values", function () {
            it("should pick all the enumerable properties of the given object", function () {
                expect(lamb.values(foo)).toEqual([4, 1])
            });
        });
    });

    describe("Property filtering", function () {
        var baseSimpleObj = {"bar" : 2};
        var simpleObj = Object.create(baseSimpleObj, {
            "foo" : {value: 1, enumerable: true},
            "baz" : {value: 3, enumerable: true}
        });

        var persons = [
            {"name": "Jane", "surname": "Doe", "age": 12, "city": "New York"},
            {"name": "John", "surname": "Doe", "age": 40, "city": "London"},
            {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome"},
            {"name": "Paolo", "surname": "Bianchi", "age": 15, "city": "Amsterdam"}
        ];

        var agesAndCities = [
            {"age": 12, "city" : "New York"},
            {"age": 40, "city" : "London"},
            {"age": 18, "city": "Rome"},
            {"age": 15, "city": "Amsterdam"}
        ];

        var names = [
            {"name": "Jane", "surname": "Doe"},
            {"name": "John", "surname": "Doe"},
            {"name": "Mario", "surname": "Rossi"},
            {"name": "Paolo", "surname": "Bianchi"}
        ];

        var isNumber = function (v) { return typeof v === "number"; };
        var isNameKey = function (value, key) { return key.indexOf("name") !== -1; };

        // to check "truthy" and "falsy" values returned by predicates
        var isNameKey2 = function (value, key) { return ~key.indexOf("name"); };

        var oddObject = {};

        nonStringsAsStrings.forEach(function (key, idx) {
            oddObject[key] = idx;
        });

        describe("pick / pickKeys", function () {
            it("should return an object having only the specified properties of the source object (if they exist)", function () {
                expect(lamb.pick(simpleObj, ["foo", "baz", "foobaz"])).toEqual({"foo" : 1, "baz" : 3});
                expect(lamb.pickKeys(["foo", "baz", "foobaz"])(simpleObj)).toEqual({"foo" : 1, "baz" : 3});
            });

            it("should include inherited properties", function () {
                expect(lamb.pick(simpleObj, ["foo", "bar"])).toEqual({"foo": 1, "bar": 2});
                expect(lamb.pickKeys(["foo", "bar"])(simpleObj)).toEqual({"foo": 1, "bar": 2});
            });

            it("should include properties with `undefined` values in the result", function () {
                expect(lamb.pick({a: null, b: void 0}, ["a", "b"])).toEqual({a: null, b: void 0});
                expect(lamb.pickKeys(["a", "b"])({a: null, b: void 0})).toEqual({a: null, b: void 0});
            });

            it("should accept arrays and array-like objects and integers as keys", function () {
                var result = {
                    "0": {"name": "Jane", "surname": "Doe"},
                    "2": {"name": "Mario", "surname": "Rossi"}
                };

                expect(lamb.pick(names, ["0", 2])).toEqual(result);
                expect(lamb.pickKeys(["0", 2])(names)).toEqual(result);
                expect(lamb.pick("bar", [0, 2])).toEqual({"0": "b", "2": "r"});
                expect(lamb.pickKeys([0, 2])("bar")).toEqual({"0": "b", "2": "r"});
            });

            it("should see unassigned or deleted indexes in sparse arrays as non-existing keys", function () {
                expect(lamb.pick([1, , 3], [0, 1])).toEqual({"0": 1});
                expect(lamb.pickKeys([0, 1])([1, , 3])).toEqual({"0": 1});
            });

            it("should see unassigned or deleted indexes in sparse arrays received as the `whitelist` as `undefined` values", function () {
                expect(lamb.pick({"undefined": 1, a: 2, b: 3}, ["a", ,])).toEqual({"undefined": 1, a: 2});
                expect(lamb.pickKeys(["a", ,])({"undefined": 1, a: 2, b: 3})).toEqual({"undefined": 1, a: 2});
            });

            it("should return an empty object if supplied with an empty list of keys", function () {
                expect(lamb.pick(simpleObj, [])).toEqual({});
                expect(lamb.pickKeys([])(simpleObj)).toEqual({});
            });

            it("should accept an array-like object as the `whitelist` parameter", function () {
                expect(lamb.pick({a: 1, b: 2, c: 3}, "ac")).toEqual({a: 1, c: 3});
                expect(lamb.pickKeys("ac")({a: 1, b: 2, c: 3})).toEqual({a: 1, c: 3});
            });

            it("should convert to string every value in the `whitelist` parameter", function () {
                var testObj = lamb.merge({bar: "baz"}, oddObject);

                expect(lamb.pick(testObj, nonStringsAsStrings)).toEqual(oddObject);
                expect(lamb.pickKeys(nonStringsAsStrings)(testObj)).toEqual(oddObject);
            });

            it("should throw an exception if called without the main data argument", function () {
                expect(lamb.pick).toThrow();
                expect(lamb.pickKeys(["a", "b"])).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` in place of the `whitelist`", function () {
                expect(function () { lamb.pick({a: 1}, null); }).toThrow();
                expect(function () { lamb.pick({a: 1}, void 0); }).toThrow();
                expect(function () { lamb.pickKeys(null)({a: 1}); }).toThrow();
                expect(function () { lamb.pickKeys(void 0)({a: 1}); }).toThrow();
                expect(function () { lamb.pickKeys()({a: 1}); }).toThrow();
            });

            it("should treat other values for the `whitelist` parameter as an empty array and return an empty object", function () {
                wannabeEmptyArrays.forEach(function (value) {
                    expect(lamb.pick({a: 1, b: 2}, value)).toEqual({});
                    expect(lamb.pickKeys(value)({a: 1, b: 2})).toEqual({});
                });
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.pick(null, ["a", "b"]); }).toThrow();
                expect(function () { lamb.pick(void 0, ["a", "b"]); }).toThrow();
                expect(function () { lamb.pickKeys(["a", "b"])(null); }).toThrow();
                expect(function () { lamb.pickKeys(["a", "b"])(void 0); }).toThrow();
            });

            it("should convert to object every other value", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.pick(v, ["a"])).toEqual({});
                    expect(lamb.pickKeys(["a"])(v)).toEqual({});
                });

                expect(lamb.pick(/foo/, ["lastIndex"])).toEqual({"lastIndex": 0});
                expect(lamb.pickKeys(["lastIndex"])(/foo/)).toEqual({"lastIndex": 0});
            });
        });

        describe("pickIf", function () {
            it("should pick object properties using a predicate", function () {
                expect(lamb.pickIf(isNumber)(persons[0])).toEqual({"age": 12});
                expect(persons.map(lamb.pickIf(isNameKey))).toEqual(names);
            });

            it("should include properties with `undefined` values in the result", function () {
                expect(lamb.pickIf(lamb.isNil)({a: null, b: void 0})).toEqual({a: null, b: void 0});
            });

            it("should accept array-like objects", function () {
                var isEven = function (n) { return n % 2 === 0; };

                expect(lamb.pickIf(isEven)([1, 2, 3, 4])).toEqual({"1": 2, "3": 4});
                expect(lamb.pickIf(isEven)("1234")).toEqual({"1": "2", "3": "4"});
            });

            it("should not consider unassigned or deleted indexes in sparse arrays", function () {
                expect(lamb.pickIf(lamb.isUndefined)([1, , 3, void 0])).toEqual({"3": void 0});
            });

            it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
                expect(persons.map(lamb.pickIf(isNameKey2))).toEqual(names);
            });

            it("should throw an exception if the predicate isn't a function or if is missing", function () {
                nonFunctions.forEach(function (value) {
                    expect(function () { lamb.pickIf(value)({a: 2}); }).toThrow();
                });

                expect(function () { lamb.pickIf()({a: 2}); }).toThrow();
            });

            it("should throw an exception if the `source` is `null` or `undefined` or if is missing", function () {
                expect(lamb.pickIf(isNumber)).toThrow();
                expect(function () { lamb.pickIf(isNumber)(null); }).toThrow();
                expect(function () { lamb.pickIf(isNumber)(void 0); }).toThrow();
            });

            it("should convert to object every other value received as `source`", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.pickIf(isNumber)(v)).toEqual({});
                });
            });
        });

        describe("skip / skipKeys", function () {
            it("should return a copy of the given object without the specified properties", function () {
                expect(lamb.skip(simpleObj, ["bar", "baz"])).toEqual({"foo" : 1});
                expect(lamb.skipKeys(["bar", "baz"])(simpleObj)).toEqual({"foo" : 1});
            });

            it("should include inherited properties", function () {
                expect(lamb.skip(simpleObj, ["foo"])).toEqual({"bar": 2, "baz": 3});
                expect(lamb.skipKeys(["foo"])(simpleObj)).toEqual({"bar": 2, "baz": 3});
            });

            it("should include properties with `undefined` values in the result", function () {
                expect(lamb.skip({a: null, b: void 0}, ["c"])).toEqual({a: null, b: void 0});
                expect(lamb.skipKeys(["c"])({a: null, b: void 0})).toEqual({a: null, b: void 0});
            });

            it("should accept arrays and array-like objects and integers as keys", function () {
                var result = {
                    "0": {"name": "Jane", "surname": "Doe"},
                    "2": {"name": "Mario", "surname": "Rossi"}
                };

                expect(lamb.skip(names, ["1", 3])).toEqual(result);
                expect(lamb.skipKeys(["1", 3])(names)).toEqual(result);
                expect(lamb.skip("bar", [0, 2])).toEqual({"1": "a"});
                expect(lamb.skipKeys([0, 2])("bar")).toEqual({"1": "a"});
            });

            it("should see unassigned or deleted indexes in sparse arrays as non-existing keys", function () {
                expect(lamb.skip([1, , 3], [2])).toEqual({"0": 1});
                expect(lamb.skipKeys([2])([1, , 3])).toEqual({"0": 1});
            });

            it("should see unassigned or deleted indexes in sparse arrays received as the `blacklist` as `undefined` values", function () {
                expect(lamb.skip({"undefined": 1, a: 2, b: 3}, ["a", ,])).toEqual({b: 3});
                expect(lamb.skipKeys(["a", ,])({"undefined": 1, a: 2, b: 3})).toEqual({b: 3});
            });

            it("should return a copy of the source object if supplied with an empty list of keys", function () {
                var r1 = lamb.skip(simpleObj, []);
                var r2 = lamb.skipKeys([])(simpleObj);

                expect(r1).toEqual({"foo" : 1, "bar" : 2, "baz" : 3});
                expect(r1).not.toBe(simpleObj);
                expect(r2).toEqual({"foo" : 1, "bar" : 2, "baz" : 3});
                expect(r2).not.toBe(simpleObj);
            });

            it("should accept an array-like object as the `blacklist` parameter", function () {
                expect(lamb.skip({a: 1, b: 2, c: 3}, "ac")).toEqual({b: 2});
                expect(lamb.skipKeys("ac")({a: 1, b: 2, c: 3})).toEqual({b: 2});
            });

            it("should convert to string every value in the `blacklist` parameter", function () {
                var testObj = lamb.merge({bar: "baz"}, oddObject);

                expect(lamb.skip(testObj, nonStringsAsStrings)).toEqual({bar: "baz"});
                expect(lamb.skipKeys(nonStringsAsStrings)(testObj)).toEqual({bar: "baz"});
            });

            it("should throw an exception if called without the main data argument", function () {
                expect(lamb.skip).toThrow();
                expect(lamb.skipKeys(["a", "b"])).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` in place of the `blacklist`", function () {
                expect(function () { lamb.skip({a: 1}, null); }).toThrow();
                expect(function () { lamb.skip({a: 1}, void 0); }).toThrow();
                expect(function () { lamb.skipKeys(null)({a: 1}); }).toThrow();
                expect(function () { lamb.skipKeys(void 0)({a: 1}); }).toThrow();
                expect(function () { lamb.skipKeys()({a: 1}); }).toThrow();

            });

            it("should treat other values for the `blacklist` parameter as an empty array and return a copy of the source object", function () {
                wannabeEmptyArrays.forEach(function (value) {
                    var r1 = lamb.skip(simpleObj, value);
                    var r2 = lamb.skipKeys(value)(simpleObj);

                    expect(r1).toEqual({"foo" : 1, "bar" : 2, "baz" : 3});
                    expect(r1).not.toBe(simpleObj);
                    expect(r2).toEqual({"foo" : 1, "bar" : 2, "baz" : 3});
                    expect(r2).not.toBe(simpleObj);
                });
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.skip(null, ["a", "b"]); }).toThrow();
                expect(function () { lamb.skip(void 0, ["a", "b"]); }).toThrow();
                expect(function () { lamb.skipKeys(["a", "b"])(null); }).toThrow();
                expect(function () { lamb.skipKeys(["a", "b"])(void 0); }).toThrow();
            });

            it("should convert to object every other value", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.skip(v, ["a"])).toEqual({});
                    expect(lamb.skipKeys(["a"])(v)).toEqual({});
                });

                expect(lamb.skip(/foo/, ["lastIndex"])).toEqual({});
                expect(lamb.skipKeys(["lastIndex"])(/foo/)).toEqual({});
            });
        });

        describe("skipIf", function () {
            it("should skip object properties using a predicate", function () {
                expect(lamb.skipIf(isNumber)(persons[0])).toEqual({"name": "Jane", "surname": "Doe", "city": "New York"});
                expect(persons.map(lamb.skipIf(isNameKey))).toEqual(agesAndCities);
            });

            it("should include properties with `undefined` values in the result", function () {
                expect(lamb.skipIf(lamb.not(lamb.isNil))({a: null, b: void 0})).toEqual({a: null, b: void 0});
            });

            it("should accept array-like objects", function () {
                var isEven = function (n) { return n % 2 === 0; };

                expect(lamb.skipIf(isEven)([1, 2, 3, 4])).toEqual({"0": 1, "2": 3});
                expect(lamb.skipIf(isEven)("1234")).toEqual({"0": "1", "2": "3"});
            });

            it("should not consider unassigned or deleted indexes in sparse arrays", function () {
                expect(lamb.skipIf(lamb.not(lamb.isUndefined))([1, , 3, void 0])).toEqual({"3": void 0});
            });

            it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
                expect(persons.map(lamb.skipIf(isNameKey2))).toEqual(agesAndCities);
            });

            it("should throw an exception if the predicate isn't a function or if is missing", function () {
                nonFunctions.forEach(function (value) {
                    expect(function () { lamb.skipIf(value)({a: 2}); }).toThrow();
                });

                expect(function () { lamb.skipIf()({a: 2}); }).toThrow();
            });

            it("should throw an exception if the `source` is `null` or `undefined` or if is missing", function () {
                expect(lamb.skipIf(isNumber)).toThrow();
                expect(function () { lamb.skipIf(isNumber)(null); }).toThrow();
                expect(function () { lamb.skipIf(isNumber)(void 0); }).toThrow();
            });

            it("should convert to object every other value received as `source`", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.skipIf(isNumber)(v)).toEqual({});
                });
            });
        });
    });

    describe("rename / renameKeys / renameWith", function () {
        var baseObj = {"": 0, a: 1, b: 2, c: 3, d: 4};
        var obj = Object.create(baseObj, {
            e: {value: 5, enumerable: true},
            f: {value: 6}
        });
        var objEquivalent = {"": 0, a: 1, b: 2, c: 3, d: 4, e: 5};

        // seems that this version of jasmine (2.2.1) checks only own enumerable properties with the "toEqual" expectation
        afterEach(function () {
            for (var key in objEquivalent) {
                expect(obj[key]).toEqual(objEquivalent[key]);
            }

            expect(obj.f).toBe(6);
        });

        describe("renameWith", function () {
            it("should use the provided function to generate a keys' map for `rename`", function () {
                var person = {"NAME": "John", "SURNAME": "Doe"};
                var makeLowerKeysMap = function (source) {
                    var sourceKeys = lamb.keys(source);
                    return lamb.make(sourceKeys, sourceKeys.map(lamb.invoker("toLowerCase")));
                };
                var renameSpy = jasmine.createSpy().and.callFake(makeLowerKeysMap);

                expect(lamb.renameWith(renameSpy)(person)).toEqual({"name": "John", "surname": "Doe"});
                expect(renameSpy.calls.count()).toBe(1);
                expect(renameSpy.calls.argsFor(0).length).toBe(1);
                expect(renameSpy.calls.argsFor(0)[0]).toBe(person);
            });

            it("should build a function throwing an exception if `fn` isn't a function or is missing", function () {
                nonFunctions.forEach(function (value) {
                    expect(lamb.renameWith(value)).toThrow();
                });

                expect(lamb.renameWith()).toThrow();
            });
        });

        it("should rename the keys of the given object according to the provided keys' map", function () {
            var keysMap = {a: "w", b: "x", c: "y", d: "z"};
            var result = {"": 0, w: 1, x: 2, y: 3, z: 4, e: 5};

            expect(lamb.rename(obj, keysMap)).toEqual(result);
            expect(lamb.renameKeys(keysMap)(obj)).toEqual(result);
            expect(lamb.renameWith(lamb.always(keysMap))(obj)).toEqual(result);
        });

        it("should be possible to use existing key names", function () {
            var keysMap = {c: "x", e: "b", b: "e"};
            var result = {"": 0, a: 1, e: 2, x: 3, d: 4, b: 5};

            expect(lamb.rename(obj, keysMap)).toEqual(result);
            expect(lamb.renameKeys(keysMap)(obj)).toEqual(result);
            expect(lamb.renameWith(lamb.always(keysMap))(obj)).toEqual(result);
        });

        it("should not add non-existing keys", function () {
            var keysMap = {z: "x", y: "c"};
            var r1 = lamb.rename(obj, keysMap);
            var r2 = lamb.renameKeys(keysMap)(obj);
            var r3 = lamb.renameWith(lamb.always(keysMap))(obj);

            expect(r1).toEqual(objEquivalent);
            expect(r2).toEqual(objEquivalent);
            expect(r3).toEqual(objEquivalent);
            expect(r1).not.toBe(obj);
            expect(r2).not.toBe(obj);
            expect(r3).not.toBe(obj);
        });

        it("should give priority to the map and overwrite an existing key if necessary", function () {
            var keysMap = {a: "", b: "c"};
            var result = {"" : 1, c: 2, d: 4, e: 5};

            expect(lamb.rename(obj, keysMap)).toEqual(result);
            expect(lamb.renameKeys(keysMap)(obj)).toEqual(result);
            expect(lamb.renameWith(lamb.always(keysMap))(obj)).toEqual(result);
        });

        it("should return a copy of the source if the keys' map is empty or contains only non-enumerable properties", function () {
            var r1 = lamb.rename(obj, {});
            var r2 = lamb.renameKeys({})(obj);
            var r3 = lamb.renameWith(lamb.always({}))(obj);
            var r4 = lamb.rename(obj, {f: "z"});
            var r5 = lamb.renameKeys({f: "z"})(obj);
            var r6 = lamb.renameWith(lamb.always({f: "z"}))(obj);
            expect(r1).toEqual(objEquivalent);
            expect(r2).toEqual(objEquivalent);
            expect(r3).toEqual(objEquivalent);
            expect(r4).toEqual(objEquivalent);
            expect(r5).toEqual(objEquivalent);
            expect(r6).toEqual(objEquivalent);
            expect(r1).not.toBe(obj);
            expect(r2).not.toBe(obj);
            expect(r3).not.toBe(obj);
            expect(r4).not.toBe(obj);
            expect(r5).not.toBe(obj);
            expect(r6).not.toBe(obj);
        });

        it("should accept array-like objects as a source", function () {
            var arr = [1, 2, 3];
            var s = "foo";
            var keysMap = {"0": "a", "1": "b", "2": "c"};
            var r1 = {a: 1, b: 2, c: 3};
            var r2 = {a: "f", b: "o", c: "o"};

            expect(lamb.rename(arr, keysMap)).toEqual(r1);
            expect(lamb.rename(s, keysMap)).toEqual(r2);
            expect(lamb.renameKeys(keysMap)(arr)).toEqual(r1);
            expect(lamb.renameKeys(keysMap)(s)).toEqual(r2);
            expect(lamb.renameWith(lamb.always(keysMap))(arr)).toEqual(r1);
            expect(lamb.renameWith(lamb.always(keysMap))(s)).toEqual(r2);
        });

        it("should not consider unassigned or deleted indexes when the source is a sparse array", function () {
            var arr = [1, , 3];
            var keysMap = {"0": "a", "1": "b", "2": "c"};
            var result = {a: 1, c: 3};

            expect(lamb.rename(arr, keysMap)).toEqual(result);
            expect(lamb.renameKeys(keysMap)(arr)).toEqual(result);
            expect(lamb.renameWith(lamb.always(keysMap))(arr)).toEqual(result);
        });

        it("should accept array-like objects as key maps", function () {
            var arr = [1, 2, 3];
            var s = "bar";
            var someObj = {"0": "a", "1": "b", "2": "c"};
            var r1 = {"1": "a", "2": "b", "3": "c"};
            var r2 = {"b": "a", "a": "b", "r": "c"};

            expect(lamb.rename(someObj, arr)).toEqual(r1);
            expect(lamb.rename(someObj, s)).toEqual(r2);
            expect(lamb.renameKeys(arr)(someObj)).toEqual(r1);
            expect(lamb.renameKeys(s)(someObj)).toEqual(r2);
            expect(lamb.renameWith(lamb.always(arr))(someObj)).toEqual(r1);
            expect(lamb.renameWith(lamb.always(s))(someObj)).toEqual(r2);
        });

        it("should not consider unassigned or deleted indexes when a sparse array is supplied as a key map", function () {
            var someObj = {"0": "a", "1": "b", "2": "c"};
            var arrKeyMap = [1, , 3];
            var result = {"1": "a", "3": "c"};

            expect(lamb.rename(someObj, arrKeyMap)).toEqual(result);
            expect(lamb.renameKeys(arrKeyMap)(someObj)).toEqual(result);
            expect(lamb.renameWith(lamb.always(arrKeyMap))(someObj)).toEqual(result);
        });

        it("should return a copy of the source object for any other value passed as the keys' map", function () {
            wannabeEmptyObjects.forEach(function (value) {
                var r1 = lamb.rename(obj, value);
                var r2 = lamb.renameKeys(value)(obj);
                var r3 = lamb.renameWith(lamb.always(value))(obj);
                expect(r1).toEqual(objEquivalent);
                expect(r2).toEqual(objEquivalent);
                expect(r3).toEqual(objEquivalent);
                expect(r1).not.toBe(obj);
                expect(r2).not.toBe(obj);
                expect(r3).not.toBe(obj);
            });
        });

        it("should throw an exception if called without the source or the keys' map", function () {
            expect(lamb.rename).toThrow();
            expect(lamb.renameKeys()).toThrow();
            expect(lamb.renameWith(lamb.always({}))).toThrow();
        });

        it("should throw an exception if the source is `null` or `undefined`", function () {
            expect(function () { lamb.rename(null, {}); }).toThrow();
            expect(function () { lamb.rename(void 0, {}); }).toThrow();
            expect(function () { lamb.renameKeys({})(null); }).toThrow();
            expect(function () { lamb.renameKeys({})(void 0); }).toThrow();
            expect(function () { lamb.renameWith(lamb.always({}))(null); }).toThrow();
            expect(function () { lamb.renameWith(lamb.always({}))(void 0); }).toThrow();
        });

        it("should return an empty object for any other value passed as the source object", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.rename(value, {"0": 9})).toEqual({});
                expect(lamb.renameKeys({"0": 9})(value)).toEqual({});
                expect(lamb.renameWith(lamb.always({"0": 9}))(value)).toEqual({});
            });
        });
    });

    describe("tear / tearOwn", function () {
        var baseFoo = Object.create({a: 1}, {b: {value: 2}});
        var foo = Object.create(baseFoo, {
            c: {value: 3},
            d: {value: 4, enumerable: true}
        });

        it("should transform an object in two lists, one containing its keys, the other containing the corresponding values", function () {
            expect(lamb.tear({a: 1, b: 2, c: 3})).toEqual([["a", "b", "c"], [1, 2, 3]]);
            expect(lamb.tearOwn({a: 1, b: 2, c: 3})).toEqual([["a", "b", "c"], [1, 2, 3]]);
        });

        it("should work with array-like objects", function () {
            var r1 = [["0", "1", "2"], [1, 2, 3]];
            var r2 = [["0", "1", "2"], ["a", "b", "c"]];

            expect(lamb.tear([1, 2, 3])).toEqual(r1);
            expect(lamb.tear("abc")).toEqual(r2);
            expect(lamb.tearOwn([1, 2, 3])).toEqual(r1);
            expect(lamb.tearOwn("abc")).toEqual(r2);
        });

        it("should keep `undefined` values in the result", function () {
            var source = {a: null, b: void 0};
            var result = [["a", "b"], [null, void 0]];

            expect(lamb.tear(source)).toEqual(result);
            expect(lamb.tearOwn(source)).toEqual(result);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.tear).toThrow();
            expect(lamb.tearOwn).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined`", function () {
            expect(function () {lamb.tear(null)}).toThrow();
            expect(function () {lamb.tear(void 0)}).toThrow();
            expect(function () {lamb.tearOwn(null)}).toThrow();
            expect(function () {lamb.tearOwn(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            wannabeEmptyObjects.forEach(function (value) {
                expect(lamb.tear(value)).toEqual([[], []]);
                expect(lamb.tearOwn(value)).toEqual([[], []]);
            });
        });

        describe("tear", function () {
            it("should use all the enumerable properties of the source object, inherited or not", function () {
                expect(lamb.tear(foo)).toEqual([["d", "a"], [4, 1]]);
            });
        });

        describe("tearOwn", function () {
            it("should use only the own enumerable properties of the source object", function () {
                expect(lamb.tearOwn(foo)).toEqual([["d"], [4]]);
            });
        });
    });
});
