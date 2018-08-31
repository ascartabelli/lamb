import _argsToArrayFrom from "./_argsToArrayFrom";

/**
 * Builds an array with the received arguments excluding the first one.<br/>
 * To be used with the arguments object, which needs to be passed to the apply
 * method of this function.
 * @private
 * @function
 * @param {...*} value
 * @returns {Array}
 */
var _argsTail = _argsToArrayFrom(1);

export default _argsTail;
