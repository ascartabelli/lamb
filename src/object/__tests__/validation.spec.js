import * as lamb from "../..";

describe("Object validation", function () {
    var persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York", email: "jane@doe" },
        { name: "John", surname: "Doe", age: 40, city: "London", email: "john@doe" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome", email: "mario@rossi.it" },
        { name: "Paolo", surname: "Bianchi", age: 15, city: "Amsterdam", email: "paolo@bianchi.nl" }
    ];

    persons[0].login = { "user.name": "", password: "jane", passwordConfirm: "janE" };

    var isAdult = function (age) { return age >= 18; };
    var isRequired = function (v) { return v.length > 0; };
    var isValidMail = function (mail) {
        // eslint-disable-next-line max-len
        return /^[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([.-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/.test(mail);
    };
    var isValidPassword = function (pwd) { return pwd.length > 5; };

    var mailCheck = lamb.checker(isValidMail, "Must have a valid mail", ["email"]);
    var ageCheck = lamb.checker(isAdult, "Must be at least 18 years old", ["age"]);
    var pwdCheck = lamb.checker(
        isValidPassword,
        "Passwords must have at least six characters",
        ["login.password"]
    );
    var userNameCheck = lamb.checker(
        isRequired,
        "The username is a required field",
        ["login/user.name"],
        "/"
    );
    var pwdConfirmCheck = lamb.checker(
        lamb.areSame,
        "Passwords don't match",
        ["login.password", "login.passwordConfirm"]
    );

    describe("checker", function () {
        it("should build a function to validate the given properties of an object", function () {
            expect(mailCheck(persons[0])).toEqual(["Must have a valid mail", ["email"]]);
            expect(mailCheck(persons[2])).toEqual([]);
        });

        it("should accept string paths as property names", function () {
            expect(pwdCheck(persons[0])).toEqual(
                ["Passwords must have at least six characters", ["login.password"]]
            );
            expect(userNameCheck(persons[0])).toEqual(
                ["The username is a required field", ["login/user.name"]]
            );
        });

        it("should be possible to make a checker involving more than one property", function () {
            expect(pwdConfirmCheck(persons[0])).toEqual(
                ["Passwords don't match", ["login.password", "login.passwordConfirm"]]
            );
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", function () {
            var isEven = function (n) { return n % 2 === 0; };
            var hasEvens = function (array) { return ~lamb.findIndex(array, isEven); };
            var isVowel = function (char) { return ~"aeiouAEIOU".indexOf(char); };
            var o = { a: [1, 3, 5, 6, 7], b: [1, 3, 5, 7], c: "a", d: "b" };

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
