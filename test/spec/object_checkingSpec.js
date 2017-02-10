var lamb = require("../../dist/lamb.js");

describe("lamb.object_checking", function () {
    var invalidKeys = [null, void 0, {a: 2}, [1, 2], /foo/, 1.5, function () {}, NaN, true, new Date ()];
    var invalidKeysAsStrings = invalidKeys.map(String);
    var nonFunctions = [null, void 0, {}, [], /foo/, "foo", 1, NaN, true, new Date()];
    var wannabeEmptyObjects = [/foo/, 1, function () {}, NaN, true, new Date()];

    describe("Property checking", function () {
        var obj = {"foo" : "bar"};

        describe("has / hasKey", function () {
            it("should check the existence of the property in an object", function () {
                expect(lamb.has(obj, "toString")).toBe(true);
                expect(lamb.has(obj, "foo")).toBe(true);
                expect(lamb.hasKey("toString")(obj)).toBe(true);
                expect(lamb.hasKey("foo")(obj)).toBe(true);
            });

            it("should return `false` for a non-existent property", function () {
                expect(lamb.has(obj, "baz")).toBe(false);
                expect(lamb.hasKey("baz")(obj)).toBe(false);
            });

            it("should accept integers as keys and accept array-like objects", function () {
                var o = {"1": "a", "2": "b"};
                var arr = [1, 2, 3, 4];
                var s = "abcd";

                expect(lamb.has(o, 2)).toBe(true);
                expect(lamb.has(arr, 2)).toBe(true);
                expect(lamb.has(s, 2)).toBe(true);
                expect(lamb.hasKey(2)(o)).toBe(true);
                expect(lamb.hasKey(2)(arr)).toBe(true);
                expect(lamb.hasKey(2)(s)).toBe(true);
            });

            it("should consider only defined indexes in sparse arrays", function () {
                var arr = [1, , 3];

                expect(lamb.has(arr, 1)).toBe(false);
                expect(lamb.hasKey(1)(arr)).toBe(false);
            });

            it("should convert other values for the `key` parameter to string", function () {
                var keys = [null, void 0, {a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, new Date()];
                var testObj = lamb.make(keys.map(String), []);

                keys.forEach(function (key) {
                    expect(lamb.has(testObj, key)).toBe(true);
                    expect(lamb.hasKey(key)(testObj)).toBe(true);
                });

                expect(lamb.has({"undefined": void 0})).toBe(true);
                expect(lamb.hasKey()({"undefined": void 0})).toBe(true);
            });

            it("should throw an exception if called without the data argument", function () {
                expect(lamb.has).toThrow();
                expect(lamb.hasKey("foo")).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.has(null, "a"); }).toThrow();
                expect(function () { lamb.has(void 0, "a"); }).toThrow();
                expect(function () { lamb.hasKey("a")(null); }).toThrow();
                expect(function () { lamb.hasKey("a")(void 0); }).toThrow();
            });

            it("should convert to object every other value", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.has(v, "a")).toBe(false);
                    expect(lamb.hasKey("a")(v)).toBe(false);
                });

                expect(lamb.has(/foo/, "lastIndex")).toBe(true);
                expect(lamb.hasKey("lastIndex")(/foo/)).toBe(true);
            });
        });

        describe("hasOwn / hasOwnKey", function () {
            it("should check the existence of an owned property in an object", function () {
                expect(lamb.hasOwn(obj, "toString")).toBe(false);
                expect(lamb.hasOwn(obj, "foo")).toBe(true);
                expect(lamb.hasOwnKey("toString")(obj)).toBe(false);
                expect(lamb.hasOwnKey("foo")(obj)).toBe(true);
            });

            it("should return `false` for a non-existent property", function () {
                expect(lamb.hasOwn(obj, "baz")).toBe(false);
                expect(lamb.hasOwnKey("baz")(obj)).toBe(false);
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

            it("should consider only defined indexes in sparse arrays", function () {
                var arr = [1, , 3];

                expect(lamb.hasOwn(arr, 1)).toBe(false);
                expect(lamb.hasOwnKey(1)(arr)).toBe(false);
            });

            it("should convert other values for the `key` parameter to string", function () {
                var keys = [null, void 0, {a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, new Date()];
                var testObj = lamb.make(keys.map(String), []);

                keys.forEach(function (key) {
                    expect(lamb.hasOwn(testObj, key)).toBe(true);
                    expect(lamb.hasOwnKey(key)(testObj)).toBe(true);
                });

                expect(lamb.hasOwn({"undefined": void 0})).toBe(true);
                expect(lamb.hasOwnKey()({"undefined": void 0})).toBe(true);
            });

            it("should throw an exception if called without the data argument", function () {
                expect(lamb.hasOwn).toThrow();
                expect(lamb.hasOwnKey("foo")).toThrow();
            });

            it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
                expect(function () { lamb.hasOwn(null, "a"); }).toThrow();
                expect(function () { lamb.hasOwn(void 0, "a"); }).toThrow();
                expect(function () { lamb.hasOwnKey("a")(null); }).toThrow();
                expect(function () { lamb.hasOwnKey("a")(void 0); }).toThrow();
            });

            it("should return convert to object every other value", function () {
                wannabeEmptyObjects.forEach(function (v) {
                    expect(lamb.hasOwn(v, "a")).toBe(false);
                    expect(lamb.hasOwnKey("a")(v)).toBe(false);
                });

                expect(lamb.hasOwn(/foo/, "lastIndex")).toBe(true);
                expect(lamb.hasOwnKey("lastIndex")(/foo/)).toBe(true);
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
            expect(lamb.hasKeyValue("a", 45)({a: 45})).toBe(true);
            expect(lamb.hasKeyValue("a", [45])({a: 45})).toBe(false);
            expect(persons.map(isDoe)).toEqual([true, true, false]);
        });

        it("should return `false` for a non-existent property", function () {
            expect(lamb.hasKeyValue("z", void 0)(persons[0])).toBe(false);
        });

        it("should return `true` for `undefined` values in existing keys", function () {
            var obj = {"a": void 0};

            expect(lamb.hasKeyValue("a", void 0)(obj)).toBe(true);
            expect(lamb.hasKeyValue("a")(obj)).toBe(true);
        });

        it("should use the \"SameValueZero\" comparison", function () {
            var obj = {a: NaN, b: 0, c: -0};

            expect(lamb.hasKeyValue("a", NaN)(obj)).toBe(true);
            expect(lamb.hasKeyValue("b", 0)(obj)).toBe(true);
            expect(lamb.hasKeyValue("b", -0)(obj)).toBe(true);
            expect(lamb.hasKeyValue("c", -0)(obj)).toBe(true);
            expect(lamb.hasKeyValue("c", 0)(obj)).toBe(true);
        });

        it("should accept integers as keys and accept array-like objects", function () {
            var o = {"1": "a", "2": "b"};
            var arr = [1, 2, 3, 4];
            var s = "abcd";

            expect(lamb.hasKeyValue(2, "b")(o)).toBe(true);
            expect(lamb.hasKeyValue(2, 3)(arr)).toBe(true);
            expect(lamb.hasKeyValue(2, "c")(s)).toBe(true);
        });

        it("should consider only defined indexes in sparse arrays", function () {
            expect(lamb.hasKeyValue("1", void 0)([1, , 3])).toBe(false);
            expect(lamb.hasKeyValue("-2", void 0)([1, , 3])).toBe(false);
        });

        it("should convert other values for the `key` parameter to string", function () {
            var d = new Date();
            var keys = [null, void 0, {a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, d];
            var stringKeys = keys.map(String);
            var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var testObj = lamb.make(stringKeys, values);

            keys.forEach(function (key) {
                var value = stringKeys.indexOf(String(key));
                expect(lamb.hasKeyValue(key, value)(testObj)).toBe(true);
            });

            expect(lamb.hasKeyValue()({"undefined": void 0})).toBe(true);
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.hasKeyValue("foo", 2)).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
            expect(function () { lamb.hasKeyValue("a", 2)(null); }).toThrow();
            expect(function () { lamb.hasKeyValue("a", 2)(void 0); }).toThrow();
        });

        it("should convert to object every other value", function () {
            wannabeEmptyObjects.forEach(function (v) {
                expect(lamb.hasKeyValue("a", 2)(v)).toBe(false);
            });

            expect(lamb.hasKeyValue("lastIndex", 0)(/foo/)).toBe(true);
        });
    });

    describe("hasPathValue", function () {
        var obj = {a: 2, b: {a: 3, b: [4, 5], c: "foo", e: {a: 45}}, "c.d" : {"e.f": 6}, c: {a: -0, b: NaN}};
        obj.b.d = Array(3);
        obj.b.d[1] = 99;

        Object.defineProperty(obj, "e", {value : 10});
        obj.f = Object.create({}, {g: {value : 20}});

        it("should verify if the given path points to the desired value", function () {
            expect(lamb.hasPathValue("a", 2)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.a", 3)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.b", obj.b.b)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.e.a", 45)(obj)).toBe(true);
            expect(lamb.hasPathValue("a", "2")(obj)).toBe(false);
            expect(lamb.hasPathValue("b.a", -3)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.b", [4, 5])(obj)).toBe(false);
            expect(lamb.hasPathValue("b.e.a", [45])(obj)).toBe(false);
        });

        it("should use the SameValueZero comparison", function () {
            expect(lamb.hasPathValue("c.a", 0)(obj)).toBe(true);
            expect(lamb.hasPathValue("c.a", -0)(obj)).toBe(true);
            expect(lamb.hasPathValue("c.b", NaN)(obj)).toBe(true);
        });

        it("should be able to verify non-enumerable properties", function () {
            expect(lamb.hasPathValue("e", 10)(obj)).toBe(true);
            expect(lamb.hasPathValue("f.g", 20)(obj)).toBe(true);
        });

        it("should be able to verify values in arrays and array-like objects", function () {
            expect(lamb.hasPathValue("b.b.0", 4)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.c.0", "f")(obj)).toBe(true);
        });

        it("should allow negative indexes in paths", function () {
            expect(lamb.hasPathValue("b.b.-1", 5)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.c.-3", "f")(obj)).toBe(true);
        });

        it("should return `false` for a non-existent property in a valid source", function () {
            expect(lamb.hasPathValue("b.a.z", void 0)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.z.a", void 0)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.b.2", void 0)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.b.-3", void 0)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.c.3", void 0)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.c.-4", void 0)(obj)).toBe(false);
            expect(lamb.hasPathValue("b.e.z", void 0)(obj)).toBe(false);
        });

        it("should work with sparse arrays", function () {
            expect(lamb.hasPathValue("b.d.0", void 0)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.d.-3", void 0)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.d.1", 99)(obj)).toBe(true);
            expect(lamb.hasPathValue("b.d.-2", 99)(obj)).toBe(true);
        });

        it("should be able to verify values nested in arrays", function () {
            var o = {data: [
                {id: 1, value: 10},
                {id: 2, value: 20},
                {id: 3, value: 30}
            ]};

            expect(lamb.hasPathValue("data.1.value", 20)(o)).toBe(true);
            expect(lamb.hasPathValue("data.-1.value", 30)(o)).toBe(true);
        });

        it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
            var o = {a: ["abc", new String("def"), "ghi"]};
            o.a["-1"] = "foo";
            o.a[1]["-2"] = "bar";
            Object.defineProperty(o.a, "-2", {value: 99});

            expect(lamb.hasPathValue("a.-1", "foo")(o)).toBe(true);
            expect(lamb.hasPathValue("a.1.-2", "bar")(o)).toBe(true);
            expect(lamb.hasPathValue("a.-2", 99)(o)).toBe(true);
        });

        it("should accept a custom path separator", function () {
            expect(lamb.hasPathValue("b->b->0", 4, "->")(obj)).toBe(true);
            expect(lamb.hasPathValue("c.d/e.f", 6, "/")(obj)).toBe(true);
        });

        it("should accept integers as paths containing a single key", function () {
            expect(lamb.hasPathValue(1, 2)([1, 2])).toBe(true);
            expect(lamb.hasPathValue(-1, 2)([1, 2])).toBe(true);
            expect(lamb.hasPathValue(1, "a")({"1": "a"})).toBe(true);
        });

        it("should convert other values for the `path` parameter to string", function () {
            var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var testObj = lamb.make(invalidKeysAsStrings, values);

            invalidKeys.forEach(function (key) {
                var value = values[invalidKeysAsStrings.indexOf(String(key))];
                expect(lamb.hasPathValue(key, value, "_")(testObj)).toBe(true);
            });

            var fooObj = {a: 2, "1": {"5": 3}};

            expect(lamb.hasPathValue(1.5, 3)(fooObj)).toBe(true);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.hasPathValue()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
            expect(function () { lamb.hasPathValue("a", 99)(null); }).toThrow();
            expect(function () { lamb.hasPathValue("a", 99)(void 0); }).toThrow();
        });

        it("should convert to object every other value", function () {
            wannabeEmptyObjects.map(function (value) {
                expect(lamb.hasPathValue("a", 99)(value)).toBe(false);
            });

            expect(lamb.hasPathValue("lastIndex", 0)(/foo/)).toBe(true);
        });
    });

    describe("keySatisfies", function () {
        var users = [
            {"name": "Jane", "age": 12, active: false},
            {"name": "John", "age": 40, active: false},
            {"name": "Mario", "age": 18, active: true},
            {"name": "Paolo", "age": 15, active: true}
        ];

        var isValue = lamb.curry(lamb.is);

        it("should use a predicate and a property name to build a new predicate that will be applied on an object's key", function () {
            var isAdult = lamb.keySatisfies(lamb.isGTE(18), "age");

            expect(users.map(isAdult)).toEqual([false, true, true, false]);
        });

        it("should pass an `undefined` value to the predicate if the given property doesn't exist", function () {
            var isGreaterThan17 = function (n) {
                expect(arguments.length).toBe(1);
                expect(n).toBeUndefined();
                return n > 17;
            };

            expect(lamb.keySatisfies(isGreaterThan17, "foo")(users[0])).toBe(false);
            expect(lamb.keySatisfies(isGreaterThan17, "bar")(users[2])).toBe(false);
        });

        it("should apply the function's calling context to the predicate", function () {
            var ageValidator = {
                minAllowedAge: 15,
                maxAllowedAge: 50,
                hasValidAge: lamb.keySatisfies(function (age) {
                    return age >= this.minAllowedAge && age <= this.maxAllowedAge;
                }, "age")
            };

            expect(ageValidator.hasValidAge({age: 20})).toBe(true);
            expect(ageValidator.hasValidAge({age: 55})).toBe(false);

            var ageValidator2 = Object.create(ageValidator, {
                minAllowedAge: {value: 21},
                maxAllowedAge: {value: 55}
            });

            expect(ageValidator2.hasValidAge({age: 20})).toBe(false);
            expect(ageValidator2.hasValidAge({age: 55})).toBe(true);
        });

        it("should accept integers as keys and accept array-like objects", function () {
            var o = {"1": "a", "2": "b"};
            var arr = [1, 2, 3, 4];
            var s = "abcd";

            expect(lamb.keySatisfies(isValue("a"), 1)(o)).toBe(true);
            expect(lamb.keySatisfies(isValue(2), 1)(arr)).toBe(true);
            expect(lamb.keySatisfies(isValue("c"), 2)(s)).toBe(true);
        });

        it("should pass an `undefined` value to the predicate for unassigned or deleted indexes in sparse arrays", function () {
            expect(lamb.keySatisfies(lamb.isUndefined, "1")([1, , 3])).toBe(true);
            expect(lamb.keySatisfies(lamb.isUndefined, "-2")([1, , 3])).toBe(true);
        });

        it("should convert other values for the `key` parameter to string", function () {
            var d = new Date();
            var keys = [null, void 0, {a: 2}, [1, 2], /foo/, 1, function () {}, NaN, true, d];
            var stringKeys = keys.map(String);
            var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var testObj = lamb.make(stringKeys, values);

            keys.forEach(function (key) {
                var value = stringKeys.indexOf(String(key));

                expect(lamb.keySatisfies(isValue(value), key)(testObj)).toBe(true);
            });

            expect(lamb.keySatisfies(isValue(99))({"undefined": 99})).toBe(true);
        });

        it("should throw an exception if the predicate isn't a function or is missing", function () {
            nonFunctions.forEach(function (value) {
                expect(function () { lamb.keySatisfies(value, "foo")({}); }).toThrow();
            });

            expect(function () { lamb.keySatisfies()({}); }).toThrow();
        });

        it("should throw an exception if called without the data argument", function () {
            expect(lamb.keySatisfies(lamb.contains, "foo")).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
            expect(function () { lamb.keySatisfies(lamb.contains(99), "foo")(null); }).toThrow();
            expect(function () { lamb.keySatisfies(lamb.contains(99), "foo")(void 0); }).toThrow();
        });

        it("should convert to object every other value", function () {
            var isZero = lamb.isSVZ(0);

            wannabeEmptyObjects.forEach(function (v) {
                expect(lamb.keySatisfies(isZero, "foo")(v)).toBe(false);
            });

            expect(lamb.keySatisfies(isZero, "lastIndex")(/foo/)).toBe(true);
        });
    });

    describe("pathExists / pathExistsIn", function () {
        var obj = {a: 2, b: {a: 3, b: [4, 5], c: "foo", e: {a: 45}}, "c.d" : {"e.f": 6}, c: {a: -0, b: NaN}};
        obj.b.d = Array(3);
        obj.b.d[1] = 99;

        Object.defineProperty(obj, "e", {value : 10});
        obj.f = Object.create({}, {g: {value : 20}});

        it("should verify if the provided path exists in the given object", function () {
            expect(lamb.pathExists("a")(obj)).toBe(true);
            expect(lamb.pathExists("b.a")(obj)).toBe(true);
            expect(lamb.pathExists("b.b")(obj)).toBe(true);
            expect(lamb.pathExists("b.e.a")(obj)).toBe(true);
            expect(lamb.pathExists("z")(obj)).toBe(false);
            expect(lamb.pathExists("a.z")(obj)).toBe(false);
            expect(lamb.pathExists("b.a.z")(obj)).toBe(false);

            expect(lamb.pathExistsIn(obj, "a")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.a")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.b")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.e.a")).toBe(true);
            expect(lamb.pathExistsIn(obj, "z")).toBe(false);
            expect(lamb.pathExistsIn(obj, "a.z")).toBe(false);
            expect(lamb.pathExistsIn(obj, "b.a.z")).toBe(false);
        });

        it("should be able to check paths with non-enumerable properties", function () {
            expect(lamb.pathExists("e")(obj)).toBe(true);
            expect(lamb.pathExists("f.g")(obj)).toBe(true);

            expect(lamb.pathExistsIn(obj, "e")).toBe(true);
            expect(lamb.pathExistsIn(obj, "f.g")).toBe(true);
        });

        it("should be able to check arrays and array-like objects", function () {
            expect(lamb.pathExists("b.b.0")(obj)).toBe(true);
            expect(lamb.pathExists("b.c.0")(obj)).toBe(true);
            expect(lamb.pathExists("b.b.2")(obj)).toBe(false);
            expect(lamb.pathExists("b.c.3")(obj)).toBe(false);

            expect(lamb.pathExistsIn(obj, "b.b.0")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.c.0")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.b.2")).toBe(false);
            expect(lamb.pathExistsIn(obj, "b.c.3")).toBe(false);
        });

        it("should allow negative indexes in paths", function () {
            expect(lamb.pathExists("b.b.-1")(obj)).toBe(true);
            expect(lamb.pathExists("b.c.-3")(obj)).toBe(true);
            expect(lamb.pathExists("b.b.-3")(obj)).toBe(false);
            expect(lamb.pathExists("b.c.-4")(obj)).toBe(false);

            expect(lamb.pathExistsIn(obj, "b.b.-1")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.c.-3")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.b.-3")).toBe(false);
            expect(lamb.pathExistsIn(obj, "b.c.-4")).toBe(false);
        });

        it("should work with sparse arrays", function () {
            expect(lamb.pathExists("b.d.0")(obj)).toBe(true);
            expect(lamb.pathExists("b.d.1")(obj)).toBe(true);
            expect(lamb.pathExists("b.d.-2")(obj)).toBe(true);

            expect(lamb.pathExistsIn(obj, "b.d.0")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.d.1")).toBe(true);
            expect(lamb.pathExistsIn(obj, "b.d.-2")).toBe(true);
        });

        it("should be able to check objects nested in arrays", function () {
            var o = {data: [
                {id: 1, value: 10},
                {id: 2, value: 20},
                {id: 3, value: 30}
            ]};

            expect(lamb.pathExists("data.1.value")(o)).toBe(true);
            expect(lamb.pathExists("data.-1.value")(o)).toBe(true);
            expect(lamb.pathExists("data.3.value")(o)).toBe(false);
            expect(lamb.pathExists("data.-4.value")(o)).toBe(false);

            expect(lamb.pathExistsIn(o, "data.1.value")).toBe(true);
            expect(lamb.pathExistsIn(o, "data.-1.value")).toBe(true);
            expect(lamb.pathExistsIn(o, "data.3.value")).toBe(false);
            expect(lamb.pathExistsIn(o, "data.-4.value")).toBe(false);
        });

        it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
            var o = {a: ["abc", new String("def"), "ghi"]};
            o.a["-1"] = "foo";
            o.a[1]["-2"] = "bar";
            Object.defineProperty(o.a, "-2", {value: 99});

            expect(lamb.pathExists("a.-1")(o)).toBe(true);
            expect(lamb.pathExists("a.1.-2")(o)).toBe(true);
            expect(lamb.pathExists("a.-2")(o)).toBe(true);

            expect(lamb.pathExistsIn(o, "a.-1")).toBe(true);
            expect(lamb.pathExistsIn(o, "a.1.-2")).toBe(true);
            expect(lamb.pathExistsIn(o, "a.-2")).toBe(true);
        });

        it("should accept a custom path separator", function () {
            expect(lamb.pathExists("b->b->0", "->")(obj)).toBe(true);
            expect(lamb.pathExists("c.d/e.f", "/")(obj)).toBe(true);

            expect(lamb.pathExistsIn(obj, "b->b->0", "->")).toBe(true);
            expect(lamb.pathExistsIn(obj, "c.d/e.f", "/")).toBe(true);
        });

        it("should accept integers as paths containing a single key", function () {
            expect(lamb.pathExists(1)([1, 2])).toBe(true);
            expect(lamb.pathExists(-1)([1, 2])).toBe(true);
            expect(lamb.pathExists(1)({"1": "a"})).toBe(true);

            expect(lamb.pathExistsIn([1, 2], 1)).toBe(true);
            expect(lamb.pathExistsIn([1, 2], -1)).toBe(true);
            expect(lamb.pathExistsIn({"1": "a"}, 1)).toBe(true);
        });

        it("should convert other values for the `path` parameter to string", function () {
            var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var testObj = lamb.make(invalidKeysAsStrings, values);

            invalidKeys.forEach(function (key) {
                expect(lamb.pathExists(key, "_")(testObj)).toBe(true);
                expect(lamb.pathExistsIn(testObj, key, "_")).toBe(true);
            });

            var fooObj = {a: 2, "1": {"5": 3}};

            expect(lamb.pathExists(1.5)(fooObj)).toBe(true);
            expect(lamb.pathExistsIn(fooObj, 1.5)).toBe(true);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.pathExists()).toThrow();
            expect(function () { lamb.pathExistsIn(); }).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
            expect(function () { lamb.pathExists("a")(null); }).toThrow();
            expect(function () { lamb.pathExists("a")(void 0); }).toThrow();

            expect(function () { lamb.pathExistsIn(null, "a"); }).toThrow();
            expect(function () { lamb.pathExistsIn(void 0, "a"); }).toThrow();
        });

        it("should convert to object every other value", function () {
            wannabeEmptyObjects.map(function (value) {
                expect(lamb.pathExists("a")(value)).toBe(false);
                expect(lamb.pathExistsIn(value, "a")).toBe(false);
            });

            expect(lamb.pathExists("lastIndex")(/foo/)).toBe(true);
            expect(lamb.pathExistsIn(/foo/, "lastIndex")).toBe(true);
        });
    });

    describe("pathSatisfies", function () {
        var obj = {a: 2, b: {a: 3, b: [4, 5], c: "foo", e: {a: 45}}, "c.d" : {"e.f": 6}, c: {a: -0, b: NaN}};
        obj.b.d = Array(3);
        obj.b.d[1] = 99;

        Object.defineProperty(obj, "e", {value : 10});
        obj.f = Object.create({}, {g: {value : 20}});

        var isValue = lamb.curry(lamb.is);
        var isDefined = lamb.not(lamb.isUndefined);

        it("should verify if the provided path satisfies a predicate in the given object", function () {
            expect(lamb.pathSatisfies(isValue(2), "a")(obj)).toBe(true);
            expect(lamb.pathSatisfies(isValue(3), "b.a")(obj)).toBe(true);
            expect(lamb.pathSatisfies(Array.isArray, "b.b")(obj)).toBe(true);
            expect(lamb.pathSatisfies(isValue(99), "z")(obj)).toBe(false);
            expect(lamb.pathSatisfies(isDefined, "a.z")(obj)).toBe(false);
            expect(lamb.pathSatisfies(isDefined, "b.a.z")(obj)).toBe(false);
        });

        it("should pass an `undefined` value to the predicate if the path doesn't exist", function () {
            var isDefined = function (v) {
                expect(arguments.length).toBe(1);
                expect(v).toBeUndefined();
                return !lamb.isUndefined(v);
            };

            expect(lamb.pathSatisfies(isDefined, "a.z")(obj)).toBe(false);
            expect(lamb.pathSatisfies(isDefined, "b.a.z")(obj)).toBe(false);
        });

        it("should apply the function's calling context to the predicate", function () {
            var validator = {
                minAllowedValue: 3,
                maxAllowedValue: 10,
                hasValidValue: lamb.pathSatisfies(function (value) {
                    return value >= this.minAllowedValue && value <= this.maxAllowedValue;
                }, "b.a")
            };

            expect(validator.hasValidValue(obj)).toBe(true);
            expect(validator.hasValidValue({b: {a: 1}})).toBe(false);
        });

        it("should be able to check paths with non-enumerable properties", function () {
            expect(lamb.pathSatisfies(isValue(10), "e")(obj)).toBe(true);
            expect(lamb.pathSatisfies(isValue(20), "f.g")(obj)).toBe(true);
        });

        it("should be able to check arrays and array-like objects", function () {
            expect(lamb.pathSatisfies(isValue(4), "b.b.0")(obj)).toBe(true);
            expect(lamb.pathSatisfies(isValue("f"), "b.c.0")(obj)).toBe(true);
        });

        it("should allow negative indexes in paths", function () {
            expect(lamb.pathSatisfies(isValue(5), "b.b.-1")(obj)).toBe(true);
            expect(lamb.pathSatisfies(isValue("f"), "b.c.-3")(obj)).toBe(true);
        });

        it("should pass an `undefined` value to the predicate for unassigned or deleted indexes in sparse arrays", function () {
            expect(lamb.pathSatisfies(lamb.isUndefined, "b.d.0")(obj)).toBe(true);
            expect(lamb.pathSatisfies(lamb.isUndefined, "b.d.-3")(obj)).toBe(true);
            expect(lamb.pathSatisfies(lamb.isUndefined, "1")([1, , 3])).toBe(true);
            expect(lamb.pathSatisfies(lamb.isUndefined, "-2")([1, , 3])).toBe(true);
        });

        it("should be able to check objects nested in arrays", function () {
            var o = {data: [
                {id: 1, value: 10},
                {id: 2, value: 20},
                {id: 3, value: 30}
            ]};

            expect(lamb.pathSatisfies(isValue(20), "data.1.value")(o)).toBe(true);
            expect(lamb.pathSatisfies(isValue(30), "data.-1.value")(o)).toBe(true);
        });

        it("should give priority to object keys over array-like indexes when a negative index is encountered", function () {
            var o = {a: ["abc", new String("def"), "ghi"]};
            o.a["-1"] = "foo";
            o.a[1]["-2"] = "bar";
            Object.defineProperty(o.a, "-2", {value: 99});

            expect(lamb.pathSatisfies(isValue("foo"), "a.-1")(o)).toBe(true);
            expect(lamb.pathSatisfies(isValue("bar"), "a.1.-2")(o)).toBe(true);
            expect(lamb.pathSatisfies(isValue(99), "a.-2")(o)).toBe(true);
        });

        it("should accept a custom path separator", function () {
            expect(lamb.pathSatisfies(isValue(4), "b->b->0", "->")(obj)).toBe(true);
            expect(lamb.pathSatisfies(isValue(6), "c.d/e.f", "/")(obj)).toBe(true);
        });

        it("should accept integers as paths containing a single key", function () {
            expect(lamb.pathSatisfies(isValue(2), 1)([1, 2])).toBe(true);
            expect(lamb.pathSatisfies(isValue(2), -1)([1, 2])).toBe(true);
            expect(lamb.pathSatisfies(isValue("a"), 1)({"1": "a"})).toBe(true);
        });

        it("should convert other values for the `path` parameter to string", function () {
            var values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var testObj = lamb.make(invalidKeysAsStrings, values);

            invalidKeys.forEach(function (key, idx) {
                expect(lamb.pathSatisfies(isValue(values[idx]), key, "_")(testObj)).toBe(true);
            });

            var fooObj = {a: 2, "1": {"5": 3}};

            expect(lamb.pathSatisfies(isValue(3), 1.5)(fooObj)).toBe(true);
        });

        it("should throw an exception if called without arguments", function () {
            expect(lamb.pathSatisfies()).toThrow();
        });

        it("should throw an exception if supplied with `null` or `undefined` instead of an object", function () {
            expect(function () { lamb.pathSatisfies(isValue(99), "a")(null); }).toThrow();
            expect(function () { lamb.pathSatisfies(isValue(99), "a")(void 0); }).toThrow();
        });

        it("should convert to object every other value", function () {
            wannabeEmptyObjects.map(function (value) {
                expect(lamb.pathSatisfies(isDefined, "a")(value)).toBe(false);
            });

            expect(lamb.pathSatisfies(isDefined, "lastIndex")(/foo/)).toBe(true);
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
        var pwdConfirmCheck = lamb.checker(lamb.areSame, "Passwords don't match", ["login.password", "login.passwordConfirm"]);

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

            it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
                var isEven = function (n) { return n % 2 === 0; };
                var hasEvens = function (array) { return ~lamb.findIndex(array, isEven); };
                var isVowel = function (char) { return ~"aeiouAEIOU".indexOf(char); };
                var o = {a: [1, 3, 5, 6, 7], b: [1, 3, 5, 7], c: "a", d: "b"};

                var checker1 = lamb.checker(hasEvens, "error", ["a"]);
                var checker2 = lamb.checker(hasEvens, "error", ["b"]);
                var checker3 = lamb.checker(isVowel, "error", ["c"]);
                var checker4 = lamb.checker(isVowel, "error", ["d"]);

                expect(checker1(o)).toEqual([]);
                expect(checker2(o)).toEqual(["error", ["b"]]);
                expect(checker3(o)).toEqual([]);
                expect(checker4(o)).toEqual(["error", ["d"]]);
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
