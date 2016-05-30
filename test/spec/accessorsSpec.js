var lamb = require("../../dist/lamb.js");

describe("lamb.accessors", function () {
    describe("Array accessors", function () {
        describe("getIndex / getAt / head / last", function () {
            var arr = [1, 2, 3, 4];
            var s = "abcd";

            it("should retrieve the element at the given index in an array-like object", function () {
                var getThird = lamb.getAt(2);

                expect(lamb.getIndex(arr, 1)).toBe(2);
                expect(lamb.getIndex(s, 1)).toBe("b");
                expect(getThird(arr)).toBe(3);
                expect(getThird(s)).toBe("c");
                expect(lamb.head(arr)).toBe(1);
                expect(lamb.head(s)).toBe("a");
                expect(lamb.last(arr)).toBe(4);
                expect(lamb.last(s)).toBe("d");
            });

            it("should allow negative indexes", function () {
                expect(lamb.getIndex(arr, -2)).toBe(3);
                expect(lamb.getIndex(s, -2)).toBe("c");
                expect(lamb.getAt(-2)(arr)).toBe(3);
                expect(lamb.getAt(-2)(s)).toBe("c");
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
                expect(lamb.head([])).toBeUndefined();
                expect(lamb.last([])).toBeUndefined();
            });
        });

        describe("setIndex / setAt", function () {
            var arr = [1, 2, 3, 4, 5];
            var arrCopy = [1, 2, 3, 4, 5];
            var s = "hello";

            afterEach(function () {
                expect(arr).toEqual(arrCopy);
            });

            it("should allow to set a value in a copy of the given array-like object", function () {
                var r1 = [1, 2, 99, 4, 5];
                var r2 = ["c", "e", "l", "l", "o"];

                expect(lamb.setIndex(arr, 2, 99)).toEqual(r1);
                expect(lamb.setAt(2, 99)(arr)).toEqual(r1);
                expect(lamb.setIndex(s, 0, "c")).toEqual(r2);
                expect(lamb.setAt(0, "c")(s)).toEqual(r2);
            });

            it("should allow negative indexes", function () {
                var newArr = lamb.setIndex(arr, -1, 99);
                var newArr2 = lamb.setAt(-5, 99)(arr);

                expect(newArr).toEqual([1, 2, 3, 4, 99]);
                expect(newArr2).toEqual([99, 2, 3, 4, 5]);
            });

            it("should return an array copy of the array-like if the index is not an integer", function () {
                [
                    lamb.setIndex(arr, NaN, 99),
                    lamb.setIndex(arr, null, 99),
                    lamb.setIndex(arr, void 0, 99),
                    lamb.setIndex(arr, {}, 99),
                    lamb.setIndex(arr, [], 99),
                    lamb.setIndex(arr, [2], 99),
                    lamb.setIndex(arr, "a", 99),
                    lamb.setIndex(arr, "2", 99),
                    lamb.setIndex(arr, "2.5", 99),
                    lamb.setIndex(arr, 2.5, 99),
                    lamb.setAt(NaN, 99)(arr),
                    lamb.setAt(null, 99)(arr),
                    lamb.setAt(void 0, 99)(arr),
                    lamb.setAt({}, 99)(arr),
                    lamb.setAt([], 99)(arr),
                    lamb.setAt([2], 99)(arr),
                    lamb.setAt("a", 99)(arr),
                    lamb.setAt("2", 99)(arr),
                    lamb.setAt("2.5", 99)(arr),
                    lamb.setAt(2.5, 99)(arr)
                ].forEach(function (value) {
                    expect(value).toEqual(arr);
                    expect(value).not.toBe(arr);
                });
            });

            it("should return an array copy of the array-like if the index is out of bounds", function () {
                var newArr = lamb.setIndex(arr, 5, 99);
                var newArr2 = lamb.setAt(-6, 99)(arr);
                var newS = lamb.setAt(10, 99)(s);

                expect(newArr).toEqual([1, 2, 3, 4, 5]);
                expect(newArr2).toEqual([1, 2, 3, 4, 5]);
                expect(newArr).not.toBe(arr);
                expect(newArr2).not.toBe(arr);
                expect(newS).toEqual(["h", "e", "l", "l", "o"]);
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
            var arr = [1, 2, 3, 4, 5];
            var arrCopy = [1, 2, 3, 4, 5];
            var s = "hello";
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
                expect(lamb.updateIndex(s, 0, lamb.always("c"))).toEqual(["c", "e", "l", "l", "o"]);
                expect(lamb.updateAt(0, lamb.always("c"))(s)).toEqual(["c", "e", "l", "l", "o"]);
                expect(lamb.updateAt(1, lamb.always(99))([1, void 0, 3])).toEqual([1, 99, 3]);
            });

            it("should allow negative indexes", function () {
                var newArr = lamb.updateIndex(arr, -1, fn99);
                var newArr2 = lamb.updateAt(-5, fn99)(arr);

                expect(newArr).toEqual([1, 2, 3, 4, 99]);
                expect(newArr2).toEqual([99, 2, 3, 4, 5]);
            });

            it("should return an array copy of the array-like if the index is not an integer", function () {
                [
                    lamb.updateIndex(arr, NaN, fn99),
                    lamb.updateIndex(arr, null, fn99),
                    lamb.updateIndex(arr, void 0, fn99),
                    lamb.updateIndex(arr, {}, fn99),
                    lamb.updateIndex(arr, [], fn99),
                    lamb.updateIndex(arr, [2], fn99),
                    lamb.updateIndex(arr, "a", fn99),
                    lamb.updateIndex(arr, "2", fn99),
                    lamb.updateIndex(arr, "2.5", fn99),
                    lamb.updateIndex(arr, 2.5, fn99),
                    lamb.updateAt(NaN, fn99)(arr),
                    lamb.updateAt(null, fn99)(arr),
                    lamb.updateAt(void 0, fn99)(arr),
                    lamb.updateAt({}, fn99)(arr),
                    lamb.updateAt([], fn99)(arr),
                    lamb.updateAt([2], fn99)(arr),
                    lamb.updateAt("a", fn99)(arr),
                    lamb.updateAt("2", fn99)(arr),
                    lamb.updateAt("2.5", fn99)(arr),
                    lamb.updateAt(2.5, fn99)(arr)
                ].forEach(function (value) {
                    expect(value).toEqual(arr);
                    expect(value).not.toBe(arr);
                });
            });

            it("should return an array copy of the array-like if the index is out of bounds", function () {
                var newArr = lamb.updateIndex(arr, 5, fn99);
                var newArr2 = lamb.updateAt(-6, fn99)(arr);
                var newS = lamb.updateAt(10, fn99)(s);

                expect(newArr).toEqual([1, 2, 3, 4, 5]);
                expect(newArr2).toEqual([1, 2, 3, 4, 5]);
                expect(newArr).not.toBe(arr);
                expect(newArr2).not.toBe(arr);
                expect(newS).toEqual(["h", "e", "l", "l", "o"]);
            });

            it("should check the existence of the destination index before trying to apply the received function to it", function () {
                var toUpperCase = lamb.invoker("toUpperCase");
                expect(lamb.updateIndex(s, 10, toUpperCase)).toEqual(["h", "e", "l", "l", "o"]);
                expect(lamb.updateAt(10, toUpperCase)(s)).toEqual(["h", "e", "l", "l", "o"]);
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
        describe("getIn / getKey", function () {
            var obj = {"foo" : 1, "bar" : 2, "baz" : 3};

            it("should return the value of the given object property", function () {
                expect(lamb.getIn(obj, "bar")).toBe(2);
                expect(lamb.getKey("foo")(obj)).toBe(1);
            });

            it("should return `undefined` for a non-existent property", function () {
                expect(lamb.getIn(obj, "a")).toBeUndefined();
                expect(lamb.getKey("z")(obj)).toBeUndefined();
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

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.getIn(null, "a"); }).toThrow();
                expect(function () { lamb.getIn(void 0, "a"); }).toThrow();
                expect(function () { lamb.getKey("a")(null); }).toThrow();
                expect(function () { lamb.getKey("a")(void 0); }).toThrow();
            });

            it("should return `undefined` for every other value and when the key isn't a string or an integer", function () {
                [/foo/, 1, function () {}, NaN, true, new Date()].forEach(function (v) {
                    expect(lamb.getIn(v, "a")).toBeUndefined();
                    expect(lamb.getKey("a")(v)).toBeUndefined();
                    expect(lamb.getIn(obj, v)).toBeUndefined();
                    expect(lamb.getKey(v)(obj)).toBeUndefined();
                });
            });
        });

        describe("getPath / getPathIn", function () {
            var obj = {a: 2, b: {a: 3, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}};

            it("should retrieve a nested object property using the supplied path", function () {
                expect(lamb.getPath("a")(obj)).toBe(2);
                expect(lamb.getPath("b.a")(obj)).toBe(3);
                expect(lamb.getPath("b.b")(obj)).toBe(obj.b.b);
                expect(lamb.getPathIn(obj, "a")).toBe(2);
                expect(lamb.getPathIn(obj, "b.a")).toBe(3);
                expect(lamb.getPathIn(obj, "b.b")).toBe(obj.b.b);
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

                expect(lamb.getPath("a.-1")(o)).toBe("foo");
                expect(lamb.getPathIn(o, "a.-1")).toBe("foo");
                expect(lamb.getPath("a.1.-2")(o)).toBe("bar");
                expect(lamb.getPathIn(o, "a.1.-2")).toBe("bar");
            });

            it("should accept a custom path separator", function () {
                expect(lamb.getPath("b->b->0", "->")(obj)).toBe(4);
                expect(lamb.getPath("c.d/e.f", "/")(obj)).toBe(6);
                expect(lamb.getPathIn(obj, "b->b->0", "->")).toBe(4);
                expect(lamb.getPathIn(obj, "c.d/e.f", "/")).toBe(6);
            });

            it("should return undefined for any non-existent path", function () {
                expect(lamb.getPath("b.a.z")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.a.z")).toBeUndefined();
                expect(lamb.getPath("b.z.a")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.z.a")).toBeUndefined();
                expect(lamb.getPath("b.b.10")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.b.10")).toBeUndefined();
                expect(lamb.getPath("b.b.10.z")(obj)).toBeUndefined();
                expect(lamb.getPathIn(obj, "b.b.10.z")).toBeUndefined();
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
            var wannabeEmptyObjects = [/foo/, 1, function () {}, null, NaN, void 0, true, new Date()];

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

                it("should add a new property if the given key doesn't exist on the source", function () {
                    var newObjA = lamb.setIn(foo, "z", 99);
                    var newObjB = lamb.setKey("z", 0)(foo);

                    expect(newObjA).toEqual({a: [1, 2, 3], b: 2, c: 3, z: 99});
                    expect(newObjB).toEqual({a: [1, 2, 3], b: 2, c: 3, z: 0});
                });

                it("should consider values other than objects or array-like objects as empty objects", function () {
                    wannabeEmptyObjects.map(function (value) {
                        expect(lamb.setIn(value, "a", 99)).toEqual({a: 99});
                        expect(lamb.setKey("a", 99)(value)).toEqual({a: 99});
                    });
                });

                it("should transform array-like objects in objects with numbered string as properties", function () {
                    expect(lamb.setIn([1, 2], "a", 99)).toEqual({"0": 1, "1": 2, "a": 99});
                    expect(lamb.setKey("a", 99)([1, 2])).toEqual({"0": 1, "1": 2, "a": 99});
                    expect(lamb.setIn("foo", "a", 99)).toEqual({"0": "f", "1": "o", "2": "o", "a": 99});
                    expect(lamb.setKey("a", 99)("foo")).toEqual({"0": "f", "1": "o", "2": "o", "a": 99});
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

                it("should consider values other than objects or array-like objects as empty objects", function () {
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

            var wannabeEmptyObjects = [/foo/, 1, function () {}, null, NaN, void 0, true, new Date()];

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
                    var r1 = lamb.setPath("b.z", 99)(obj);
                    var r2 = lamb.setPath("z.a", 99)(obj);
                    var r3 = lamb.setPath("z.a.b", 99)(obj);

                    expect(r1).toEqual(
                       {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo", z: 99}, "c.d" : {"e.f": 6}}
                    );
                    expect(lamb.setPathIn(obj, "b.z", 99)).toEqual(r1);

                    expect(r2).toEqual(
                        {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}, z: {a: 99}}
                    );
                    expect(lamb.setPathIn(obj, "z.a", 99)).toEqual(r2);

                    expect(r3).toEqual(
                        {a: 2, b: {a: {g: 10, h: 11}, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}, z: {a: {b: 99}}}
                    );
                    expect(lamb.setPathIn(obj, "z.a.b", 99)).toEqual(r3);
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

                it("should consider values other than objects or array-like objects as empty objects", function () {
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

                it("should consider values other than objects or array-like objects as empty objects", function () {
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
