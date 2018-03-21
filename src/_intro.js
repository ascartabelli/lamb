/**
 * @overview <%= pkg.name %> - <%= pkg.description %>
 * @author <%= pkg.author.name %> <<%= pkg.author.email %>>
 * @version <%= pkg.version %>
 * @module lamb
 * @license <%= pkg.license %>
 * @preserve
 */
(function (host) {
    "use strict";

    var lamb = Object.create(null);
    var _ = {}; // internal placeholder for partial application
    var _placeholder = lamb; // default value for public placeholder

    Object.defineProperties(lamb, {
        /**
         * The object used as a placeholder in partial application. Its default value is
         * the <code>lamb</code> object itself.<br/>
         * The property is public so that you can make Lamb use your own placeholder, however
         * you can't change it at will or the partially applied functions you defined before the
         * change won't recognize the former placeholder.
         * @alias module:lamb.@@lamb/placeholder
         * @category Special properties
         * @see {@link module:lamb.partial|partial}, {@link module:lamb.partialRight|partialRight}
         * @see {@link module:lamb.asPartial|asPartial}
         * @since 0.53.0
         * @type Object
         */
        "@@lamb/placeholder": {
            get: function () {
                return _placeholder;
            },
            set: function (value) {
                _placeholder = value;
            }
        },

        /**
         * The current library version.
         * @alias module:lamb.@@lamb/version
         * @category Special properties
         * @readonly
         * @since 0.53.0
         * @type String
         */
        "@@lamb/version": {value: "<%= pkg.version %>"}
    });

    // prototype shortcuts
    var _objectProto = Object.prototype;
    var _stringProto = String.prototype;

    // constants
    var MAX_ARRAY_LENGTH = 4294967295;
