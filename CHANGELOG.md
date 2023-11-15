- **v0.61.1 - *2023/11/15***
  - **Fully compatible with versions down to 0.59.0**
  - Fixed `reduceWith` and `reduceRightWith` not using the initial value when `reduce` was called with more than three arguments

- **v0.61.0 - *2022/11/09***
  - **Fully compatible with versions down to 0.59.0**
  - Added `symmetricDifference`
  - Big performance improvements to the following functions in ES6 aware environments: `difference`, `intersection`, `symmetricDifference`, `union`, `unionBy`, `uniques` and `uniquesBy`
  - Gave a new coat of paint to all tests
  - Updated doc comments and streamlined some parameter names
  - Dropped TravisCI for Github actions

- **v0.60.0 - *2021/03/08***
  - **Fully compatible with versions down to 0.59.0**
  - Added `mean`, `median` and `replace`

- **v0.59.2 - *2020/07/17***
  - **Fully compatible with version 0.59.0**
  - Updated "exports" property in `package.json` to address the issue where some tools couldn't access the manifest file. See https://github.com/nodejs/node/issues/33460.
  - Got rid of ES5 in all examples

- **v0.59.0 - *2020/07/07***
  - Sorry for all the renaming, but I'm in the process of freezing the API and wanted to tackle some inconsistencies in naming choices.
  - Updated to support Node.js ES modules (and renamed ES modules build to `lamb.mjs`)
  - Added `split` and `splitBy`
  - **API change**: renamed `pick` to `pickIn` and `pickKeys` to `pick`
  - **API change**: renamed `skip` to `skipIn` and `skipKeys` to `skip`
  - **API change**: renamed `rename` to `renameIn` and `renameKeys` to `rename`
  - **API change**: renamed `pluck` to `pluckFrom` and `pluckKey` to `pluck`
  - **API change**: renamed `case` to `casus` to avoid confusion and clashing with the switch statement's case
  - **API change**: renamed `invoker` and `invokerOn` to `invoke` and `invokeOn`
  - Fixed `.DS_STORE` file leaking again in the `dist` folder

- **v0.58.0 - *2019/06/18***
  - Added one file ES modules build
  - **API change**: `invoker` now accepts an array of bound arguments
  - **API change**: benched `immutable` for the moment being
  - Added `join` and `joinWith`
  - Added `findLast`, `findLastWhere`, `findLastIndex`, `findLastIndexWhere`
  - Added `dropLastWhile` and `takeLastWhile`
  - Switched from uglify-js to terser
  - Updated docs, linting and tests

- **v0.57.0 - *2019/02/12***
  - Splitted the library into ES modules
  - **API change**: `sort`, `sortWith` and `sortedInsert` now accept an array of sorters
  - **API change**: removed `@@lamb/placeholder` property as now the placeholder is exported as `__`
  - Switched to Jest as a test suite

- **v0.56.0 - *2018/07/15***
  - **API change**: `compose`, `intersection`, `merge`, `mergeOwn`, `union` and `zip` are now binary functions, and so are functions built with `unionBy`.
  - **API change**: `adapter`, `allOf`, `anyOf`, `collect` and `pipe` now accept an array of functions
  - Updated doc comments and tests

- **v0.55.0 - *2018/03/21***
  - **Fully compatible with versions down to 0.53.x**
  - Added `rotate` and `rotateBy`
  - Updated link to jsDelivr
  - Fixed and updated doc comments and tests

- **v0.54.1 - *2018/03/09***
  - **Fixed**: `setPath` and `updatePath` weren't returning unary functions, and further arguments would have overwritten the previous ones
  - Updated doc comments
  - Updated linting rules

- **v0.54.0 - *2017/08/01***
  - Added `mapValues` and `mapValuesWith`
  - Added "@since" tags to doc comments
  - Added linting for tests

- **v0.53.1 - *2017/04/06***
  - **Fixed**: `hasKeyValue` was returning `true` for any existent property when searching for an `undefined` value
  - Updated object checking tests

- **v0.53.0 - *2017/03/30***
  - **API change**: unfilled placeholders in functions built with `asPartial` now assume an `undefined` value
  - **API change**: `range` now converts to number its parameters and will return an empty array if the specified range is invalid
  - **API change**: `difference` is now a binary function and returns a result without duplicates
  - Changed the name of the property holding the library's version
  - Added the possibility to use custom placeholders in partial application

- **v0.52.0 - *2017/03/17***
  - **API change**: `partial` is no longer variadic and accepts a function and an array of arguments instead
  - **API change**: `getArgAt` and all array accessors now convert their index parameter to integer
  - **API change**: reverted change made in v0.50.0 about `compose` and `pipe`: now they return again the `identity` function if called without arguments
  - **API change**: `merge` and `mergeOwn` now throw for `nil` values and convert to object everything else as before
  - **API change**: `intersection` now return an empty array if called without parameters
  - **Fixed**: `transpose` and `zip` now correctly throw when `nil` values, preceded by empty array-likes, are encountered
  - Added `partialRight`
  - `difference` and `intersection` are now correctly documented to work with array-like objects
  - Updated test and moved shared variables to an external file

- **v0.51.0 - *2017/02/20***
  - **API change**: removed the `iteratee` parameter from `uniques`
  - **API change**: removed `fromIndex` parameter from `contains` and `isIn`
  - **API change**: `tapArgs` isn't variadic anymore and accepts an array of "tappers" as the second parameter
  - **API change**: renamed `drop` and `take` to `dropFrom` and `takeFrom`
  - **API change**: renamed `dropN` and `takeN` to `drop` and `take`
  - **API change**: the `falseFn` parameter of `condition` is no longer optional
  - Added `case` to quickly build cases for `adapter`
  - Added `unionBy` and `uniquesBy`

- **v0.50.0 - *2017/02/08***
  - **API change**: renamed `is` to `areSame` and `isSVZ` to `areSVZ`. The old names are now used for curried version of those functions
  - **API change**: removed `isNot`
  - **API change**: renamed `isGT`, `isGTE`, `isLT` and `isLTE` to `gt`, `gte`, `lt`, `lte`. The old names are now used for right curried versions of these functions.
  - **API change**: `compose` and `pipe` now build a function throwing an exception if they are called without arguments
  - **API change**: renamed `add` to `sum`. `add` is now used as a curried version of `sum`.
  - Added `deduct` as a right curried version of `subtract`
  - Added `multiplyBy` as a curried version of `multiply`
  - Added `divideBy` as a right curried version of `divide`
  - Added optimized currying for functions with arity 2 and 3
  - Performance improvement for `compose` and `pipe`

- **v0.49.0 - *2017/01/24***
  - **API change**: removed optional context parameter in every function that was using it
  - **API change**: `aritize` now will simply convert its `arity` parameter to integer, instead of giving it a special meaning when is `undefined`
  - **Fixed**: `skip` and `skipKeys` now convert to string every value in the `blacklist`
  - **Fixed**: `hasKeyValue` now correctly returns `false` when searching for an `undefined` value in a non-existent property
  - **Fixed**: `pathExists`, `pathExistsIn` and `hasPathValue` will no longer see valid paths when a negative array index is out of bounds
  - Minor performance improvements for `pick`, `pickIf`, `skip` and `skipIf`
  - Added tests with sparse arrays where needed and updated existing ones with misleading texts / specs
  - Tidied up test code a bit by grouping some common variables
  - Updated tests for `hasPathValue` and "pick" and "skip" functions
  - Updated tests of `updatePath` to check negative array indexes that are out of bounds

- **v0.48.0 - *2017/01/10***
  - **API change**: `slice` isn't a generic anymore to ensure that dense arrays are returned and has no optional parameters
  - **Fixed**: `pull` and `pullFrom` now consider `nil`s received as the `values` parameter as empty arrays
  - Added `sliceAt`
  - All array functions always return dense arrays now
  - Updated tests

- **v0.47.0 - *2016/12/16***
  - **API change**: renamed `apply` to `application`
  - **API change**: renamed `applyArgs` to `applyTo`
  - **API change**: `clamp` now converts to number its arguments and returns `NaN` if `min` is greater than `max`
  - **API change**: removed `wrap`
  - Re-added `apply` as a left-curried version of `application`
  - Added `clampWithin` and `isInstanceOf`
  - Updated tests and doc comments

- **v0.46.0 - *2016/12/07***
  - **Fully compatible with versions down to 0.44.x**
  - Added `isFinite`, `isInteger`, `isSafeInteger`
  - Code clean-up and minor performance improvements in sorting functions
  - First step in improving the documentation site

- **v0.45.0 - *2016/11/14***
  - **Fully compatible with versions down to 0.44.x**
  - Added `pull` and `pullFrom`
  - Added `keySatisfies` and `pathSatisfies`
  - Updated examples and doc comments

- **v0.44.0 - *2016/11/08***
  - **API change**: `repeat` and `testWith` now throw an exception when the source string is `nil` and convert to string every other value
  - **API change**: `repeat` now floors the value received as the `times` parameter instead of ceiling it
  - **API change**: the `char` parameter of the padding functions isn't optional anymore and will be coerced to string
  - **Fixed**: predicates built with `testWith` are now safe to reuse even when the global flag is used in the pattern
  - Added `append` and `appendTo`
  - Updated tests of all string functions

- **v0.43.0 - *2016/11/03***
  - **Fully compatible with versions down to 0.40.x**
  - Added `pathExists` and `pathExistsIn`
  - Improved performance of `setIn`, `setKey`, `updateIn` and `updateKey`
  - Improved performance of `setPath`, `setPathIn`, `updatePath` and `updatePathIn`

- **v0.42.0 - *2016/10/25***
  - **Fully compatible with versions down to 0.40.x**
  - Added `unless` and `when`
  - Improved performance of `condition`

- **v0.41.0 - *2016/09/08***
  - **Fully compatible with versions down to 0.40.x**
  - Added `findWhere`, `findIndexWhere`, `hasPathValue`
  - `find` now uses `findIndex` to perform the search to avoid duplicate code
  - Minor performance gain when `aritize` needs to add `undefined` arguments

- **v0.40.0 - *2016/09/02***
  - **API change**: `hasKeyValue` now uses the “SameValueZero" comparison
  - **Fixed**: `updatePath` and `updatePathIn` treated unassigned positive indexes in sparse arrays as non existent properties
  - Updated tests for `hasKeyValue`
  - Updated tests for “pick” and “skip” functions
  - Updated tests for “pairs”, “tear” and “values” functions
  - Updated tests of array accessors
  - Updated tests of object and path accessors
  - Improved performance of `hasKeyValue`

- **v0.39.0 - *2016/08/26***
  - **Fully compatible with versions down to 0.37.x**
  - Added `every`, `everyIn`, `some`, `someIn`
  - Updated tests for functions using predicates
  - Made `intersection` use `everyIn` instead of the native method
  - Updated doc comments, examples and tests for `uniques`
  - Minor performance improvement of `uniques`

- **v0.38.0 - *2016/08/19***
  - **Fully compatible with versions down to 0.37.x**
  - Improved performance of `flatMap`, `flatMapWith`, `flatten` and `shallowFlatten`
  - Greatly improved performance of all grouping functions
  - Greatly improved performance of `transpose`, improved performance of `zip` as a consequence
  - Greatly improved performance of `getArgAt`

- **v0.37.0 - *2016/08/10***
  - **API change**: `sortedInsert` now returns an array copy of the given array-like if there is no element to insert, though still accepts `undefined` values if they are passed explicitly
  - Greatly improved performance of all curry (and curried) functions
  - Optimized `invoker` and `invokerOn`
  - Minor performance improvements in the usage of the arguments object

- **v0.36.0 - *2016/08/04***
  - **Fully compatible with versions down to 0.34.x**
  - Added `asPartial`

- **v0.35.0 - *2016/07/29***
  - **Fully compatible with versions down to 0.34.x**
  - Added `collect`, `pickKeys` and `skipKeys`
  - Updated the examples of `anyOf` and `clamp`

- **v0.34.0 - *2016/07/19***
  - **API change**: `filter`, `forEach`, `map`, `reduce` and `reduceRight` aren’t array generics anymore and have been replaced with performant custom implementations as JS engines didn’t get any better. Unlike native methods, these custom implementations won’t skip unassigned or deleted indexes in arrays.
  - Overall performance improvements (other than the ones caused by the aforementioned custom implementations) and some code clean-up

- **v0.33.0 - *2016/07/08***
  - **API change**: `sortedInsert` now accepts array-like objects
  - Completed "fifth round" of test updating

- **v0.32.0 - *2016/07/01***
  - **API change**: `take` and `takeN` now convert `undefined` values passed as `n` to Number (zero) before calling `slice`
  - **API change**: `tapArgs`, `updateAt` and `updateIndex` are now more strict about their function parameter as “falsy” values failed to throw an exception before
  - **API change**: curry functions now let empty calls consume the arity
  - Completed “fourth round" of test updating

- **v0.31.0 - *2016/06/24***
  - **API change**: all path functions and object setters now throw a TypeError `nil` values received as `source`, other values will be converted to Object
  - **API change**: `setPath`, `setPathIn` now convert to string the `path` parameter
  - **API change**: the “set” and “update” path functions now give priority to existing object keys over array indexes, like the “get” path functions
  - Completed “third round" of test updating

- **v0.30.0 - *2016/06/21***
  - **API change**: `aritize` now adds `undefined` arguments if the desired arity is greater than the amount of received parameters
  - **API change**: `apply` and `applyArgs` now treat non-array-like values for the `args` parameter as empty arrays
  - **API change**: `allOf`, `anyOf`, `apply`, `applyArgs`, `aritize`, `binary` and `unary` now keep the functions' context
  - Completed “second round" of test updating

- **v0.29.0 - *2016/06/16***
  - **API change**: `pick`, `pickIf`, `skip` and `skipIf` now throw exceptions only for `nil` values in the data argument, other values will be converted to Object
  - **API change**: `pick` now throws exceptions only for `nil` values in the `whitelist` parameter, other values will be treated as empty arrays
  - **API change**: `skip` now throws exceptions only for `nil` values in the `blacklist` parameter, other values will be treated as empty arrays
  - **API change**: `not` now correctly keeps the predicate’s context

- **v0.28.0 - *2016/06/03***
  - **API change**: `difference` now accepts array-like objects
  - **API change**: String padding functions now convert to string `non-nil` sources before using them
  - **API change**: String padding functions won’t throw errors for `nil` values passed as padding chars and use the default value instead
  - **API change**: `flatten` and `shallowFlatten` now throw an exception only for `nil` values, converts array-likes to arrays and treat every other value as an empty array
  - **API change**: `difference` now throws an exception only for `nil` values passed as the main parameter; other unexpected values will be treated as empty arrays
  - **API change**: `difference` parameters but than the main one will be treated as an empty array if they aren’t array-like
  - **API change**: `fromPairs` now throw exceptions only for `nil` values, other unexpected values will be treated as empty arrays
  - **API change**: `has` and `hasKey` now throw exceptions only for `nil` values, other unexpected values will be converted to Object
  - Completed "first round" of test updating

- **v0.27.0 - *2016/05/23***
  - **API change**: renamed `insert` to `sortedInsert`
  - Added `insert`, `insertAt`, `reduceWith` and `reduceRightWith`

- **v0.26.0 - *2016/05/16***
  - **Fully compatible with versions down to 0.25.x**
  - Added `rename`, `renameKeys` and `renameWith`

- **v0.25.1 - *2016/05/10***
  - **API change**: `enumerables`, `pairs`, `tear` and `values` now throw a TypeError if supplied with `null` or `undefined`
  - **API change**: `ownPairs`, `ownValues` and `tearOwn` now throw a TypeError only if supplied with `null` or `undefined` regardless of the ECMAScript engine you are using
  - Added `keys` as a shim of ES6’s `Object.keys`

- **v0.24.0 - *2016/05/05***
  - **API change**: `setPath` and `setPathIn` now treat non-enumerable properties encountered in a path as non-existent properties
  - Added `updatePath` and `updatePathIn`

- **v0.23.0 - *2016/04/27***
  - **API change**: `getPath` and `getPathIn` now support negative indexes
  - **API change**: The function returned by `getAt` now throw exceptions only if called with `null` or `undefined` and returns `undefined` for any other non-array-like object
  - Added `getIndex`, `setIndex` and `updateIndex`

- **v0.22.0 - *2016/04/19***
  - **Fully compatible with versions down to 0.21.x**
  - Added `updateIn`, `updateKey` and `updateAt`

- **v0.21.0 - *2016/04/13***
  - **API change**: `getPathIn` and `getPath` now return `undefined` for any non existent path, instead of throwing exceptions when an `undefined` value was a part of the path instead of being its target
  - **API change**: renamed `sequence` to `generate` to avoid confusion with other languages, concepts and libraries
  - Added `count`, `countBy`, `index`, `indexBy`

- **v0.20.0 - *2016/04/08***
  - **API change**: The `mergeOwn` function now converts `null` and `undefined` values to empty objects instead of throwing exceptions
  - Added `setPath` and `setPathIn`

- **v0.19.0 - *2016/04/05***
  - **API change**: renamed `getWithPath` to `getPathIn`
  - Added `getPath` and `reverse`

- **v0.18.0 - *2016/04/01***
  - **API change**: renamed `get` to `getIn`
  - Added `setIn` and `setKey`

- **v0.17.0 - *2016/03/29***
  - **Minor API change (shouldn't affect anyone):** changed integer conversions in `isIn`, `transpose` and currying functions
  - **API change**: `getAt` no longer accepts strings as indexes
  - Added `getArgAt` and  `setAt`

- **v0.16.0 - *2016/03/23***
  - **Fully compatible with versions down to 0.15.x**
  - Added `init`, `tail`, `getAt`, `head`, `last`

- **v0.15.3 - *2016/03/21***
  - **Fully compatible with versions down to 0.15.x**
  - Updated `generic` function and removed unused Function.prototype caching
  - Added specific tests for `generic`, `sorter` and `sorterDesc`
  - Minor improvements in documentation

- **v0.15.2 - *2016/03/17***
  - **Fully compatible with versions down to 0.15.x**
  - Added support for Travis CI and Coveralls
  - Updated README and fixed typo in documentation

- **v0.15.1 - *2016/03/08***
  - **Fully compatible with version 0.15.0**
  - Minor performance improvements

- **v0.15.0 - *2016/03/03***
  - **API change:** changed `insert` and `sorter`
  - Added `invokerOn`, `sort`, `sorterDesc` and `sortWith`

- **v0.14.0 - *2015/05/13***
  - **Fully compatible with versions down to 0.13.x**
  - Added `transpose`, `zip`, `zipWithIndex`

- **v0.13.0 - *2015/05/06***
  - **API change:** `difference`, `intersection` and `uniques` now use the "SameValueZero" comparison
  - Added `clamp`, `contains`, `isIn`, `isSVZ`

- **v0.12.0 - *2015/04/22***
  - **Fully compatible with versions down to 0.9.x**
  - Added `enumerables` and `pluckKey`
  - Added `mergeOwn`, `ownPairs`, `ownValues` and `tearOwn`

- **v0.11.0 - *2015/04/17***
  - **Fully compatible with versions down to 0.9.x**
  - The `union` function now can work with array-like objects
  - Added `flatMapWith`, `partition`, `partitionWith`

- **v0.10.0 - *2015/04/15***
  - **Fully compatible with version 0.9.x**
  - Added `merge` function
  - Added `binary` and `unary` as shortcuts for common use cases of `aritize`

- **v0.9.0 - *2015/04/10***
  - **API change:** dropped the boolean parameter in `flatten` and added `shallowFlatten`
  - **API change:** dropped the boolean parameter in `curry` and `curryable`, added `curryRight` and `curryableRight`
  - **API change:** renamed `typeOf` to `type` to avoid confusion with the operator
  - Added the `filterWith` function

- **v0.8.0 - *2015/04/03***
  - **API change:** the `values` function now picks from all enumerable properties, even inherited
  - **API change:** renamed `getFromPath` to `getWithPath`
  - Added `fromPairs`, `immutable`, `make`, `pairs`, `tear`

- **v0.7.0 - *2015/03/25***
  - **Fully compatible with previous 0.x versions**
  - Added the `group` and `groupBy` functions
  - Added the `find` and `findIndex` functions
  - Some long due performance improvements on `curry`, `curryable` and `partial`

- **v0.6.3 - *2015/03/20***
  - The documentation is now online
  - Minor fixes in doc comments

- **v0.6.2 - *2015/03/18***
  - First public release
