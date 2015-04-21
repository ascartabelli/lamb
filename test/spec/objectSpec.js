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
    });

    describe("fromPairs", function () {
        it("should build an object from a list of key / value pairs", function () {
            expect(lamb.fromPairs([["a", 1], ["b", 2], ["c", 3]])).toEqual({a: 1, b: 2, c: 3});
        });

        it("should use the last key / value pair in case of duplicate keys", function () {
            expect(lamb.fromPairs([["a", 1], ["b", 2], ["a", 3]])).toEqual({a: 3, b: 2});
        });

        it("should convert missing or non string keys to strings and missing values to `undefined`", function () {
            expect(lamb.fromPairs([[1], [void 0, 2], [null, 3]])).toEqual({"1": void 0, "undefined": 2, "null": 3});
        });
    });

    describe("get", function () {
        it("should return the value of the given object property", function () {
            var obj = {"foo" : 1, "bar" : 2, "baz" : 3};

            expect(lamb.get(obj, "bar")).toBe(2);
        });
    });

    describe("getKey", function () {
        it("should build a function returning the specified property for any given object", function () {
            var objs  = [{"id" : 1}, {"id" : 2}, {"id" : 3}, {"id" : 4}, {"id" : 5}, {}];
            var getID = lamb.getKey("id");

            expect(objs.map(getID)).toEqual([1, 2, 3, 4, 5, void(0)]);
        });
    });

    describe("getWithPath", function () {
        var obj = {a: 2, b: {a: 3, b: [4, 5], c: "foo"}, "c.d" : {"e.f": 6}};

        it("should retrieve a nested object property using the supplied path", function () {
            expect(lamb.getWithPath(obj, "a")).toBe(2);
            expect(lamb.getWithPath(obj, "b.a")).toBe(3);
            expect(lamb.getWithPath(obj, "b.b")).toBe(obj.b.b);
        });

        it("should be able to retrieve values from arrays and array-like objects", function () {
            expect(lamb.getWithPath(obj, "b.b.0")).toBe(4);
            expect(lamb.getWithPath(obj, "b.c.0")).toBe("f");
        });

        it("should accept a custom path separator", function () {
            expect(lamb.getWithPath(obj, "b->b->0", "->")).toBe(4);
            expect(lamb.getWithPath(obj, "c.d/e.f", "/")).toBe(6);
        });

        it("should return undefined for a unknown property in an existent object", function () {
            expect(lamb.getWithPath(obj, "b.a.z")).not.toBeDefined();
        });

        it("should throw an error if a non existent object is requested in the path", function () {
            expect(function () {lamb.getWithPath(obj, "b.z.a")}).toThrow();
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

        describe("hasOwn", function () {
            it("should check the existence of an owned property in an object", function () {
                expect(lamb.hasOwn(obj, "toString")).toBe(false);
                expect(lamb.hasOwn(obj, "foo")).toBe(true);
                expect(lamb.hasOwn(obj, "baz")).toBe(false);
            });
        });

        describe("hasOwnKey", function () {
            it("should build a function expecting an object to check for the ownership of the given property", function () {
                var hasOwnToString = lamb.hasOwnKey("toString");
                var hasOwnFoo = lamb.hasOwnKey("foo");
                var hasOwnBaz = lamb.hasOwnKey("baz");

                expect(hasOwnToString(obj)).toBe(false);
                expect(hasOwnFoo(obj)).toBe(true);
                expect(hasOwnBaz(obj)).toBe(false);
            });
        });
    });

    describe("hasKeyValue", function () {
        it("should build a function that checks if an object holds the desired key / value pair", function () {
            var persons = [
                {"name": "Jane", "surname": "Doe"},
                {"name": "John", "surname": "Doe"},
                {"name": "Mario", "surname": "Rossi"}
            ];

            var isDoe = lamb.hasKeyValue("surname", "Doe");

            expect(persons.map(isDoe)).toEqual([true, true, false]);
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

        it("should convert non string keys to strings", function () {
            expect(lamb.make([null, void 0, 2], [1, 2, 3])).toEqual({"null": 1, "undefined": 2, "2": 3});
        });
    });

    describe("merge", function () {
        it("should merge the enumerable properties of the provided sources into a new object without mutating them", function () {
            // seems that this version of jasmine (2.2.1) checks only own enumerable properties with the "toEqual" expectation

            var baseFoo = Object.create({a: 1}, {b: {value: 2, enumerable: true}, z: {value: 5}});
            var foo = Object.create(baseFoo, {
                c: {value: 3, enumerable: true}
            });

            var bar = {d: 4};

            var newObj = lamb.merge(foo, bar);

            expect(newObj).toEqual({a: 1, b: 2, c: 3, d: 4});
            expect(newObj.z).not.toBeDefined();

            var fooEquivalent = {a: 1, b: 2, c: 3, z: 5};

            for (var key in fooEquivalent) {
                expect(foo[key]).toEqual(fooEquivalent[key]);
            }

            expect(bar).toEqual({d: 4});
        });

        it("should handle key homonymy by giving to each source precedence over the previous ones", function (){
            expect(lamb.merge({a: 1}, {b: 3, c: 4}, {b: 5})).toEqual({a: 1, b: 5, c: 4});
        });
    });

    describe("pairs", function () {
        it("should convert an object in a list of key / value pairs", function () {
            expect(lamb.pairs({a: 1, b: 2, c: 3})).toEqual([["a", 1], ["b", 2], ["c", 3]]);
        });

        it("should use all the enumerable properties of the source object, inherited or not", function () {
            var baseFoo = Object.create({a: 1}, {b: {value: 2}});
            var foo = Object.create(baseFoo, {
                c: {value: 3},
                d: {value: 4, enumerable: true}
            });

            expect(lamb.pairs(foo)).toEqual([["d", 4], ["a", 1]]);
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

    describe("tear", function () {
        it("should transform an object in two lists, one containing its keys, the other containing the corresponding values", function () {
            expect(lamb.tear({a: 1, b: 2, c: 3})).toEqual([["a", "b", "c"], [1, 2, 3]]);
        });

        it("should use all the enumerable properties of the source object, inherited or not", function () {
            var baseFoo = Object.create({a: 1}, {b: {value: 2}});
            var foo = Object.create(baseFoo, {
                c: {value: 3},
                d: {value: 4, enumerable: true}
            });

            expect(lamb.tear(foo)).toEqual([["d", "a"], [4, 1]]);
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

    describe("values", function () {
        it("should return an array of values of the given object enumerable properties", function () {
            function Foo () {
            }
            Foo.prototype = {
                bar : "bar"
            }

            function Bar () {
                this.foo = "foo";
                this.baz = "baz";
            }
            Bar.prototype = new Foo();

            var obj = new Bar();

            expect(lamb.values(obj)).toEqual(["foo", "baz", "bar"]);
        });
    });
});
