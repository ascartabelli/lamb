import * as lamb from "../..";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("sort / sortWith", function () {
    var descSorter = lamb.sorterDesc();

    var persons = [
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" },
        { name: "John", surname: "Moe" },
        { name: "Jane", surname: "Foe" }
    ];

    var personsByNameAsc = [
        { name: "Jane", surname: "Foe" },
        { name: "John", surname: "Doe" },
        { name: "John", surname: "Moe" },
        { name: "Mario", surname: "Rossi" }
    ];

    // eslint-disable-next-line id-length
    var personsByNameAscSurnameDesc = [
        { name: "Jane", surname: "Foe" },
        { name: "John", surname: "Moe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" }
    ];

    var personsByNameReversed = personsByNameAsc.slice().reverse();

    var numbers = [6, -0, 4, 5, 7, 4, 3, 4, 0, 1, 2];

    var mixed = ["1", NaN, null, "10", null, {}, 1, void 0, NaN, false, [], "20", "15", -100];
    var mixedAsNumbersAsc = [-100, null, null, false, [], "1", 1, "10", "15", "20", NaN, {}, void 0, NaN];
    var mixedAsNumbersDesc = mixedAsNumbersAsc.slice().reverse();

    var nameAsc = lamb.sorter(lamb.getKey("name"));
    var nameDesc = lamb.sorterDesc(lamb.getKey("name"));
    var surnameDesc = lamb.sorterDesc(lamb.getKey("surname"));

    it("should build a sorted copy of the provided array-like object", function () {
        var sortedNumbersA = lamb.sort(numbers, [descSorter]);
        var sortedNumbersB = lamb.sortWith([descSorter])(numbers);
        var numbersResult = [7, 6, 5, 4, 4, 4, 3, 2, 1, 0, -0];

        expect(sortedNumbersA).toEqual(numbersResult);
        expect(sortedNumbersA).not.toBe(numbers);
        expect(sortedNumbersB).toEqual(numbersResult);
        expect(sortedNumbersB).not.toBe(numbers);
    });

    it("should perform a stable ascending sort", function () {
        var myPersonsA = lamb.sort(persons, [nameAsc]);
        var myPersonsB = lamb.sortWith([nameAsc])(persons);

        expect(myPersonsA).toEqual(personsByNameAsc);
        expect(myPersonsB).toEqual(personsByNameAsc);
    });

    it("should perform descending sort as the reverse of an ascending one", function () {
        var myPersonsA = lamb.sort(persons, [nameDesc]);
        var myPersonsB = lamb.sortWith([nameDesc])(persons);
        var mixedDescA = lamb.sort(mixed, [lamb.sorterDesc(Number)]);
        var mixedDescB = lamb.sortWith([lamb.sorterDesc(Number)])(mixed);

        expect(myPersonsA).toEqual(personsByNameReversed);
        expect(myPersonsB).toEqual(personsByNameReversed);
        expect(mixedDescA).toEqual(mixedAsNumbersDesc);
        expect(mixedDescB).toEqual(mixedAsNumbersDesc);
    });

    it("should be able to perform multi sorting with the specified criteria", function () {
        var myPersonsA = lamb.sort(persons, [nameAsc, surnameDesc]);
        var myPersonsB = lamb.sortWith([nameAsc, surnameDesc])(persons);

        expect(myPersonsA).toEqual(personsByNameAscSurnameDesc);
        expect(myPersonsB).toEqual(personsByNameAscSurnameDesc);
    });

    it("should automatically build a default sorting criterion if supplied only with a reader", function () {
        var stringNumbers = ["2", "1", "10", "5"];
        var stringNumbersAsc = ["1", "2", "5", "10"];

        expect(lamb.sort(stringNumbers, [Number])).toEqual(stringNumbersAsc);
        expect(lamb.sortWith([Number])(stringNumbers)).toEqual(stringNumbersAsc);
        expect(lamb.sort(mixed, [Number])).toEqual(mixedAsNumbersAsc);
        expect(lamb.sortWith([Number])(mixed)).toEqual(mixedAsNumbersAsc);
    });

    it("should treat values as strings if different types are received by the default comparer", function () {
        var numbersAndStrings = [200, NaN, "0", -0, "10", "1", 1, "20", "15", -100, 2];
        var resultA = [-100, "0", -0, "1", 1, "10", "15", 2, "20", 200, NaN];
        var resultB = resultA.slice().reverse();

        expect(lamb.sort(numbersAndStrings)).toEqual(resultA);
        expect(lamb.sortWith()(numbersAndStrings)).toEqual(resultA);
        expect(lamb.sort(numbersAndStrings, [descSorter])).toEqual(resultB);
        expect(lamb.sortWith([descSorter])(numbersAndStrings)).toEqual(resultB);
    });

    it("should be able to use custom comparers", function () {
        var localeSorter = new Intl.Collator("it");
        var localeSorterDesc = lamb.sorterDesc(lamb.identity, localeSorter.compare);
        var chars = ["a", "è", "à", "é", "c", "b", "e"];
        var charsAsc = ["a", "à", "b", "c", "e", "é", "è"];
        var charsDesc = charsAsc.concat().reverse();

        expect(lamb.sort(chars, [localeSorter])).toEqual(charsAsc);
        expect(lamb.sortWith([localeSorter])(chars)).toEqual(charsAsc);
        expect(lamb.sort(chars, [localeSorterDesc])).toEqual(charsDesc);
        expect(lamb.sortWith([localeSorterDesc])(chars)).toEqual(charsDesc);
    });

    it("should use a default ascending sorter if no sorters are supplied", function () {
        var sortedNumbersA = lamb.sort(numbers);
        var sortedNumbersB = lamb.sortWith()(numbers);
        var numbersResult = [-0, 0, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        var stringResult = ["a", "b", "c", "d"];

        expect(sortedNumbersA).toEqual(numbersResult);
        expect(sortedNumbersB).toEqual(numbersResult);
        expect(lamb.sort("cadb")).toEqual(stringResult);
        expect(lamb.sortWith()("cadb")).toEqual(stringResult);
    });

    it("should use a default ascending sorter if the sorters parameter isn't an array or is an empty array", function () {
        var numbersResult = [-0, 0, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        var stringResult = ["a", "b", "c", "d"];

        expect(lamb.sort(numbers, [])).toEqual(numbersResult);
        expect(lamb.sortWith([])(numbers)).toEqual(numbersResult);
        expect(lamb.sort("cadb", [])).toEqual(stringResult);
        expect(lamb.sortWith([])("cadb")).toEqual(stringResult);

        nonFunctions.forEach(function (value) {
            expect(lamb.sort(numbers, value)).toEqual(numbersResult);
            expect(lamb.sortWith(value)(numbers)).toEqual(numbersResult);
            expect(lamb.sort("cadb", value)).toEqual(stringResult);
            expect(lamb.sortWith(value)("cadb")).toEqual(stringResult);
        });
    });

    it("should treat non-function values received as sorters as ascending sorters", function () {
        var numbersResult = [-0, 0, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        var numbersResult2 = [7, 6, 5, 4, 4, 4, 3, 2, 1, -0, 0]; // a descending sort with zeroes swapped

        nonFunctions.forEach(function (value) {
            expect(lamb.sort(numbers, [value])).toEqual(numbersResult);
            expect(lamb.sort(numbers, [descSorter, value])).toEqual(numbersResult2);
            expect(lamb.sortWith([value])(numbers)).toEqual(numbersResult);
            expect(lamb.sortWith([descSorter, value])(numbers)).toEqual(numbersResult2);
        });
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", function () {
        var arr = ["b", , "c", void 0, "a"]; // eslint-disable-line no-sparse-arrays
        var result = ["a", "b", "c", void 0, void 0];

        expect(lamb.sort(arr, [String])).toStrictArrayEqual(result);
        expect(lamb.sortWith([String])(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", function () {
        expect(function () { lamb.sort(null); }).toThrow();
        expect(function () { lamb.sort(void 0); }).toThrow();
        expect(function () { lamb.sortWith()(null); }).toThrow();
        expect(function () { lamb.sortWith()(void 0); }).toThrow();
    });

    it("should throw an exception if called without arguments", function () {
        expect(lamb.sort).toThrow();
        expect(lamb.sortWith()).toThrow();
    });

    it("should treat every other value as an empty array", function () {
        wannabeEmptyArrays.forEach(function (value) {
            expect(lamb.sort(value)).toEqual([]);
            expect(lamb.sortWith()(value)).toEqual([]);
        });
    });
});
