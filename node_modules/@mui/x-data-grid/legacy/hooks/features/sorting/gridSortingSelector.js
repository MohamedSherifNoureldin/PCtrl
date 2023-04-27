import { createSelector } from '../../../utils/createSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';

/**
 * @category Sorting
 * @ignore - do not document.
 */
var gridSortingStateSelector = function gridSortingStateSelector(state) {
  return state.sorting;
};

/**
 * Get the id of the rows after the sorting process.
 * @category Sorting
 */
export var gridSortedRowIdsSelector = createSelector(gridSortingStateSelector, function (sortingState) {
  return sortingState.sortedRows;
});

/**
 * Get the id and the model of the rows after the sorting process.
 * @category Sorting
 */
export var gridSortedRowEntriesSelector = createSelector(gridSortedRowIdsSelector, gridRowsLookupSelector,
// TODO rows v6: Is this the best approach ?
function (sortedIds, idRowsLookup) {
  return sortedIds.map(function (id) {
    var _idRowsLookup$id;
    return {
      id: id,
      model: (_idRowsLookup$id = idRowsLookup[id]) != null ? _idRowsLookup$id : {}
    };
  });
});

/**
 * Get the current sorting model.
 * @category Sorting
 */
export var gridSortModelSelector = createSelector(gridSortingStateSelector, function (sorting) {
  return sorting.sortModel;
});
/**
 * @category Sorting
 * @ignore - do not document.
 */
export var gridSortColumnLookupSelector = createSelector(gridSortModelSelector, function (sortModel) {
  var result = sortModel.reduce(function (res, sortItem, index) {
    res[sortItem.field] = {
      sortDirection: sortItem.sort,
      sortIndex: sortModel.length > 1 ? index + 1 : undefined
    };
    return res;
  }, {});
  return result;
});