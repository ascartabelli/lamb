var lamb = require("../../dist/lamb.js");

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

        it("should throw an exception if supplied with `null` or `undefined´", function () {
            expect(function () {lamb.enumerables(null)}).toThrow();
            expect(function () {lamb.enumerables(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            expect(
                [/foo/, 1, function () {}, NaN, true, new Date()].map(lamb.enumerables)
            ).toEqual([[], [], [], [], [], []]);
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
            expect(lamb.fromPairs([[1], [void 0, 2], [null, 3]])).toEqual({"1": void 0, "undefined": 2, "null": 3});
        });
    });

    describe("Property checking", function () {
        var obj = {"foo" : "bar"};

        describe("has", function () {
            it("should check the existence of the property in an object", function () {
                expect(lamb.has(obj, "toString")).toBe(true);
                expect(lamb.has(obj, "foo")).toBe(true);
                expect(lamb.has(obj, "baz")).toBe(false);
            });
        });

        describe("hasKey", function () {
            it("should build a function expecting an object to check for the existence of the given property", function () {
                var hasToString = lamb.hasKey("toString");
                var hasFoo = lamb.hasKey("foo");
                var hasBaz = lamb.hasKey("baz");

                expect(hasToString(obj)).toBe(true);
                expect(hasFoo(obj)).toBe(true);
                expect(hasBaz(obj)).toBe(false);
            });
        });

        describe("hasOwn / hasOwnKey", function () {
            it("should check the existence of an owned property in an object", function () {
                expect(lamb.hasOwn(obj, "toString")).toBe(false);
                expect(lamb.hasOwn(obj, "foo")).toBe(true);
                expect(lamb.hasOwn(obj, "baz")).toBe(false);
                expect(lamb.hasOwnKey("toString")(obj)).toBe(false);
                expect(lamb.hasOwnKey("foo")(obj)).toBe(true);
                expect(lamb.hasOwnKey("baz")(obj)).toBe(false);
            });

            it("should return `false` for a non-existent property", function () {
                expect(lamb.hasOwn(obj, "z")).toBe(false);
                expect(lamb.hasOwnKey("z")(obj)).toBe(false);
            });

            it("should accept integers as keys and accept array-like objects", function () {
                var o = {"1": "a", "2": "b"};
                var arr = [1, 2, 3, 4];
                var s = "abcd";

                expect(lamb.hasOwn(o, 2)).toBe(true);
                expect(lamb.hasOwn(arr, 2)).toBe(true);
                expect(lamb.hasOwn(s, 2)).toBe(true);
                expect(lamb.hasOwnKey(2)(o)).toBe(true);
                expect(lamb.hasOwnKey(2)(arr)).toBe(true);
                expect(lamb.hasOwnKey(2)(s)).toBe(true);
            });

            it("should throw an exception if supplied with `null` or `undefined´ instead of an object", function () {
                expect(function () { lamb.hasOwn(null, "a"); }).toThrow();
                expect(function () { lamb.hasOwn(void 0, "a"); }).toThrow();
                expect(function () { lamb.hasOwnKey("a")(null); }).toThrow();
                expect(function () { lamb.hasOwnKey("a")(void 0); }).toThrow();
            });

            it("should return `false` for every other value and when the key isn't a string or an integer", function () {
                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (v) {
                    expect(lamb.hasOwn(v, "a")).toBe(false);
                    expect(lamb.hasOwn(obj, v)).toBe(false);
                    expect(lamb.hasOwnKey("a")(v)).toBe(false);
                    expect(lamb.hasOwnKey(v)(obj)).toBe(false);
                });
            });
        });
    });

    describe("hasKeyValue", function () {
        var persons = [
            {"name": "Jane", "surname": "Doe"},
            {"name": "John", "surname": "Doe"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var isDoe = lamb.hasKeyValue("surname", "Doe");

        it("should build a function that checks if an object holds the desired key / value pair", function () {
            expect(persons.map(isDoe)).toEqual([true, true, false]);
        });

        it("should return `false` for a non-existent property", function () {
            expect(lamb.hasKeyValue("z", 2)(persons[0])).toBe(false);
        });

        it("should accept integers as keys and accept array-like objects", function () {
            var o = {"1": "a", "2": "b"};
            var arr = [1, 2, 3, 4];
            var s = "abcd";

            expect(lamb.hasKeyValue(2, "b")(o)).toBe(true);
            expect(lamb.hasKeyValue(2, 3)(arr)).toBe(true);
            expect(lamb.hasKeyValue(2, "c")(s)).toBe(true);
        });

        it("should throw an exception if supplied with `null` or `undefined´ instead of an object", function () {
            expect(function () { lamb.hasKeyValue("a", 2)(null); }).toThrow();
            expect(function () { lamb.hasKeyValue("a", 2)(void 0); }).toThrow();
        });

        it("should return `false` for every other value and when the key isn't a string or an integer", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (v) {
                expect(lamb.hasKeyValue("a", 2)(v)).toBe(false);
                expect(lamb.hasKeyValue(v, 2)(persons[0])).toBe(false);
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

        it("should throw an exception if supplied with `null` or `undefined´", function () {
            expect(function () {lamb.keys(null)}).toThrow();
            expect(function () {lamb.keys(void 0)}).toThrow();
        });

        it("should consider other values as empty objects", function () {
            expect(
                [/foo/, 1, function () {}, NaN, true, new Date()].map(lamb.keys)
            ).toEqual([[], [], [], [], [], []]);
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

        it("should consider values other than objects or array-like objects as empty objects", function () {
            expect(lamb.merge({a: 2}, /foo/, 1, function () {}, null, NaN, void 0, true, new Date())).toEqual({a: 2});
            expect(lamb.mergeOwn({a: 2}, /foo/, 1, function () {}, null, NaN, void 0, true, new Date())).toEqual({a: 2});
            expect(lamb.merge(/foo/, 1, function () {}, null, NaN, void 0, true, new Date())).toEqual({});
            expect(lamb.mergeOwn(/foo/, 1, function () {}, null, NaN, void 0, true, new Date())).toEqual({});
        });

        it("should transform array-like objects in objects with numbered string as properties", function () {
            expect(lamb.merge([1, 2], {a: 2})).toEqual({"0": 1, "1": 2, "a": 2});
            expect(lamb.mergeOwn([1, 2], {a: 2})).toEqual({"0": 1, "1": 2, "a": 2});
            expect(lamb.merge("foo", {a: 2})).toEqual({"0": "f", "1": "o", "2": "o", "a": 2});
            expect(lamb.mergeOwn("foo", {a: 2})).toEqual({"0": "f", "1": "o", "2": "o", "a": 2});
        });

        describe("merge", function () {
            it("should merge the enumerable properties of the provided sources into a new object without mutating them", function () {
                var newObj = lamb.merge(foo, bar);

                expect(newObj).toEqual({a: 1, b: 2, c: 3, d: 4});
                expect(newObj.z).toBeUndefined();
            });

            it("should handle key homonymy by giving to each source precedence over the previous ones", function (){
                expect(lamb.merge({a: 1}, {b: 3, c: 4}, {b: 5})).toEqual({a: 1, b: 5, c: 4});
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

            it("should handle key homonymy by giving to each source precedence over the previous ones", function (){
                expect(lamb.mergeOwn({a: 1}, {b: 3, c: 4}, {b: 5})).toEqual({a: 1, b: 5, c: 4});
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

        it("should throw an exception if supplied with `null` or `undefined´", function () {
            expect(function () {lamb.ownPairs(null)}).toThrow();
            expect(function () {lamb.ownPairs(void 0)}).toThrow();
            expect(function () {lamb.pairs(null)}).toThrow();
            expect(function () {lamb.pairs(void 0)}).toThrow();
        });

        it("should work with array-like objects", function () {
            var r1 = [["0", 1], ["1", 2],["2", 3]];
            var r2 = [["0", "a"], ["1", "b"],["2", "c"]];

            expect(lamb.ownPairs([1, 2, 3])).toEqual(r1);
            expect(lamb.ownPairs("abc")).toEqual(r2);
            expect(lamb.pairs([1, 2, 3])).toEqual(r1);
            expect(lamb.pairs("abc")).toEqual(r2);
        });

        it("should consider other values as empty objects", function () {
            var others = [/foo/, 1, function () {}, NaN, true, new Date()];

            expect(others.map(lamb.ownPairs)).toEqual([[], [], [], [], [], []]);
            expect(others.map(lamb.pairs)).toEqual([[], [], [], [], [], []]);
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

        it("should throw an exception if supplied with `null` or `undefined´", function () {
            expect(function () {lamb.ownValues(null)}).toThrow();
            expect(function () {lamb.ownValues(void 0)}).toThrow();
            expect(function () {lamb.values(null)}).toThrow();
            expect(function () {lamb.values(void 0)}).toThrow();
        });

        it("should accept array-like objects, returning an array copy of their values", function () {
            expect(lamb.ownValues([1, 2, 3])).toEqual([1, 2, 3]);
            expect(lamb.ownValues("abc")).toEqual(["a", "b", "c"]);
            expect(lamb.values([1, 2, 3])).toEqual([1, 2, 3]);
            expect(lamb.values("abc")).toEqual(["a", "b", "c"]);
        });

        it("should consider other values as empty objects", function () {
            var others = [/foo/, 1, function () {}, NaN, true, new Date()];

            expect(others.map(lamb.ownValues)).toEqual([[], [], [], [], [], []]);
            expect(others.map(lamb.values)).toEqual([[], [], [], [], [], []]);
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
        var simpleObj = {"foo" : 1, "bar" : 2, "baz" : 3};

        var persons = [
            {"name": "Jane", "surname": "Doe", "age": 12, "city" : "New York"},
            {"name": "John", "surname": "Doe", "age": 40, "city" : "London"},
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

        var isNameKey = function (value, key) { return key.indexOf("name") !== -1; };

        describe("pick", function () {
            it("should return an object having only the specified properties of the source object (if they exist)", function () {

                var expected = {"foo" : 1, "baz" : 3};
                var result = lamb.pick(simpleObj, ["foo", "baz", "foobaz"]);

                expect(result).toEqual(expected);
            });
        });

        describe("pickIf", function () {
            it("should pick object properties using a predicate", function () {
                expect(persons.map(lamb.pickIf(isNameKey))).toEqual(names);
            });
        });

        describe("skip", function () {
            it("should return a copy of the given object without the specified properties", function () {
                var expected = {"foo" : 1};
                var result = lamb.skip(simpleObj, ["bar", "baz"]);

                expect(result).toEqual(expected);
            });
        });

        describe("skipIf", function () {
            it("should skip object properties using a predicate", function () {
                expect(persons.map(lamb.skipIf(isNameKey))).toEqual(agesAndCities);
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

        it("should throw an exception if the source is null or undefined", function () {
            expect(function () { lamb.rename(null, {}); }).toThrow();
            expect(function () { lamb.rename(void 0, {}); }).toThrow();
            expect(function () { lamb.renameKeys({})(null); }).toThrow();
            expect(function () { lamb.renameKeys({})(void 0); }).toThrow();
            expect(function () { lamb.renameWith(lamb.always({}))(null); }).toThrow();
            expect(function () { lamb.renameWith(lamb.always({}))(void 0); }).toThrow();
        });

        it("should return an empty object for any other value passed as the source object", function () {
            [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (value) {
                expect(lamb.rename(value, {"0": 9})).toEqual({});
                expect(lamb.renameKeys({"0": 9})(value)).toEqual({});
                expect(lamb.renameWith(lamb.always({"0": 9}))(value)).toEqual({});
            });
        });

        it("should return a copy of the source object for any other value passed as the keys' map", function () {
            [/foo/, 1, function () {}, NaN, true, new Date(), null, void 0].forEach(function (value) {
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

        it("should throw an exception if supplied with `null` or `undefined´", function () {
            expect(function () {lamb.tear(null)}).toThrow();
            expect(function () {lamb.tear(void 0)}).toThrow();
            expect(function () {lamb.tearOwn(null)}).toThrow();
            expect(function () {lamb.tearOwn(void 0)}).toThrow();
        });

        it("should work with array-like objects", function () {
            var r1 = [["0", "1", "2"], [1, 2, 3]];
            var r2 = [["0", "1", "2"], ["a", "b", "c"]];

            expect(lamb.tear([1, 2, 3])).toEqual(r1);
            expect(lamb.tear("abc")).toEqual(r2);
            expect(lamb.tearOwn([1, 2, 3])).toEqual(r1);
            expect(lamb.tearOwn("abc")).toEqual(r2);
        });

        it("should consider other values as empty objects", function () {
            var others = [/foo/, 1, function () {}, NaN, true, new Date()];
            var result = [[[], []], [[], []], [[], []], [[], []], [[], []], [[], []]];

            expect(others.map(lamb.tear)).toEqual(result);
            expect(others.map(lamb.tearOwn)).toEqual(result);
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

    describe("Object validation", function () {
        var persons = [
            {"name": "Jane", "surname": "Doe", "age": 12, "city" : "New York", "email": "jane@doe", "login": {"user.name": "", "password" : "jane", "passwordConfirm": "janE"}},
            {"name": "John", "surname": "Doe", "age": 40, "city" : "London", "email": "john@doe"},
            {"name": "Mario", "surname": "Rossi", "age": 18, "city": "Rome", "email": "mario@rossi.it"},
            {"name": "Paolo", "surname": "Bianchi", "age": 15, "city": "Amsterdam", "email": "paolo@bianchi.nl"}
        ];

        var isAdult = function (age) { return age >= 18; };
        var isRequired = function (v) { return v.length > 0; };
        var isValidMail = function (mail) {
            return /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/.test(mail);
        };
        var isValidPassword = function (pwd) { return pwd.length > 5; };

        var mailCheck = lamb.checker(isValidMail, "Must have a valid mail", ["email"]);
        var ageCheck = lamb.checker(isAdult, "Must be at least 18 years old", ["age"]);
        var pwdCheck = lamb.checker(isValidPassword, "Passwords must have at least six characters", ["login.password"]);
        var userNameCheck = lamb.checker(isRequired, "The username is a required field", ["login/user.name"], "/");
        var pwdConfirmCheck = lamb.checker(lamb.is, "Passwords don't match", ["login.password", "login.passwordConfirm"]);

        describe("checker", function () {
            it("should build a function to validate the given properties of an object", function () {
                expect(mailCheck(persons[0])).toEqual(["Must have a valid mail", ["email"]]);
                expect(mailCheck(persons[2])).toEqual([]);
            });

            it("should accept string paths as property names", function () {
                expect(pwdCheck(persons[0])).toEqual(["Passwords must have at least six characters", ["login.password"]]);
                expect(userNameCheck(persons[0])).toEqual(["The username is a required field", ["login/user.name"]]);
            });

            it("should be possible to make a checker involving more than one property", function () {
                expect(pwdConfirmCheck(persons[0])).toEqual(["Passwords don't match", ["login.password", "login.passwordConfirm"]]);
            });
        });

        describe("validate", function () {
            it("should validate an object with the given set of checkers", function () {
                expect(lamb.validate(persons[0], [mailCheck, ageCheck])).toEqual([
                    ["Must have a valid mail", ["email"]],
                    ["Must be at least 18 years old", ["age"]]
                ]);
                expect(lamb.validate(persons[1], [mailCheck, ageCheck])).toEqual([
                    ["Must have a valid mail", ["email"]]
                ]);
                expect(lamb.validate(persons[2], [mailCheck, ageCheck])).toEqual([]);
            });
        });

        describe("validateWith", function () {
            it("should build a validator to be reused with different objects", function () {
                var personValidator = lamb.validateWith([mailCheck, ageCheck]);

                expect(persons.map(personValidator)).toEqual([
                    [
                        ["Must have a valid mail", ["email"]],
                        ["Must be at least 18 years old", ["age"]]
                    ],
                    [
                        ["Must have a valid mail", ["email"]]
                    ],
                    [],
                    [
                        ["Must be at least 18 years old", ["age"]]
                    ]
                ]);
            });
        });
    });
});
