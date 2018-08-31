import * as lamb from "../..";

describe("immutable", function () {
    var persons;
    var newPerson;

    beforeEach(function () {
        persons = [
            { name: "Jane", surname: "Doe", age: 12, city: "New York" },
            { name: "John", surname: "Doe", age: 40, city: "London" },
            { name: "Mario", surname: "Rossi", age: 18, city: "Rome" }
        ];

        newPerson = {
            name: "Paolo",
            surname: "Bianchi",
            age: null,
            city: "Amsterdam",
            contact: {
                mail: "paolo@bianchi.it",
                phone: "+39123456789"
            },
            luckyNumbers: [13, 17]
        };
    });

    it("should make an object immutable", function () {
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
            c: { d: null, e: void 0 }
        };

        expect(function () { lamb.immutable(o); }).not.toThrow();
    });
});
