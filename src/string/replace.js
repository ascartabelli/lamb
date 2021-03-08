import _makePartial3 from "../privates/_makePartial3";
import generic from "../core/generic";

/**
 * Builds a partial application of [<code>String.prototype.replace</code>]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace}
 * with the given needle and substitution.<br/>
 * Please refer to MDN docs for more insights and examples.
 * @example
 * const htmlString = "<p>Lorem <strong class=\"foo bar\">ipsum dolor</strong> sit amet</p>";
 * const stripHTML = _.replace(/<[^>]+>/g, "");
 *
 * stripHTML(htmlString) // => "Lorem ipsum dolor sit amet"
 *
 * @memberof module:lamb
 * @category String
 * @function
 * @see [<code>String.prototype.replace</code>]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace} on MDN.
 * @since 0.60.0
 * @param {RegExp|String} needle
 * @param {Function|String} sub
 * @returns {Function} <code>(haystack: String) => String</code>
 */
var replace = _makePartial3(generic(String.prototype.replace));

export default replace;
