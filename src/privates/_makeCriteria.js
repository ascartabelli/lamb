import map from "../core/map";
import _makeCriterion from "./_makeCriterion";
import _sorter from "./_sorter";

/**
 * Builds a list of sorting criteria from a list of sorter functions. Returns a list containing
 * a single default sorting criterion if the sorter list is empty.
 * @private
 * @param {Function[]} sorters
 * @returns {Sorter[]}
 */
function _makeCriteria (sorters) {
    return sorters && sorters.length ? map(sorters, _makeCriterion) : [_sorter()];
}

export default _makeCriteria;
