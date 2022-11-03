import generate from "../generate";

describe("generate", () => {
    it("should generate a sequence of values of the desired length with the provided iteratee", () => {
        const fibonacci = (n, idx, list) => n + (list[idx - 1] || 0);

        expect(generate(1, 20, fibonacci)).toStrictEqual(
            [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]
        );
    });
});
