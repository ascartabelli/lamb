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

    /**
     * The current module version.
     * @memberof module:lamb
     * @private
     * @type String
     */
    lamb._version = "<%= pkg.version %>";
