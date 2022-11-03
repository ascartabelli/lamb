import allOf from "../allOf";
import anyOf from "../anyOf";
import casus from "../casus";
import condition from "../condition";
import findIndex from "../../array/findIndex";
import isGT from "../isGT";
import isLT from "../isLT";
import not from "../not";
import unless from "../unless";
import when from "../when";

const isEven = n => n % 2 === 0;
const isGreaterThanTwo = isGT(2);
const isLessThanTen = isLT(10);

// to check "truthy" and "falsy" values returned by predicates
const hasEvens = array => ~findIndex(array, isEven);
const isVowel = char => ~"aeiouAEIOU".indexOf(char);

function Foo (value) {
    this.value = value;
}

Foo.prototype = {
    _safeValue: 99,
    value: 0,
    getSafeValue: function () {
        return this._safeValue;
    },
    getValue: function () {
        return typeof this.value === "number" ? this.value : void 0;
    },
    isEven: function () {
        return this.value % 2 === 0;
    },
    isPositive: function () {
        return this.value > 0;
    }
};
Foo.prototype.getIfPositiveOrGetSafe = condition(
    Foo.prototype.isPositive,
    Foo.prototype.getValue,
    Foo.prototype.getSafeValue
);
Foo.prototype.getIfPositiveOrUndefined = casus(Foo.prototype.isPositive, Foo.prototype.getValue);

Foo.prototype.getWhenPositiveOrElse = when(Foo.prototype.isPositive, Foo.prototype.getValue);
Foo.prototype.getUnlessIsPositiveOrElse = unless(Foo.prototype.isPositive, Foo.prototype.getValue);
Foo.prototype.isOdd = not(Foo.prototype.isEven);
Foo.prototype.isPositiveEven = allOf([Foo.prototype.isEven, Foo.prototype.isPositive]);
Foo.prototype.isPositiveOrEven = anyOf([Foo.prototype.isEven, Foo.prototype.isPositive]);

export {
    Foo,
    hasEvens,
    isEven,
    isGreaterThanTwo,
    isLessThanTen,
    isVowel
};
