var lamb = require("../../dist/lamb.js");

describe("lamb.sort", function () {
    var descSorter = lamb.sorterDesc();

    describe("insert", function () {
        var personsByCaseInsensitiveNameAsc = [
            {"name": "jane", "surname": "doe"},
            {"name": "John", "surname": "Doe"},
            {"name": "john", "surname": "doe"},
            {"name": "John", "surname": "Moe"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var toLowerCase = lamb.invoker("toLowerCase");
        var getLowerCaseName = lamb.compose(toLowerCase, lamb.getKey("name"));

        it("should insert an element in a copy of a sorted array respecting the order", function () {
            var expectedResult = [
                {"name": "jane", "surname": "doe"},
                {"name": "John", "surname": "Doe"},
                {"name": "john", "surname": "doe"},
                {"name": "John", "surname": "Moe"},
                {"name": "marco", "surname": "Rossi"},
                {"name": "Mario", "surname": "Rossi"}
            ];

            var result = lamb.insert(
                personsByCaseInsensitiveNameAsc,
                {"name": "marco", "surname": "Rossi"},
                lamb.sorter(getLowerCaseName)
            );

            expect(result).toEqual(expectedResult);
            expect(result).not.toBe(personsByCaseInsensitiveNameAsc);
            expect(personsByCaseInsensitiveNameAsc.length).toBe(5);

            // references are not broken
            expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
        });

        it("should be able to insert an element in a multi-sorted array", function () {
            var expectedResult = [
                {"name": "jane", "surname": "doe"},
                {"name": "John", "surname": "Doe"},
                {"name": "john", "surname": "doe"},
                {"name": "John", "surname": "Foe"},
                {"name": "John", "surname": "Moe"},
                {"name": "Mario", "surname": "Rossi"}
            ];

            var getLowerCaseSurname = lamb.compose(toLowerCase, lamb.getKey("surname"));

            var result = lamb.insert(
                personsByCaseInsensitiveNameAsc,
                {"name": "John", "surname": "Foe"},
                getLowerCaseName,
                getLowerCaseSurname
            );

            expect(result).toEqual(expectedResult);
            expect(result).not.toBe(personsByCaseInsensitiveNameAsc);
            expect(personsByCaseInsensitiveNameAsc.length).toBe(5);

            // references are not broken
            expect(personsByCaseInsensitiveNameAsc[0]).toBe(result[0]);
        });

        it("should allow inserting in a descending sorted array", function () {
            expect(lamb.insert([3, 2, 1], 1.5, descSorter)).toEqual([3, 2, 1.5, 1]);
            expect(lamb.insert([3, 2, 1], 2, descSorter)).toEqual([3, 2, 2, 1]);
        });

        it("should use a default ascending sorter if no sorters are supplied", function () {
            expect(lamb.insert([1, 2, 3], 2.5)).toEqual([1, 2, 2.5, 3]);
        });

        it("should automatically build a default sorting criterion if supplied only with a reader", function () {
            expect(lamb.insert([1, 2, 3], "2.5", Number)).toEqual([1, 2, "2.5", 3]);
        });

        it("should be able to insert values at the beginning and at the end of the array", function () {
            var arr = [1, 2, 3];
            expect(lamb.insert(arr, 0)).toEqual([0, 1, 2, 3]);
            expect(lamb.insert(arr, 4)).toEqual([1, 2, 3, 4]);
        });

        it("should accept an empty list", function () {
            expect(lamb.insert([], 1)).toEqual([1]);
        });
    });

    describe("sort / sortWith", function () {
        var persons = [
            {"name": "John", "surname" :"Doe"},
            {"name": "Mario", "surname": "Rossi"},
            {"name": "John", "surname" :"Moe"},
            {"name": "Jane", "surname": "Foe"}
        ];

        var personsByNameAsc = [
            {"name": "Jane", "surname": "Foe"},
            {"name": "John", "surname" :"Doe"},
            {"name": "John", "surname" :"Moe"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var personsByNameAscSurnameDesc = [
            {"name": "Jane", "surname": "Foe"},
            {"name": "John", "surname" :"Moe"},
            {"name": "John", "surname" :"Doe"},
            {"name": "Mario", "surname": "Rossi"}
        ];

        var personsByNameReversed = personsByNameAsc.slice().reverse();

        var numbers = [6, -0, 4, 5, 7, 4, 3, 4, 0, 1, 2];

        var mixed = ["1", NaN, null, "10", null, {}, 1, void 0, NaN, false, [], "20", "15", -100];
        var mixedAsNumbersAsc = [-100, null, null, false, [], "1", 1, "10", "15", "20", NaN, {}, void 0, NaN];
        var mixedAsNumbersDesc = mixedAsNumbersAsc.slice().reverse();

        var nameAsc = lamb.sorter(lamb.getKey("name"));
        var nameDesc = lamb.sorterDesc(lamb.getKey("name"));
        var surnameDesc = lamb.sorterDesc(lamb.getKey("surname"));

        it("should throw an exception if no array-like object is supplied", function () {
            expect(lamb.sort).toThrow();
            expect(lamb.sortWith()).toThrow();
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

        it("should automatically build a default sorting criterion if supplied only with a reader", function () {
            var stringNumbers = ["2", "1", "10", "5"];
            var stringNumbersAsc = ["1", "2", "5", "10"];
            var mixedAsObject = [NaN, null, null, {}, void 0, NaN, -100, false, [], "1", 1, "10", "15", "20"];

            expect(lamb.sort(stringNumbers, Number)).toEqual(stringNumbersAsc);
            expect(lamb.sortWith(Number)(stringNumbers)).toEqual(stringNumbersAsc);
            expect(lamb.sort(mixed, Number)).toEqual(mixedAsNumbersAsc);
            expect(lamb.sortWith(Number)(mixed)).toEqual(mixedAsNumbersAsc);
            expect(lamb.sort(mixed, Object)).toEqual(mixedAsObject);
            expect(lamb.sortWith(Object)(mixed)).toEqual(mixedAsObject);
        });

        it("should treat values as strings if different types are received by the default comparer", function () {
            expect(lamb.sort(mixed)).toEqual([[], -100, "1", 1, "10", "15", "20", NaN, NaN, false, null, null, {}, void 0]);
        });

        it("should build a sorted copy of the provided array-like object", function () {
            var sortedNumbersA = lamb.sort(numbers, descSorter);
            var sortedNumbersB = lamb.sortWith(descSorter)(numbers);
            var numbersResult = [7, 6, 5, 4, 4, 4, 3, 2, 1, 0, -0];

            expect(sortedNumbersA).toEqual(numbersResult);
            expect(sortedNumbersA).not.toBe(numbers);
            expect(sortedNumbersB).toEqual(numbersResult);
            expect(sortedNumbersB).not.toBe(numbers);
        });

        it("should perform a stable ascending sort", function () {
            var myPersonsA = lamb.sort(persons, nameAsc);
            var myPersonsB = lamb.sortWith(nameAsc)(persons);

            expect(myPersonsA).toEqual(personsByNameAsc);
            expect(myPersonsB).toEqual(personsByNameAsc);
        });

        it("should perform descending sort as the reverse of an ascending one", function () {
            var myPersonsA = lamb.sort(persons, nameDesc);
            var myPersonsB = lamb.sortWith(nameDesc)(persons);
            var mixedDescA = lamb.sort(mixed, lamb.sorterDesc(Number));
            var mixedDescB = lamb.sortWith(lamb.sorterDesc(Number))(mixed);

            expect(myPersonsA).toEqual(personsByNameReversed);
            expect(myPersonsB).toEqual(personsByNameReversed);
            expect(mixedDescA).toEqual(mixedAsNumbersDesc);
            expect(mixedDescB).toEqual(mixedAsNumbersDesc);
        });

        it("should be able to perform multi sorting with the specified criteria", function () {
            var myPersonsA = lamb.sort(persons, nameAsc, surnameDesc);
            var myPersonsB = lamb.sortWith(nameAsc, surnameDesc)(persons);

            expect(myPersonsA).toEqual(personsByNameAscSurnameDesc);
            expect(myPersonsB).toEqual(personsByNameAscSurnameDesc);
        });

        it("should be able to use custom comparers", function () {
            var localeSorter = new Intl.Collator("it");
            var localeSorterDesc = lamb.sorterDesc(lamb.identity, localeSorter.compare);
            var chars = ["a", "è", "à", "é", "c", "b", "e"];
            var charsAsc = ["a", "à", "b", "c", "e", "é", "è"];
            var charsDesc = charsAsc.concat().reverse();

            expect(lamb.sort(chars, localeSorter)).toEqual(charsAsc);
            expect(lamb.sortWith(localeSorter)(chars)).toEqual(charsAsc);
            expect(lamb.sort(chars, localeSorterDesc)).toEqual(charsDesc);
            expect(lamb.sortWith(localeSorterDesc)(chars)).toEqual(charsDesc);
        });
    });

    describe("sorter / sorterDesc", function () {
        var myComparer = jasmine.createSpy().and.returnValue("foo");
        var myReader = jasmine.createSpy().and.callFake(lamb.getKey("a"));
        var foo = {a: 1};
        var bar = {a: 2};

        afterEach(function () {
            myComparer.calls.reset();
            myReader.calls.reset();
        });

        it("should build a sorting criterion", function () {
            var sorterAsc = lamb.sorter();
            var sorterDesc = lamb.sorterDesc();

            expect(sorterAsc.isDescending).toBe(false);
            expect(sorterDesc.isDescending).toBe(true);
            expect(typeof sorterAsc.compare).toBe("function");
            expect(typeof sorterDesc.compare).toBe("function");
            expect(sorterAsc.compare.length).toBe(2);
            expect(sorterDesc.compare.length).toBe(2);
        });

        it("should use a custom comparer if supplied with one", function () {
            expect(lamb.sorter(null, myComparer).compare(foo, bar)).toBe("foo");
        });

        it("should pass values directly to the comparer if there's no reader function or if the reader is the identity function", function () {
            lamb.sorter(lamb.identity, myComparer).compare(foo, bar);
            lamb.sorterDesc(null, myComparer).compare(foo, bar);

            expect(myComparer).toHaveBeenCalledTimes(2);
            expect(myComparer.calls.argsFor(0)[0]).toBe(foo);
            expect(myComparer.calls.argsFor(0)[1]).toBe(bar);
            expect(myComparer.calls.argsFor(1)[0]).toBe(foo);
            expect(myComparer.calls.argsFor(1)[1]).toBe(bar);
        });

        it("should use a custom resader if supplied with one", function () {
            lamb.sorter(myReader, myComparer).compare(foo, bar);

            expect(myReader).toHaveBeenCalledTimes(2);
            expect(myReader.calls.argsFor(0)[0]).toBe(foo);
            expect(myReader.calls.argsFor(1)[0]).toBe(bar);
            expect(myComparer).toHaveBeenCalledTimes(1);
            expect(myComparer).toHaveBeenCalledWith(1, 2);
        });
    });
});
