import * as lamb from "../..";

var isEven = function (n) { return n % 2 === 0; };
var isGreaterThanTwo = lamb.isGT(2);
var isLessThanTen = lamb.isLT(10);

// to check "truthy" and "falsy" values returned by predicates
var hasEvens = function (array) { return ~lamb.findIndex(array, isEven); };
var isVowel = function (char) { return ~"aeiouAEIOU".indexOf(char); };

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
Foo.prototype.getIfPositiveOrGetSafe = lamb.condition(
    Foo.prototype.isPositive,
    Foo.prototype.getValue,
    Foo.prototype.getSafeValue
);
Foo.prototype.getIfPositiveOrUndefined = lamb.casus(Foo.prototype.isPositive, Foo.prototype.getValue);

Foo.prototype.getWhenPositiveOrElse = lamb.when(Foo.prototype.isPositive, Foo.prototype.getValue);
Foo.prototype.getUnlessIsPositiveOrElse = lamb.unless(Foo.prototype.isPositive, Foo.prototype.getValue);
Foo.prototype.isOdd = lamb.not(Foo.prototype.isEven);
Foo.prototype.isPositiveEven = lamb.allOf([Foo.prototype.isEven, Foo.prototype.isPositive]);
Foo.prototype.isPositiveOrEven = lamb.anyOf([Foo.prototype.isEven, Foo.prototype.isPositive]);

export {
    Foo,
    hasEvens,
    isEven,
    isGreaterThanTwo,
    isLessThanTen,
    isVowel
};
