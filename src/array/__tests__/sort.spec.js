import getKey from "../../object/getKey";
import identity from "../../core/identity";
import sort from "../sort";
import sorter from "../sorter";
import sorterDesc from "../sorterDesc";
import sortWith from "../sortWith";
import { nonFunctions, wannabeEmptyArrays } from "../../__tests__/commons";
import "../../__tests__/custom_matchers";

describe("sort / sortWith", () => {
    const descSorter = sorterDesc();

    const persons = [
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" },
        { name: "John", surname: "Moe" },
        { name: "Jane", surname: "Foe" }
    ];

    const personsByNameAsc = [
        { name: "Jane", surname: "Foe" },
        { name: "John", surname: "Doe" },
        { name: "John", surname: "Moe" },
        { name: "Mario", surname: "Rossi" }
    ];

    // eslint-disable-next-line id-length
    const personsByNameAscSurnameDesc = [
        { name: "Jane", surname: "Foe" },
        { name: "John", surname: "Moe" },
        { name: "John", surname: "Doe" },
        { name: "Mario", surname: "Rossi" }
    ];

    const personsByNameReversed = personsByNameAsc.slice().reverse();

    const numbers = [6, -0, 4, 5, 7, 4, 3, 4, 0, 1, 2];

    const mixed = ["1", NaN, null, "10", null, {}, 1, void 0, NaN, false, [], "20", "15", -100];
    const mixedAsNumbersAsc = [-100, null, null, false, [], "1", 1, "10", "15", "20", NaN, {}, void 0, NaN];
    const mixedAsNumbersDesc = mixedAsNumbersAsc.slice().reverse();

    const nameAsc = sorter(getKey("name"));
    const nameDesc = sorterDesc(getKey("name"));
    const surnameDesc = sorterDesc(getKey("surname"));

    it("should build a sorted copy of the provided array-like object", () => {
        const sortedNumbersA = sort(numbers, [descSorter]);
        const sortedNumbersB = sortWith([descSorter])(numbers);
        const numbersResult = [7, 6, 5, 4, 4, 4, 3, 2, 1, 0, -0];

        expect(sortedNumbersA).toStrictEqual(numbersResult);
        expect(sortedNumbersA).not.toBe(numbers);
        expect(sortedNumbersB).toStrictEqual(numbersResult);
        expect(sortedNumbersB).not.toBe(numbers);
    });

    it("should perform a stable ascending sort", () => {
        const myPersonsA = sort(persons, [nameAsc]);
        const myPersonsB = sortWith([nameAsc])(persons);

        expect(myPersonsA).toStrictEqual(personsByNameAsc);
        expect(myPersonsB).toStrictEqual(personsByNameAsc);
    });

    it("should perform descending sort as the reverse of an ascending one", () => {
        const myPersonsA = sort(persons, [nameDesc]);
        const myPersonsB = sortWith([nameDesc])(persons);
        const mixedDescA = sort(mixed, [sorterDesc(Number)]);
        const mixedDescB = sortWith([sorterDesc(Number)])(mixed);

        expect(myPersonsA).toStrictEqual(personsByNameReversed);
        expect(myPersonsB).toStrictEqual(personsByNameReversed);
        expect(mixedDescA).toStrictEqual(mixedAsNumbersDesc);
        expect(mixedDescB).toStrictEqual(mixedAsNumbersDesc);
    });

    it("should be able to perform multi sorting with the specified criteria", () => {
        const myPersonsA = sort(persons, [nameAsc, surnameDesc]);
        const myPersonsB = sortWith([nameAsc, surnameDesc])(persons);

        expect(myPersonsA).toStrictEqual(personsByNameAscSurnameDesc);
        expect(myPersonsB).toStrictEqual(personsByNameAscSurnameDesc);
    });

    it("should automatically build a default sorting criterion if supplied only with a reader", () => {
        const stringNumbers = ["2", "1", "10", "5"];
        const stringNumbersAsc = ["1", "2", "5", "10"];

        expect(sort(stringNumbers, [Number])).toStrictEqual(stringNumbersAsc);
        expect(sortWith([Number])(stringNumbers)).toStrictEqual(stringNumbersAsc);
        expect(sort(mixed, [Number])).toStrictEqual(mixedAsNumbersAsc);
        expect(sortWith([Number])(mixed)).toStrictEqual(mixedAsNumbersAsc);
    });

    it("should treat values as strings if different types are received by the default comparer", () => {
        const numbersAndStrings = [200, NaN, "0", -0, "10", "1", 1, "20", "15", -100, 2];
        const resultA = [-100, "0", -0, "1", 1, "10", "15", 2, "20", 200, NaN];
        const resultB = resultA.slice().reverse();

        expect(sort(numbersAndStrings)).toStrictEqual(resultA);
        expect(sortWith()(numbersAndStrings)).toStrictEqual(resultA);
        expect(sort(numbersAndStrings, [descSorter])).toStrictEqual(resultB);
        expect(sortWith([descSorter])(numbersAndStrings)).toStrictEqual(resultB);
    });

    it("should be able to use custom comparers", () => {
        const localeSorter = new Intl.Collator("it");
        const localeSorterDesc = sorterDesc(identity, localeSorter.compare);
        const chars = ["a", "è", "à", "é", "c", "b", "e"];
        const charsAsc = ["a", "à", "b", "c", "e", "é", "è"];
        const charsDesc = charsAsc.concat().reverse();

        expect(sort(chars, [localeSorter])).toStrictEqual(charsAsc);
        expect(sortWith([localeSorter])(chars)).toStrictEqual(charsAsc);
        expect(sort(chars, [localeSorterDesc])).toStrictEqual(charsDesc);
        expect(sortWith([localeSorterDesc])(chars)).toStrictEqual(charsDesc);
    });

    it("should use a default ascending sorter if no sorters are supplied", () => {
        const sortedNumbersA = sort(numbers);
        const sortedNumbersB = sortWith()(numbers);
        const numbersResult = [-0, 0, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        const stringResult = ["a", "b", "c", "d"];

        expect(sortedNumbersA).toStrictEqual(numbersResult);
        expect(sortedNumbersB).toStrictEqual(numbersResult);
        expect(sort("cadb")).toStrictEqual(stringResult);
        expect(sortWith()("cadb")).toStrictEqual(stringResult);
    });

    it("should use a default ascending sorter if the sorters parameter isn't an array or is an empty array", () => {
        const numbersResult = [-0, 0, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        const stringResult = ["a", "b", "c", "d"];

        expect(sort(numbers, [])).toStrictEqual(numbersResult);
        expect(sortWith([])(numbers)).toStrictEqual(numbersResult);
        expect(sort("cadb", [])).toStrictEqual(stringResult);
        expect(sortWith([])("cadb")).toStrictEqual(stringResult);

        nonFunctions.forEach(value => {
            expect(sort(numbers, value)).toStrictEqual(numbersResult);
            expect(sortWith(value)(numbers)).toStrictEqual(numbersResult);
            expect(sort("cadb", value)).toStrictEqual(stringResult);
            expect(sortWith(value)("cadb")).toStrictEqual(stringResult);
        });
    });

    it("should treat non-function values received as sorters as ascending sorters", () => {
        const numbersResult = [-0, 0, 1, 2, 3, 4, 4, 4, 5, 6, 7];
        const numbersResult2 = [7, 6, 5, 4, 4, 4, 3, 2, 1, -0, 0]; // a descending sort with zeroes swapped

        nonFunctions.forEach(value => {
            expect(sort(numbers, [value])).toStrictEqual(numbersResult);
            expect(sort(numbers, [descSorter, value])).toStrictEqual(numbersResult2);
            expect(sortWith([value])(numbers)).toStrictEqual(numbersResult);
            expect(sortWith([descSorter, value])(numbers)).toStrictEqual(numbersResult2);
        });
    });

    it("should consider deleted or unassigned indexes in sparse arrays as `undefined` values", () => {
        const arr = ["b", , "c", void 0, "a"]; // eslint-disable-line no-sparse-arrays
        const result = ["a", "b", "c", void 0, void 0];

        expect(sort(arr, [String])).toStrictArrayEqual(result);
        expect(sortWith([String])(arr)).toStrictArrayEqual(result);
    });

    it("should throw an exception if supplied with `null` or `undefined` instead of an array-like", () => {
        expect(() => { sort(null); }).toThrow();
        expect(() => { sort(void 0); }).toThrow();
        expect(() => { sortWith()(null); }).toThrow();
        expect(() => { sortWith()(void 0); }).toThrow();
    });

    it("should throw an exception if called without arguments", () => {
        expect(sort).toThrow();
        expect(sortWith()).toThrow();
    });

    it("should treat every other value as an empty array", () => {
        wannabeEmptyArrays.forEach(value => {
            expect(sort(value)).toStrictEqual([]);
            expect(sortWith()(value)).toStrictEqual([]);
        });
    });
});
