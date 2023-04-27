import { createSelector } from '../../../utils/createSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
export var gridRowSelectionStateSelector = function gridRowSelectionStateSelector(state) {
  return state.rowSelection;
};
export var selectedGridRowsCountSelector = createSelector(gridRowSelectionStateSelector, function (selection) {
  return selection.length;
});
export var selectedGridRowsSelector = createSelector(gridRowSelectionStateSelector, gridRowsLookupSelector, function (selectedRows, rowsLookup) {
  return new Map(selectedRows.map(function (id) {
    return [id, rowsLookup[id]];
  }));
});
export var selectedIdsLookupSelector = createSelector(gridRowSelectionStateSelector, function (selection) {
  return selection.reduce(function (lookup, rowId) {
    lookup[rowId] = rowId;
    return lookup;
  }, {});
});