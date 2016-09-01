var lamb = require("../../dist/lamb.js");
var customMatchers = require("../custom_matchers.js");

describe("lamb.accessors", function () {
    beforeEach(function() {
        jasmine.addMatchers(customMatchers);
    });

    describe("Array accessors", function () {
        var arr = [1, 2, 3, 4, 5];
        var arrCopy = arr.slice();
        var s = "abcde";
        var sparseArr = Array(4);
        sparseArr[2] = 3;
        var sparseArrCopy = sparseArr.slice();

        describe("getIndex / getAt / head / last", function () {
            it("should retrieve the element at the given index in an array-like object", function () {
                var getThird = lamb.getAt(2);

                expect(lamb.getIndex(arr, 1)).toBe(2);
                expect(lamb.getIndex(s, 1)).toBe("b");
                expect(getThird(arr)).toBe(3);
                expect(getThird(s)).toBe("c");
                expect(lamb.head(arr)).toBe(1);
                expect(lamb.head(s)).toBe("a");
                expect(lamb.last(arr)).toBe(5);
                expect(lamb.last(s)).toBe("e");
            });

            it("should allow negative indexes", function () {
                expect(lamb.getIndex(arr, -2)).toBe(4);
                expect(lamb.getIndex(s, -2)).toBe("d");
                expect(lamb.getAt(-2)(arr)).toBe(4);
                expect(lamb.getAt(-2)(s)).toBe("d");
            });

            it("should work with sparse arrays", function () {
                expect(lamb.getIndex(sparseArr, 2)).toBe(3);
                expect(lamb.getIndex(sparseArr, -2)).toBe(3);
                expect(lamb.getAt(2)(sparseArr)).toBe(3);
                expect(lamb.getAt(-2)(sparseArr)).toBe(3);
            });

            it("should throw an exception if called without the data argument", function () {
                expect(lamb.getIndex).toThrow();
                expect(lamb.getAt(1)).toThrow();
                expect(lamb.head).toThrow();
                expect(lamb.last).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
                expect(function () { lamb.getIndex(null, 2); }).toThrow();
                expect(function () { lamb.getIndex(void 0, 2); }).toThrow();
                expect(function () { lamb.getAt(2)(null); }).toThrow();
                expect(function () { lamb.getAt(2)(void 0); }).toThrow();
                expect(function () { lamb.head(null); }).toThrow();
                expect(function () { lamb.last(void 0); }).toThrow();
            });

            it("should return undefined for every other value and when no index is supplied, the index isn't an integer or the index is out of bounds", function () {
                [-6, 66, NaN, null, void 0, {}, [], [2], "a", "1", "1.5", 1.5].forEach(function (v) {
                    expect(lamb.getIndex(arr, v)).toBeUndefined();
                    expect(lamb.getAt(v)(arr)).toBeUndefined();
                });

                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (v) {
                    expect(lamb.getIndex(v, 2)).toBeUndefined();
                    expect(lamb.getAt(2)(v)).toBeUndefined();
                    expect(lamb.head(v)).toBeUndefined();
                    expect(lamb.last(v)).toBeUndefined();
                });

                expect(lamb.getIndex(arr, 2.2)).toBeUndefined();
                expect(lamb.getAt("1")(arr)).toBeUndefined();
                expect(lamb.getIndex(arr)).toBeUndefined();
                expect(lamb.getAt()(arr)).toBeUndefined();
                expect(lamb.head([])).toBeUndefined();
                expect(lamb.last([])).toBeUndefined();
            });
        });

        describe("setIndex / setAt", function () {
            afterEach(function () {
                expect(arr).toEqual(arrCopy);
                expect(sparseArr).toEqual(sparseArrCopy);
            });

            it("should allow to set a value in a copy of the given array-like object", function () {
                var r1 = [1, 2, 99, 4, 5];
                var r2 = ["z", "b", "c", "d", "e"];

                expect(lamb.setIndex(arr, 2, 99)).toEqual(r1);
                expect(lamb.setAt(2, 99)(arr)).toEqual(r1);
                expect(lamb.setIndex(s, 0, "z")).toEqual(r2);
                expect(lamb.setAt(0, "z")(s)).toEqual(r2);
            });

            it("should allow negative indexes", function () {
                var newArr = lamb.setIndex(arr, -1, 99);
                var newArr2 = lamb.setAt(-5, 99)(arr);

                expect(newArr).toEqual([1, 2, 3, 4, 99]);
                expect(newArr2).toEqual([99, 2, 3, 4, 5]);
            });

            it("should work with sparse arrays", function () {
                var r1 = [void 0, void 0, 99, void 0];
                var r2 = [void 0, void 0, 3, 99];

                expect(lamb.setIndex(sparseArr, 2, 99)).toHaveSameValuesOf(r1);
                expect(lamb.setIndex(sparseArr, -2, 99)).toHaveSameValuesOf(r1);
                expect(lamb.setIndex(sparseArr, -1, 99)).toHaveSameValuesOf(r2);
                expect(lamb.setAt(2, 99)(sparseArr)).toHaveSameValuesOf(r1);
                expect(lamb.setAt(-2, 99)(sparseArr)).toHaveSameValuesOf(r1);
                expect(lamb.setAt(-1, 99)(sparseArr)).toHaveSameValuesOf(r2);
            });

            it("should return an array copy of the array-like if the index is not an integer or if is missing", function () {
                var values = [NaN, null, void 0, {}, [], [2], "a", "2", "2.5", 2.5];
                var results = values.reduce(function (result, value) {
                    result.push(lamb.setIndex(arr, value, 99));
                    result.push(lamb.setAt(value, 99)(arr));

                    return result;
                }, []);
                var results2 = values.reduce(function (result, value) {
                    result.push(lamb.setIndex(sparseArr, value, 99));
                    result.push(lamb.setAt(value, 99)(sparseArr));

                    return result;
                }, []);

                results.push(lamb.setIndex(arr));
                results.push(lamb.setAt()(arr));
                results2.push(lamb.setIndex(sparseArr));
                results2.push(lamb.setAt()(sparseArr));

                results.forEach(function (value) {
                    expect(value).toEqual(arr);
                    expect(value).not.toBe(arr);
                });

                results2.forEach(function (value) {
                    expect(value).toEqual(sparseArr);
                    expect(value).not.toBe(sparseArr);
                });
            });

            it("should return an array copy of the array-like if the index is out of bounds", function () {
                var newArr = lamb.setIndex(arr, 5, 99);
                var newArr2 = lamb.setAt(-6, 99)(arr);
                var newS = lamb.setAt(10, 99)(s);
                var newSparseArr = lamb.setIndex(sparseArr, 5, 99);
                var newSparseArr2 = lamb.setAt(5, 99)(sparseArr);

                expect(newArr).toEqual([1, 2, 3, 4, 5]);
                expect(newArr2).toEqual([1, 2, 3, 4, 5]);
                expect(newArr).not.toBe(arr);
                expect(newArr2).not.toBe(arr);
                expect(newS).toEqual(["a", "b", "c", "d", "e"]);
                expect(newSparseArr).toEqual(sparseArr);
                expect(newSparseArr).not.toBe(sparseArr);
                expect(newSparseArr2).toEqual(sparseArr);
                expect(newSparseArr2).not.toBe(sparseArr);
            });

            it("should throw an exception if called without the data argument", function () {
                expect(lamb.setIndex).toThrow();
                expect(lamb.setAt(1, 1)).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
                expect(function () { lamb.setAt(0, 99)(null); }).toThrow();
                expect(function () { lamb.setAt(0, 99)(void 0); }).toThrow();
                expect(function () { lamb.setIndex(null, 0, 99); }).toThrow();
                expect(function () { lamb.setIndex(void 0, 0, 99); }).toThrow();
            });

            it("should return an empty array for every other value", function () {
                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (v) {
                    expect(lamb.setIndex(v, 2, 99)).toEqual([]);
                    expect(lamb.setAt(2, 99)(v)).toEqual([]);
                });
            });
        });

        describe("updateIndex / updateAt", function () {
            var inc = function (n) { return n + 1; };
            var incSpy = jasmine.createSpy("inc").and.callFake(inc);
            var fn99 = lamb.always(99);

            afterEach(function () {
                expect(arr).toEqual(arrCopy);
                incSpy.calls.reset();
            });

            it("should allow to update a value in a copy of the given array-like object with the provided function", function () {
                expect(lamb.updateIndex(arr, 2, incSpy)).toEqual([1, 2, 4, 4, 5]);
                expect(lamb.updateAt(2, incSpy)(arr)).toEqual([1, 2, 4, 4, 5]);
                expect(incSpy.calls.count()).toBe(2);
                expect(incSpy.calls.argsFor(0).length).toBe(1);
                expect(incSpy.calls.argsFor(1).length).toBe(1);
                expect(incSpy.calls.argsFor(0)[0]).toBe(3);
                expect(incSpy.calls.argsFor(1)[0]).toBe(3);
                expect(lamb.updateIndex(s, 0, lamb.always("z"))).toEqual(["z", "b", "c", "d", "e"]);
                expect(lamb.updateAt(0, lamb.always("z"))(s)).toEqual(["z", "b", "c", "d", "e"]);
                expect(lamb.updateAt(1, lamb.always(99))([1, void 0, 3])).toEqual([1, 99, 3]);
            });

            it("should allow negative indexes", function () {
                var newArr = lamb.updateIndex(arr, -1, fn99);
                var newArr2 = lamb.updateAt(-5, fn99)(arr);

                expect(newArr).toEqual([1, 2, 3, 4, 99]);
                expect(newArr2).toEqual([99, 2, 3, 4, 5]);
            });

            it("should work with sparse arrays", function () {
                var r1 = [void 0, void 0, 99, void 0];
                var r2 = [void 0, void 0, 3, 99];

                expect(lamb.updateIndex(sparseArr, 2, fn99)).toHaveSameValuesOf(r1);
                expect(lamb.updateIndex(sparseArr, -2, fn99)).toHaveSameValuesOf(r1);
                expect(lamb.updateIndex(sparseArr, -1, fn99)).toHaveSameValuesOf(r2);
                expect(lamb.updateAt(2, fn99)(sparseArr)).toHaveSameValuesOf(r1);
                expect(lamb.updateAt(-2, fn99)(sparseArr)).toHaveSameValuesOf(r1);
                expect(lamb.updateAt(-1, fn99)(sparseArr)).toHaveSameValuesOf(r2);
            });

            it("should return an array copy of the array-like if the index is not an integer or if is missing", function () {
                var values = [NaN, null, void 0, {}, [], [2], "a", "2", "2.5", 2.5];
                var results = values.reduce(function (result, value) {
                    result.push(lamb.updateIndex(arr, value, fn99));
                    result.push(lamb.updateAt(value, fn99)(arr));

                    return result;
                }, []);
                var results2 = values.reduce(function (result, value) {
                    result.push(lamb.updateIndex(sparseArr, value, fn99));
                    result.push(lamb.updateAt(value, fn99)(sparseArr));

                    return result;
                }, []);

                results.push(lamb.updateIndex(arr));
                results.push(lamb.updateAt()(arr));
                results2.push(lamb.updateIndex(sparseArr));
                results2.push(lamb.updateAt()(sparseArr));

                results.forEach(function (value) {
                    expect(value).toEqual(arr);
                    expect(value).not.toBe(arr);
                });

                results2.forEach(function (value) {
                    expect(value).toEqual(sparseArr);
                    expect(value).not.toBe(sparseArr);
                });
            });

            it("should return an array copy of the array-like if the index is out of bounds", function () {
                var newArr = lamb.updateIndex(arr, 5, fn99);
                var newArr2 = lamb.updateAt(-6, fn99)(arr);
                var newS = lamb.updateAt(10, fn99)(s);
                var newSparseArr = lamb.updateIndex(sparseArr, 5, fn99);
                var newSparseArr2 = lamb.updateAt(5, fn99)(sparseArr);

                expect(newArr).toEqual([1, 2, 3, 4, 5]);
                expect(newArr2).toEqual([1, 2, 3, 4, 5]);
                expect(newArr).not.toBe(arr);
                expect(newArr2).not.toBe(arr);
                expect(newS).toEqual(["a", "b", "c", "d", "e"]);
                expect(newSparseArr).toEqual(sparseArr);
                expect(newSparseArr).not.toBe(sparseArr);
                expect(newSparseArr2).toEqual(sparseArr);
                expect(newSparseArr2).not.toBe(sparseArr);
            });

            it("should check the existence of the destination index before trying to apply the received function to it", function () {
                var toUpperCase = lamb.invoker("toUpperCase");
                expect(lamb.updateIndex(s, 10, toUpperCase)).toEqual(["a", "b", "c", "d", "e"]);
                expect(lamb.updateAt(10, toUpperCase)(s)).toEqual(["a", "b", "c", "d", "e"]);
            });

            it("should throw an exception if the `updater` isn't a function or if is missing", function () {
                [null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                    expect(function () { lamb.updateIndex(arr, 0, value); }).toThrow();
                    expect(function () { lamb.updateAt(0, value)(arr); }).toThrow();
                });

                expect(function () { lamb.updateIndex(arr, 0); }).toThrow();
                expect(function () { lamb.updateAt(0)(arr); }).toThrow();
            });

            it("should throw an exception if called without the data argument", function () {
                expect(lamb.updateIndex).toThrow();
                expect(lamb.updateAt(1, fn99)).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
                expect(function () { lamb.updateIndex(null, 0, fn99); }).toThrow();
                expect(function () { lamb.updateIndex(void 0, 0, fn99); }).toThrow();
                expect(function () { lamb.updateAt(0, fn99)(null); }).toThrow();
                expect(function () { lamb.updateAt(0, fn99)(void 0); }).toThrow();
            });

            it("should return an empty array for every other value", function () {
                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (v) {
                    expect(lamb.updateIndex(v, 2, fn99)).toEqual([]);
                    expect(lamb.updateAt(2, fn99)(v)).toEqual([]);
                });
            });
        });
    });

    describe("Object accessors", function () {
        var d = new Date();
        var invalidKeys = [null, void 0, {a: 2}, [1, 2], /foo/, 1.5, function () {}, NaN, true, d];
        var invalidKeysAsStrings = invalidKeys.map(String);
        var wannabeEmptyObjects = [/foo/, 1, function () {}, NaN, true, new Date()];

        describe("getIn / getKey", function () {
            var obj = {"foo" : 1, "bar" : 2, "baz" : 3};
            Object.defineProperty(obj, "qux", {value: 4});

            it("should return the value of the given object property", function () {
                expect(lamb.getIn(obj, "bar")).toBe(2);
                expect(lamb.getKey("foo")(obj)).toBe(1);
            });

            it("should return `undefined` for a non-existent property", function () {
                expect(lamb.getIn(obj, "a")).toBeUndefined();
                expect(lamb.getKey("z")(obj)).toBeUndefined();
            });

            it("should be able to retrieve non-enumerable properties", function () {
                expect(lamb.getIn(obj, "qux")).toBe(4);
                expect(lamb.getKey("qux")(obj)).toBe(4);
            });

            it("should accept integers as keys and accept array-like objects", function () {
                var o = {"1": "a", "2": "b"};
                var arr = [1, 2, 3, 4];
                var s = "abcd";

                expect(lamb.getIn(o, 1)).toBe("a");
                expect(lamb.getKey(2)(o)).toBe("b");
                expect(lamb.getIn(arr, 1)).toBe(2);
                expect(lamb.getKey(2)(arr)).toBe(3);
                expect(lamb.getIn(s, 1)).toBe("b");
                expect(lamb.getKey(2)(s)).toBe("c");
            });

            it("should convert other values for the `key` parameter to string", function () {
                var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                var testObj = lamb.make(invalidKeysAsStrings, values);

                invalidKeys.forEach(function (key) {
                    var value = values[invalidKeysAsStrings.indexOf(String(key))];
                    expect(lamb.getIn(testObj, key)).toBe(value);
                    expect(lamb.getKey(key)(testObj)).toBe(value);
                });

                expect(lamb.getIn(testObj)).toBe(1);
                expect(lamb.getKey()(testObj)).toBe(1);
            });

            it("should throw an exception if called without the data argument", function () {
                expect(lamb.getIn).toThrow();
                expect(lamb.getKey("a")).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.getIn(null, "a"); }).toThrow();
                expect(function () { lamb.getIn(void 0, "a"); }).toThrow();
                expect(function () { lamb.getKey("a")(null); }).toThrow();
                expect(function () { lamb.getKey("a")(void 0); }).toThrow();
            });

            it("should return convert to object every other value", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.getIn(v, "a")).toBeUndefined();
                    expect(lamb.getKey("a")(v)).toBeUndefined();
                });

                expect(lamb.getIn(/foo/, "lastIndex")).toBe(0);
                expect(lamb.getKey("lastIndex")(/foo/)).toBe(0);
            });
        });

        describe("getPath / getPathIn", function () {
            var obj = {a: 2, b: {a: 3, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}};
            Object.defineProperty(obj, "e", {value : 10});
            obj.f = Object.create({}, {g: {value : 20}});

            it("should retrieve a nested object property using the supplied path", function () {
                expect(lamb.getPath("a")(obj)).toBe(2);
                expect(lamb.getPath("b.a")(obj)).toBe(3);
                expect(lamb.getPath("b.b")(obj)).toBe(obj.b.b);
                expect(lamb.getPathIn(obj, "a")).toBe(2);
                expect(lamb.getPathIn(obj, "b.a")).toBe(3);
                expect(lamb.getPathIn(obj, "b.b")).toBe(obj.b.b);
            });

            it("should be able to access non enumerable properties", function () {
                expect(lamb.getPath("e")(obj)).toBe(10);
                expect(lamb.getPathIn(obj, "e")).toBe(10);
                expect(lamb.getPath("f.g")(obj)).toBe(20);
                expect(lamb.getPathIn(obj, "f.g")).toBe(20);
            });

            it("should be able to retrieve values from arrays and array-like objects", function () {
                expect(lamb.getPath("b.b.0")(obj)).toBe(4);
                expect(lamb.getPath("b.c.0")(obj)).toBe("f");
                expect(lamb.getPathIn(obj, "b.b.0")).toBe(4);
                expect(lamb.getPathIn(obj, "b.c.0")).toBe("f");
            });

            it("should allow negative indexes", function () {
                expect(lamb.getPath("b.b.-1")(obj)).toBe(5);
                expect(lamb.getPathIn(obj, "b.b.-1")).toBe(5);
                expect(lamb.getPath("b.c.-3")(obj)).toBe("f");
                expect(lamb.getPathIn(obj, "b.c.-3")).toBe("f");
            });

            it("should be able to retrieve values nested in arrays", function () {
                var o = {data: [
                    {id: 1, value: 10},
                    {id: 2, value: 20},
                    {id: 3, value: 30}
                ]};

                expect(lamb.getPath("data.1.value")(o)).toBe(20)
                expect(lamb.getPathIn(o, "data.1.value")).toBe(20);
                expect(lamb.getPath("data.-1.value")(o)).toBe(30)
                expect(lamb.getPathIn(o, "data.-1.value")).toBe(30);
            });

            it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
                var o = {a: ["abc", new String("def"), "ghi"]};
                o.a["-1"] = "foo";
                o.a[1]["-2"] = "bar";
                Object.defineProperty(o.a, "-2", {value: 99});

                expect(lamb.getPath("a.-1")(o)).toBe("foo");
                expect(lamb.getPathIn(o, "a.-1")).toBe("foo");
                expect(lamb.getPath("a.1.-2")(o)).toBe("bar");
                expect(lamb.getPathIn(o, "a.1.-2")).toBe("bar");
                expect(lamb.getPath("a.-2")(o)).toBe(99);
                expect(lamb.getPathIn(o, "a.-2")).toBe(99);
            });

            it("should accept a custom path separator", function () {
                expect(lamb.getPath("b->b->0", "->")(obj)).toBe(4);
                expect(lamb.getPath("c.d/e.f", "/")(obj)).toBe(6);
                expect(lamb.getPathIn(obj, "b->b->0", "->")).toBe(4);
                expect(lamb.getPathIn(obj, "c.d/e.f", "/")).toBe(6);
            });

            it("should return undefined for a non-existent path in a valid source", function () {
                expect(lamb.getPath("b.a.z")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.a.z")).toBeUndefined();
                expect(lamb.getPath("b.z.a")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.z.a")).toBeUndefined();
                expect(lamb.getPath("b.b.10")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.b.10")).toBeUndefined();
                expect(lamb.getPath("b.b.10.z")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.b.10.z")).toBeUndefined();
            });

            it("should accept integers as paths containing a single key", function () {
                expect(lamb.getPathIn([1, 2], 1)).toBe(2);
                expect(lamb.getPath(1)([1, 2])).toBe(2);
                expect(lamb.getPathIn([1, 2], -1)).toBe(2);
                expect(lamb.getPath(-1)([1, 2])).toBe(2);
                expect(lamb.getPathIn({"1": "a"}, 1)).toBe("a");
                expect(lamb.getPath(1)({"1": "a"})).toBe("a");
            });

            it("should convert other values for the `path` parameter to string", function () {
                var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                var testObj = lamb.make(invalidKeysAsStrings, values);

                invalidKeys.forEach(function (key) {
                    var value = values[invalidKeysAsStrings.indexOf(String(key))];
                    expect(lamb.getPathIn(testObj, key, "_")).toBe(value);
                    expect(lamb.getPath(key, "_")(testObj)).toBe(value);
                });

                var fooObj = {a: 2, "1": {"5": 3}, "undefined": 4};

                expect(lamb.getPathIn(fooObj, 1.5)).toBe(3);
                expect(lamb.getPath(1.5)(fooObj)).toBe(3);

                expect(lamb.getPathIn(fooObj)).toBe(4);
                expect(lamb.getPath()(fooObj)).toBe(4);
            });

            it("should throw an exception if called without arguments", function () {
                expect(lamb.getPathIn).toThrow();
                expect(lamb.getPath()).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.getPathIn(null, "a"); }).toThrow();
                expect(function () { lamb.getPathIn(void 0, "a"); }).toThrow();
                expect(function () { lamb.getPath("a")(null); }).toThrow();
                expect(function () { lamb.getPath("a")(void 0); }).toThrow();
            });

            it("should convert to object every other value", function () {
                wannabeEmptyObjects.map(function (value) {
                    expect(lamb.getPathIn(value, "a")).toBeUndefined();
                    expect(lamb.getPath("a")(value)).toBeUndefined();
                });

                expect(lamb.getPathIn(/foo/, "lastIndex")).toBe(0);
                expect(lamb.getPath("lastIndex")(/foo/)).toBe(0);
            });
        });

        describe("Property setters", function () {
            var arr = [1, 2, 3];
            var baseFoo = Object.create({a: arr}, {b: {value: 2, enumerable: true}, z: {value: 5}});
            var foo = Object.create(baseFoo, {
                c: {value: 3, enumerable: true}
            });

            var fooEquivalent = {a: [1, 2, 3], b: 2, c: 3, z: 5};
            var fooEnumerables = {a: [1, 2, 3], b: 2, c: 3};

            // seems that this version of jasmine (2.2.1) checks only own enumerable properties with the "toEqual" expectation
            afterEach(function () {
                for (var key in fooEquivalent) {
                    expect(foo[key]).toEqual(fooEquivalent[key]);
                }

                expect(foo.a).toBe(arr);
            });

            describe("setIn / setKey", function () {
                it("should build a copy of the source object with all its enumerable properties and the desired key set to the provided value", function () {
                    var newObjA = lamb.setIn(foo, "c", 99);
                    var newObjB = lamb.setKey("a", ["a", "b"])(foo);

                    expect(newObjA).toEqual({a: [1, 2, 3], b: 2, c: 99});
                    expect(newObjA.a).toBe(arr);
                    expect(newObjA.z).toBeUndefined();
                    expect(newObjB).toEqual({a: ["a", "b"], b: 2, c: 3});
                    expect(newObjB.a).not.toBe(arr);
                    expect(newObjB.z).toBeUndefined();
                });

                it("should add a new property if the given key doesn't exist on the source or if it isn't enumerable", function () {
                    var newObjA = lamb.setIn(foo, "z", 99);
                    var newObjB = lamb.setKey("z", 0)(foo);

                    expect(newObjA).toEqual({a: [1, 2, 3], b: 2, c: 3, z: 99});
                    expect(newObjB).toEqual({a: [1, 2, 3], b: 2, c: 3, z: 0});
                });

                it("should transform array-like objects in objects with numbered string as properties", function () {
                    expect(lamb.setIn([1, 2], "a", 99)).toEqual({"0": 1, "1": 2, "a": 99});
                    expect(lamb.setKey("a", 99)([1, 2])).toEqual({"0": 1, "1": 2, "a": 99});
                    expect(lamb.setIn("foo", "a", 99)).toEqual({"0": "f", "1": "o", "2": "o", "a": 99});
                    expect(lamb.setKey("a", 99)("foo")).toEqual({"0": "f", "1": "o", "2": "o", "a": 99});
                });

                it("should accept integers as keys", function () {
                    expect(lamb.setIn([1, 2], 1, 3)).toEqual({"0": 1, "1": 3});
                    expect(lamb.setKey(1, 3)([1, 2])).toEqual({"0": 1, "1": 3});
                });

                it("should convert other values for the `key` parameter to string", function () {
                    var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    var testObj = lamb.make(invalidKeysAsStrings, values);

                    invalidKeys.forEach(function (key) {
                        var expected = lamb.merge(testObj);
                        expected[String(key)] = 99;

                        expect(lamb.setIn(testObj, key, 99)).toEqual(expected);
                        expect(lamb.setKey(key, 99)(testObj)).toEqual(expected);
                    });

                    expect(lamb.setIn({a: 2})).toEqual({a: 2, "undefined": void 0});
                    expect(lamb.setKey()({a: 2})).toEqual({a: 2, "undefined": void 0});
                });

                it("should throw an exception if called without arguments", function () {
                    expect(lamb.setIn).toThrow();
                    expect(lamb.setKey()).toThrow();
                });

                it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                    expect(function () { lamb.setIn(null, "a", 99); }).toThrow();
                    expect(function () { lamb.setIn(void 0, "a", 99); }).toThrow();
                    expect(function () { lamb.setKey("a", 99)(null); }).toThrow();
                    expect(function () { lamb.setKey("a", 99)(void 0); }).toThrow();
                });

                it("should convert to object every other value", function () {
                    wannabeEmptyObjects.map(function (value) {
                        expect(lamb.setIn(value, "a", 99)).toEqual({a: 99});
                        expect(lamb.setKey("a", 99)(value)).toEqual({a: 99});
                    });
                });
            });

            describe("updateIn / updateKey", function () {
                it("should build a copy of the source object with all its enumerable properties and the desired key updated according to the received function", function () {
                    var makeDoubles = lamb.mapWith(function (n) { return n * 2; });
                    var makeDoublesSpy = jasmine.createSpy("makeDoubles").and.callFake(makeDoubles);
                    var newObjA = lamb.updateIn(foo, "a", makeDoublesSpy);
                    var newObjB = lamb.updateKey("a", makeDoublesSpy)(foo);
                    var result = {a: [2, 4, 6], b: 2, c: 3};

                    expect(newObjA).toEqual(result);
                    expect(newObjB).toEqual(result);
                    expect(makeDoublesSpy.calls.count()).toBe(2);
                    expect(makeDoublesSpy.calls.argsFor(0).length).toBe(1);
                    expect(makeDoublesSpy.calls.argsFor(0)[0]).toBe(arr);
                    expect(makeDoublesSpy.calls.argsFor(1).length).toBe(1);
                    expect(makeDoublesSpy.calls.argsFor(1)[0]).toBe(arr);

                    var o = {a: 1, b: void 0};
                    expect(lamb.updateIn(o, "b", lamb.always(99))).toEqual({a: 1, b: 99});
                    expect(lamb.updateKey("b", lamb.always(99))(o)).toEqual({a: 1, b: 99});
                });

                it("should transform array-like objects in objects with numbered string as properties", function () {
                    var fn = lamb.always(99);

                    expect(lamb.updateIn([1, 2], "1", fn)).toEqual({"0": 1, "1": 99});
                    expect(lamb.updateKey("1", fn)([1, 2])).toEqual({"0": 1, "1": 99});
                    expect(lamb.updateIn("foo", "1", fn)).toEqual({"0": "f", "1": 99, "2": "o"});
                    expect(lamb.updateKey("1", fn)("foo")).toEqual({"0": "f", "1": 99, "2": "o"});
                });

                it("should not add a new property if the given key doesn't exist on the source, and return a copy of the source instead", function () {
                    var newObjA = lamb.updateIn(foo, "xyz", lamb.always(99));
                    var newObjB = lamb.updateKey("xyz", lamb.always(99))(foo);
                    var newObjC = lamb.updateKey("xyz", lamb.always(99))([1]);

                    expect(newObjA).toEqual(fooEnumerables);
                    expect(newObjA).not.toBe(foo);
                    expect(newObjB).toEqual(fooEnumerables);
                    expect(newObjB).not.toBe(foo);
                    expect(newObjC).toEqual({"0": 1});
                });

                it("should not allow to update a non-enumerable property, and return a copy of the source instead, as with non-existent keys", function () {
                    var newObjA = lamb.updateIn(foo, "z", lamb.always(99));
                    var newObjB = lamb.updateKey("z", lamb.always(99))(foo);

                    expect(newObjA).toEqual(fooEnumerables);
                    expect(newObjA).not.toBe(foo);
                    expect(newObjB).toEqual(fooEnumerables);
                    expect(newObjB).not.toBe(foo);
                });

                it("should check the validity of the destination key before trying to apply the received function to it", function () {
                    var o = {a: 1};
                    var toUpperCase = lamb.invoker("toUpperCase");

                    expect(lamb.updateIn(o, "z", toUpperCase)).toEqual({a: 1});
                    expect(lamb.updateKey("z", toUpperCase)(o)).toEqual({a: 1});
                });

                it("should accept integers as keys", function () {
                    var inc = function (n) { return ++n; };

                    expect(lamb.updateIn([1, 2], 1, inc)).toEqual({"0": 1, "1": 3});
                    expect(lamb.updateKey(1, inc)([1, 2])).toEqual({"0": 1, "1": 3});
                });

                it("should convert other values for the `key` parameter to string", function () {
                    var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    var testObj = lamb.make(invalidKeysAsStrings, values);

                    invalidKeys.forEach(function (key) {
                        var expected = lamb.merge(testObj);
                        expected[String(key)] = 99;

                        expect(lamb.updateIn(testObj, key, lamb.always(99))).toEqual(expected);
                        expect(lamb.updateKey(key, lamb.always(99))(testObj)).toEqual(expected);
                    });
                });

                it("should throw an exception if the `updater` isn't a function or if is missing", function () {
                    [null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                        expect(function () { lamb.updateIn({a: 2}, "a", value); }).toThrow();
                        expect(function () { lamb.updateKey("a", value)({a: 2}); }).toThrow();
                    });

                    expect(function () { lamb.updateIn({a: 2}, "a"); }).toThrow();
                    expect(function () { lamb.updateKey("a")({a: 2}); }).toThrow();
                });

                it("should throw an exception if called without arguments", function () {
                    expect(lamb.updateIn).toThrow();
                    expect(lamb.updateKey()).toThrow();
                });

                it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                    expect(function () { lamb.updateIn(null, "a", lamb.always(99)); }).toThrow();
                    expect(function () { lamb.updateIn(void 0, "a", lamb.always(99)); }).toThrow();
                    expect(function () { lamb.updateKey("a", lamb.always(99))(null); }).toThrow();
                    expect(function () { lamb.updateKey("a", lamb.always(99))(void 0); }).toThrow();
                });

                it("should convert to object every other value", function () {
                    wannabeEmptyObjects.map(function (value) {
                        expect(lamb.updateIn(value, "a", lamb.always(99))).toEqual({});
                        expect(lamb.updateKey("a", lamb.always(99))(value)).toEqual({});
                    });
                });
            });
        });

        describe("Path setters", function () {
            var obj = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}};

            Object.defineProperty(obj.b, "w", {
                value: {x: 22, y: {z: 33}}
            });

            var objCopy = JSON.parse(JSON.stringify(obj));

            afterEach(function () {
                expect(obj).toEqual(objCopy);
            });

            describe("setPath / setPathIn", function () {
                it("should allow to set a nested property in a copy of the given object", function () {
                    var r = lamb.setPath("a", 99, ".")(obj);

                    expect(r).toEqual(
                        {a: 99, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}}
                    );
                    expect(r.b).toBe(obj.b);
                    expect(r["c.d"]).toBe(obj["c.d"]);
                    expect(lamb.setPathIn(obj, "a", 99, ".")).toEqual(r);

                    var r1 = lamb.setPath("b.c", "bar", ".")(obj);

                    expect(r1).toEqual(
                        {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "bar"}, "c.d" : {"e.f": 6}}
                    );
                    expect(r1.b.a).toBe(obj.b.a);
                    expect(r1.b.b).toBe(obj.b.b);
                    expect(r1["c.d"]).toBe(obj["c.d"]);
                    expect(lamb.setPathIn(obj, "b.c", "bar", ".")).toEqual(r1);
                });

                it("should use the dot as the default separator", function () {
                    var r = lamb.setPath("b.a.g", 99)(obj);

                    expect(r).toEqual(
                        {a: 2, b: {a: {g: 99, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}}
                    );
                    expect(r.b.b).toBe(obj.b.b);
                    expect(r["c.d"]).toBe(obj["c.d"]);
                    expect(lamb.setPathIn(obj, "b.a.g", 99)).toEqual(r);
                });

                it("should allow custom separators", function () {
                    var r = lamb.setPath("c.d->e.f", 99, "->")(obj);

                    expect(r).toEqual(
                        {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 99}}
                    );
                    expect(r.b).toBe(obj.b);
                    expect(lamb.setPathIn(obj, "c.d->e.f", 99, "->")).toEqual(r);
                });

                it("should add non-existent properties to existing objects", function () {
                    var r1 = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo", z: 99}, "c.d" : {"e.f": 6}};
                    var r2 = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}, z: {a: 99}};
                    var r3 = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}, z: {a: {b: 99}}}

                    expect(lamb.setPath("b.z", 99)(obj)).toEqual(r1);
                    expect(lamb.setPathIn(obj, "b.z", 99)).toEqual(r1);
                    expect(lamb.setPath("z.a", 99)(obj)).toEqual(r2);
                    expect(lamb.setPathIn(obj, "z.a", 99)).toEqual(r2);
                    expect(lamb.setPath("z.a.b", 99)(obj)).toEqual(r3);
                    expect(lamb.setPathIn(obj, "z.a.b", 99)).toEqual(r3);

                    var o = {a: null};
                    var r4 = {a: {b: {c: 99}}};

                    expect(lamb.setPath("a.b.c", 99)(o)).toEqual(r4);
                    expect(lamb.setPathIn(o, "a.b.c", 99)).toEqual(r4);
                });

                it("should treat non-enumerable properties encountered in a path as non-existent properties", function () {
                    var r1 = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo", w: {z: 99}}, "c.d" : {"e.f": 6}};
                    var r2 = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo", w: {y: {z: 99}}}, "c.d" : {"e.f": 6}};

                    expect(lamb.setPathIn(obj, "b.w.z", 99)).toEqual(r1);
                    expect(lamb.setPath("b.w.z", 99)(obj)).toEqual(r1);
                    expect(lamb.setPathIn(obj, "b.w.y.z", 99)).toEqual(r2);
                    expect(lamb.setPath("b.w.y.z", 99)(obj)).toEqual(r2);
                });

                it("should replace indexes when an array is found and the key is a string containing an integer", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 99], c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.setPath("b.b.1", 99)(obj)).toEqual(r);
                    expect(lamb.setPathIn(obj, "b.b.1", 99)).toEqual(r);
                    expect(lamb.setPath("1", 99)([1, 2, 3])).toEqual([1, 99, 3]);
                    expect(lamb.setPathIn([1, 2, 3], "1", 99)).toEqual([1, 99, 3]);
                });

                it("should allow using negative array indexes in path parts", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: [99, 5], c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.setPath("b.b.-2", 99)(obj)).toEqual(r);
                    expect(lamb.setPathIn(obj, "b.b.-2", 99)).toEqual(r);
                    expect(lamb.setPath("-2", 99)([1, 2, 3])).toEqual([1, 99, 3]);
                    expect(lamb.setPathIn([1, 2, 3], "-2", 99)).toEqual([1, 99, 3]);
                });

                it("should not add new elements to an array and behave like `setAt` which returns a copy of the array", function () {
                    var r1 = lamb.setPath("b.b.2", 99)(obj);
                    var r2 = lamb.setPathIn(obj, "b.b.2", 99);

                    expect(r1).toEqual(obj);
                    expect(r2).toEqual(obj);
                    expect(r1.b.b).not.toBe(obj.b.b);
                    expect(r2.b.b).not.toBe(obj.b.b);
                });

                it("should allow to change values nested in an array", function () {
                    var o = {data: [
                        {id: 1, value: 10},
                        {id: 2, value: 20},
                        {id: 3, value: 30}
                    ]};
                    var r = {data: [
                        {id: 1, value: 10},
                        {id: 2, value: 99},
                        {id: 3, value: 30}
                    ]};

                    expect(lamb.setPath("data.1.value", 99)(o)).toEqual(r);
                    expect(lamb.setPathIn(o, "data.1.value", 99)).toEqual(r);
                    expect(lamb.setPath("data.-2.value", 99)(o)).toEqual(r);
                    expect(lamb.setPathIn(o, "data.-2.value", 99)).toEqual(r);
                });

                it("should build an object with numbered keys when an array-like object is found", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: {"0": "m", "1": "o", "2": "o"}}, "c.d" : {"e.f": 6}};

                    expect(lamb.setPath("b.c.0", "m")(obj)).toEqual(r);
                    expect(lamb.setPathIn(obj, "b.c.0", "m")).toEqual(r);
                });

                it("should build an object with numbered keys when an array is found and the key is not a string containing an integer", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: {"0": 4, "1": 5, "z": 99}, c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.setPath("b.b.z", 99)(obj)).toEqual(r);
                    expect(lamb.setPathIn(obj, "b.b.z", 99)).toEqual(r);
                });

                it("should accept integers as paths containing a single key", function () {
                    expect(lamb.setPath(1, 99)([1, 2, 3])).toEqual([1, 99, 3]);
                    expect(lamb.setPathIn([1, 2, 3], -1, 99)).toEqual([1, 2, 99]);
                    expect(lamb.setPath(2, 99)([1, 2])).toEqual([1, 2]);
                    expect(lamb.setPathIn({a: 1}, 1, 99)).toEqual({a: 1, "1": 99});
                });

                it("should give priority to object keys over array indexes when a negative index is encountered", function () {
                    var o = {a: ["abc", "def", "ghi"]};
                    o.a["-1"] = "foo";

                    var r = {a: {"0": "abc", "1": "def", "2": "ghi", "-1": 99}};

                    expect(lamb.setPath("a.-1", 99)(o)).toEqual(r);
                    expect(lamb.setPathIn(o, "a.-1", 99)).toEqual(r);
                });

                it("should consider a negative integer to be an index if the property exists but it's not enumerable", function () {
                    var o = {a: ["abc", "def", "ghi"]};
                    Object.defineProperty(o.a, "-1", {value: 99});

                    var r = {a: ["abc", "def", "foo"]};

                    expect(lamb.setPath("a.-1", "foo")(o)).toEqual(r);
                    expect(lamb.setPathIn(o, "a.-1", "foo")).toEqual(r);
                });

                it("should convert other values for the `path` parameter to string", function () {
                    var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    var testObj = lamb.make(invalidKeysAsStrings, values);

                    invalidKeys.forEach(function (key) {
                        var expected = lamb.merge(testObj);
                        expected[String(key)] = 99;

                        expect(lamb.setPathIn(testObj, key, 99, "_")).toEqual(expected);
                        expect(lamb.setPath(key, 99, "_")(testObj)).toEqual(expected);
                    });

                    expect(lamb.setPathIn({a: 2}, 1.5, 99)).toEqual({a: 2, "1": {"5": 99}});
                    expect(lamb.setPath(1.5, 99)({a: 2})).toEqual({a: 2, "1": {"5": 99}});

                    expect(lamb.setPathIn({a: 2})).toEqual({a: 2, "undefined": void 0});
                    expect(lamb.setPath()({a: 2})).toEqual({a: 2, "undefined": void 0});
                });

                it("should throw an exception if called without arguments", function () {
                    expect(lamb.setPathIn).toThrow();
                    expect(lamb.setPath()).toThrow();
                });

                it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                    expect(function () { lamb.setPathIn(null, "a", 99); }).toThrow();
                    expect(function () { lamb.setPathIn(void 0, "a", 99); }).toThrow();
                    expect(function () { lamb.setPath("a", 99)(null); }).toThrow();
                    expect(function () { lamb.setPath("a", 99)(void 0); }).toThrow();
                });

                it("should convert to object every other value", function () {
                    wannabeEmptyObjects.map(function (value) {
                        expect(lamb.setPathIn(value, "a", 99)).toEqual({a: 99});
                        expect(lamb.setPath("a", 99)(value)).toEqual({a: 99});
                    });
                });
            });

            describe("updatePath / updatePathIn", function () {
                var double = function (n) { return n * 2; };
                var inc = function (n) { return n + 1; };
                var toUpperCase = lamb.invoker("toUpperCase");

                it("should allow to update a nested property in a copy of the given object using the provided function", function () {
                    var makeDoubles = lamb.mapWith(double);
                    var makeDoublesSpy = jasmine.createSpy("makeDoubles").and.callFake(makeDoubles);
                    var newObjA = lamb.updatePathIn(obj, "b.b", makeDoublesSpy, ".");
                    var newObjB = lamb.updatePath("b.b", makeDoublesSpy, ".")(obj);
                    var r1 = {a: 2, b: {a: {g: 10, h: 11}, b: [8, 10], c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(newObjA).toEqual(r1);
                    expect(newObjB).toEqual(r1);
                    expect(makeDoublesSpy.calls.count()).toBe(2);
                    expect(makeDoublesSpy.calls.argsFor(0).length).toBe(1);
                    expect(makeDoublesSpy.calls.argsFor(0)[0]).toBe(obj.b.b);
                    expect(makeDoublesSpy.calls.argsFor(1).length).toBe(1);
                    expect(makeDoublesSpy.calls.argsFor(1)[0]).toBe(obj.b.b);

                    expect(newObjA.b.a).toBe(obj.b.a);
                    expect(newObjA["c.d"]).toBe(obj["c.d"]);

                    var r2 = {a: 3, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.updatePathIn(obj, "a", inc, ".")).toEqual(r2);
                    expect(lamb.updatePath("a", inc, ".")(obj)).toEqual(r2);
                });

                it("should use the dot as the default separator", function () {
                    var r = lamb.updatePath("b.a.g", double)(obj);

                    expect(r).toEqual(
                        {a: 2, b: {a: {g: 20, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}}
                    );
                    expect(r.b.b).toBe(obj.b.b);
                    expect(r["c.d"]).toBe(obj["c.d"]);
                    expect(lamb.updatePathIn(obj, "b.a.g", double)).toEqual(r);
                });

                it("should allow custom separators", function () {
                    var r = lamb.updatePath("c.d->e.f", double, "->")(obj);

                    expect(r).toEqual(
                        {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 12}}
                    );
                    expect(r.b).toBe(obj.b);
                    expect(lamb.updatePathIn(obj, "c.d->e.f", double, "->")).toEqual(r);
                });

                it("should be possible to use a path with a single key", function () {
                    var arr = [1, 2, 3];
                    var o = {a: 1, b: 2};

                    expect(lamb.updatePathIn(arr, "1", inc)).toEqual([1, 3, 3]);
                    expect(lamb.updatePath("-1", inc)(arr)).toEqual([1, 2, 4]);
                    expect(lamb.updatePathIn(o, "b", inc)).toEqual({a: 1, b: 3});
                    expect(lamb.updatePath("a", inc)(o)).toEqual({a: 2, b: 2});
                });

                it("should replace indexes when an array is found and the key is a string containing an integer", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 10], c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.updatePath("b.b.1", double)(obj)).toEqual(r);
                    expect(lamb.updatePathIn(obj, "b.b.1", double)).toEqual(r);
                    expect(lamb.updatePath("1", double)([1, 2, 3])).toEqual([1, 4, 3]);
                    expect(lamb.updatePathIn([1, 2, 3], "1", double)).toEqual([1, 4, 3]);
                });

                it("should allow using negative array indexes in path parts", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: [8, 5], c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.updatePath("b.b.-2", double)(obj)).toEqual(r);
                    expect(lamb.updatePathIn(obj, "b.b.-2", double)).toEqual(r);
                    expect(lamb.updatePath("-2", double)([1, 2, 3])).toEqual([1, 4, 3]);
                    expect(lamb.updatePathIn([1, 2, 3], "-2", double)).toEqual([1, 4, 3]);
                });

                it("should allow to change values nested in an array", function () {
                    var o = {data: [
                        {id: 1, value: 10},
                        {id: 2, value: 20},
                        {id: 3, value: 30}
                    ]};
                    var r = {data: [
                        {id: 1, value: 10},
                        {id: 2, value: 21},
                        {id: 3, value: 30}
                    ]};

                    expect(lamb.updatePath("data.1.value", inc)(o)).toEqual(r);
                    expect(lamb.updatePathIn(o, "data.1.value", inc)).toEqual(r);
                    expect(lamb.updatePath("data.-2.value", inc)(o)).toEqual(r);
                    expect(lamb.updatePathIn(o, "data.-2.value", inc)).toEqual(r);
                });

                it("should build an object with numbered keys when an array-like object is found", function () {
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: {"0": "m", "1": "o", "2": "o"}}, "c.d" : {"e.f": 6}};

                    expect(lamb.updatePath("b.c.0", lamb.always("m"))(obj)).toEqual(r);
                    expect(lamb.updatePathIn(obj, "b.c.0", lamb.always("m"))).toEqual(r);
                });

                it("should build an object with numbered keys when an array is found and the key is not a string containing an integer", function () {
                    obj.b.b.z = 1;
                    var r = {a: 2, b: {a: {g: 10, h: 11}, b: {"0": 4, "1": 5, "z": 99}, c: "foo"}, "c.d" : {"e.f": 6}};

                    expect(lamb.updatePath("b.b.z", lamb.always(99))(obj)).toEqual(r);
                    expect(lamb.updatePathIn(obj, "b.b.z", lamb.always(99))).toEqual(r);
                    delete obj.b.b.z;
                });

                it("should not add a new property if the given path doesn't exist on the source, and return a copy of the source instead", function () {
                    var arr = [1];
                    var newObjA = lamb.updatePathIn(obj, "b.a.z", lamb.always(99));
                    var newObjB = lamb.updatePathIn(obj, "b.b.1.z", lamb.always(99));
                    var newObjC = lamb.updatePath("xyz", lamb.always(99))(obj);
                    var newObjD = lamb.updatePathIn(obj, "b.b.-10", lamb.always(99));
                    var newObjE = lamb.updatePath("xyz", lamb.always(99))(arr);
                    var newObjF = lamb.updatePath("x.y.z", lamb.always(99))(arr);
                    var newObjG = lamb.updatePath("1", lamb.always(99))(arr);
                    var newObjH = lamb.updatePath("-10", lamb.always(99))(arr);

                    expect(newObjA).toEqual(obj);
                    expect(newObjA).not.toBe(obj);
                    expect(newObjB).toEqual(obj);
                    expect(newObjB).not.toBe(obj);
                    expect(newObjC).toEqual(obj);
                    expect(newObjC).not.toBe(obj);
                    expect(newObjD).toEqual(obj);
                    expect(newObjD).not.toBe(obj);
                    expect(newObjE).toEqual(arr);
                    expect(newObjE).not.toBe(arr);
                    expect(newObjF).toEqual(arr);
                    expect(newObjF).not.toBe(arr);
                    expect(newObjG).toEqual(arr);
                    expect(newObjG).not.toBe(arr);
                    expect(newObjH).toEqual(arr);
                    expect(newObjH).not.toBe(arr);

                    var o = {a: null};

                    var newObjI = lamb.updatePath("a.b.c", lamb.always(99))(o);
                    var newObjJ = lamb.updatePathIn(o, "a.b.c", lamb.always(99));
                    expect(newObjI).toEqual(o);
                    expect(newObjI).not.toBe(o);
                    expect(newObjJ).toEqual(o);
                    expect(newObjJ).not.toBe(o);
                });

                it("should not see a non-existing path when the target is undefined", function () {
                    var fooObj = {a: {b: {c: 2, d: void 0}}};
                    var r = {a: {b: {c: 2, d: 99}}};
                    var fn99 = lamb.always(99);

                    expect(lamb.updatePathIn(fooObj, "a.b.d", fn99)).toEqual(r);
                    expect(lamb.updatePath("a.b.d", fn99)(fooObj)).toEqual(r);
                });

                it("should return a copy of the source object when a non enumerable property is part of the path or its target", function () {
                    var fooObj = Object.create({}, {
                        a: {enumerable: true, value: 1},
                        b: {value: {c: 2, d: {e: 3}}}
                    });

                    expect(lamb.updatePathIn(fooObj, "b", lamb.setKey("c", 99))).toEqual({a: 1});
                    expect(lamb.updatePath("b", lamb.setKey("c", 99))(fooObj)).toEqual({a: 1});
                    expect(lamb.updatePathIn(fooObj, "b.c", lamb.always(99))).toEqual({a: 1});
                    expect(lamb.updatePath("b.d.e", lamb.always(99))(fooObj)).toEqual({a: 1});
                });

                it("should accept integers as paths containing a single key", function () {
                    expect(lamb.updatePath(1, lamb.always(99))([1, 2, 3])).toEqual([1, 99, 3]);
                    expect(lamb.updatePathIn([1, 2, 3], -1, lamb.always(99))).toEqual([1, 2, 99]);
                    expect(lamb.updatePath(2, lamb.always(99))([1, 2])).toEqual([1, 2]);
                });

                it("should give priority to object keys over array indexes when a negative index is encountered", function () {
                    var o = {a: ["abc", "def", "ghi"]};
                    o.a["-1"] = "foo";

                    var r = {a: {"0": "abc", "1": "def", "2": "ghi", "-1": 99}};

                    expect(lamb.updatePath("a.-1", lamb.always(99))(o)).toEqual(r);
                    expect(lamb.updatePathIn(o, "a.-1", lamb.always(99))).toEqual(r);
                });

                it("should consider a negative integer to be an index if the property exists but it's not enumerable", function () {
                    var o = {a: ["abc", "def", "ghi"]};
                    Object.defineProperty(o.a, "-1", {value: 99});

                    var r = {a: ["abc", "def", "GHI"]};

                    expect(lamb.updatePath("a.-1", lamb.invoker("toUpperCase"))(o)).toEqual(r);
                    expect(lamb.updatePathIn(o, "a.-1", lamb.invoker("toUpperCase"))).toEqual(r);
                });

                it("should convert other values for the `path` parameter to string", function () {
                    var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    var testObj = lamb.make(invalidKeysAsStrings, values);

                    invalidKeys.forEach(function (key) {
                        var expected = lamb.merge(testObj);
                        expected[String(key)] = 99;

                        expect(lamb.updatePathIn(testObj, key, lamb.always(99), "_")).toEqual(expected);
                        expect(lamb.updatePath(key, lamb.always(99), "_")(testObj)).toEqual(expected);
                    });

                    var fooObj = {a: 2, "1": {"5": 3}, "undefined": 4};
                    var r = {a: 2, "1": {"5": 99}, "undefined": 4};

                    expect(lamb.updatePathIn(fooObj, 1.5, lamb.always(99))).toEqual(r);
                    expect(lamb.updatePath(1.5, lamb.always(99))(fooObj)).toEqual(r);
                });

                it("should throw an exception if the `updater` isn't a function or if is missing", function () {
                    [null, void 0, {}, [], /foo/, 1, NaN, true, new Date()].forEach(function (value) {
                        expect(function () { lamb.updatePathIn({a: 2}, "a", value); }).toThrow();
                        expect(function () { lamb.updatePath("a", value)({a: 2}); }).toThrow();
                    });

                    expect(function () { lamb.updatePathIn({a: 2}, "a"); }).toThrow();
                    expect(function () { lamb.updatePath("a")({a: 2}); }).toThrow();
                });

                it("should throw an exception if called without arguments", function () {
                    expect(lamb.updatePathIn).toThrow();
                    expect(lamb.updatePath()).toThrow();
                });

                it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                    expect(function () { lamb.updatePathIn(null, "a", lamb.always(99)); }).toThrow();
                    expect(function () { lamb.updatePathIn(void 0, "a", lamb.always(99)); }).toThrow();
                    expect(function () { lamb.updatePath("a", lamb.always(99))(null); }).toThrow();
                    expect(function () { lamb.updatePath("a", lamb.always(99))(void 0); }).toThrow();
                });

                it("should convert to object every other value", function () {
                    wannabeEmptyObjects.map(function (value) {
                        expect(lamb.updatePathIn(value, "a", lamb.always(99))).toEqual({});
                        expect(lamb.updatePath("a", lamb.always(99))(value)).toEqual({});
                        expect(lamb.updatePathIn(value, "a.b.c", lamb.always(99))).toEqual({});
                        expect(lamb.updatePath("a.b.c", lamb.always(99))(value)).toEqual({});
                    });
                });
            });
        });
    });
});
