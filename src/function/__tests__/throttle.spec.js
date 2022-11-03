import throttle from "../throttle";

jest.useFakeTimers();

describe("throttle", () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    it("should return a function that will invoke the passed function at most once in the given timespan", () => {
        throttledFn();
        throttledFn();
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(50);

        throttledFn();
        throttledFn();
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(51);

        throttledFn();
        throttledFn();
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
