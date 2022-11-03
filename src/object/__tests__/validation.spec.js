import areSame from "../../logic/areSame";
import checker from "../checker";
import findIndex from "../../array/findIndex";
import validate from "../validate";
import validateWith from "../validateWith";

describe("Object validation", () => {
    const persons = [
        { name: "Jane", surname: "Doe", age: 12, city: "New York", email: "jane@doe" },
        { name: "John", surname: "Doe", age: 40, city: "London", email: "john@doe" },
        { name: "Mario", surname: "Rossi", age: 18, city: "Rome", email: "mario@rossi.it" },
        { name: "Paolo", surname: "Bianchi", age: 15, city: "Amsterdam", email: "paolo@bianchi.nl" }
    ];

    persons[0].login = { "user.name": "", password: "jane", passwordConfirm: "janE" };

    const isAdult = age => age >= 18;
    const isRequired = value => value.length > 0;

    // eslint-disable-next-line max-len
    const isValidMail = mail => /^[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([.-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/.test(mail);
    const isValidPassword = pwd => pwd.length > 5;

    const mailCheck = checker(isValidMail, "Must have a valid mail", ["email"]);
    const ageCheck = checker(isAdult, "Must be at least 18 years old", ["age"]);
    const pwdCheck = checker(
        isValidPassword,
        "Passwords must have at least six characters",
        ["login.password"]
    );
    const userNameCheck = checker(
        isRequired,
        "The username is a required field",
        ["login/user.name"],
        "/"
    );
    const pwdConfirmCheck = checker(
        areSame,
        "Passwords don't match",
        ["login.password", "login.passwordConfirm"]
    );

    describe("checker", () => {
        it("should build a function to validate the given properties of an object", () => {
            expect(mailCheck(persons[0])).toStrictEqual(["Must have a valid mail", ["email"]]);
            expect(mailCheck(persons[2])).toStrictEqual([]);
        });

        it("should accept string paths as property names", () => {
            expect(pwdCheck(persons[0])).toStrictEqual(
                ["Passwords must have at least six characters", ["login.password"]]
            );
            expect(userNameCheck(persons[0])).toStrictEqual(
                ["The username is a required field", ["login/user.name"]]
            );
        });

        it("should be possible to make a checker involving more than one property", () => {
            expect(pwdConfirmCheck(persons[0])).toStrictEqual(
                ["Passwords don't match", ["login.password", "login.passwordConfirm"]]
            );
        });

        it("should treat \"truthy\" and \"falsy\" values returned by predicates as booleans", () => {
            const isEven = n => n % 2 === 0;
            const hasEvens = array => ~findIndex(array, isEven);
            const isVowel = char => ~"aeiouAEIOU".indexOf(char);
            const o = { a: [1, 3, 5, 6, 7], b: [1, 3, 5, 7], c: "a", d: "b" };

            const checker1 = checker(hasEvens, "error", ["a"]);
            const checker2 = checker(hasEvens, "error", ["b"]);
            const checker3 = checker(isVowel, "error", ["c"]);
            const checker4 = checker(isVowel, "error", ["d"]);

            expect(checker1(o)).toStrictEqual([]);
            expect(checker2(o)).toStrictEqual(["error", ["b"]]);
            expect(checker3(o)).toStrictEqual([]);
            expect(checker4(o)).toStrictEqual(["error", ["d"]]);
        });
    });

    describe("validate", () => {
        it("should validate an object with the given set of checkers", () => {
            expect(validate(persons[0], [mailCheck, ageCheck])).toStrictEqual([
                ["Must have a valid mail", ["email"]],
                ["Must be at least 18 years old", ["age"]]
            ]);
            expect(validate(persons[1], [mailCheck, ageCheck])).toStrictEqual([
                ["Must have a valid mail", ["email"]]
            ]);
            expect(validate(persons[2], [mailCheck, ageCheck])).toStrictEqual([]);
        });
    });

    describe("validateWith", () => {
        it("should build a validator to be reused with different objects", () => {
            const personValidator = validateWith([mailCheck, ageCheck]);

            expect(persons.map(personValidator)).toStrictEqual([
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
