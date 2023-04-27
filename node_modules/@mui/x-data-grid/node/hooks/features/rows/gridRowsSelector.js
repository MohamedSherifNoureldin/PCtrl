"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridTopLevelRowCountSelector = exports.gridRowsLookupSelector = exports.gridRowsLoadingSelector = exports.gridRowsDataRowIdToIdLookupSelector = exports.gridRowTreeSelector = exports.gridRowTreeDepthsSelector = exports.gridRowMaximumTreeDepthSelector = exports.gridRowGroupingNameSelector = exports.gridRowCountSelector = exports.gridPinnedRowsSelector = exports.gridPinnedRowsCountSelector = exports.gridDataRowIdsSelector = exports.gridAdditionalRowGroupsSelector = void 0;
var _createSelector = require("../../../utils/createSelector");
const gridRowsStateSelector = state => state.rows;
const gridRowCountSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.totalRowCount);
exports.gridRowCountSelector = gridRowCountSelector;
const gridRowsLoadingSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.loading);
exports.gridRowsLoadingSelector = gridRowsLoadingSelector;
const gridTopLevelRowCountSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.totalTopLevelRowCount);

// TODO rows v6: Rename
exports.gridTopLevelRowCountSelector = gridTopLevelRowCountSelector;
const gridRowsLookupSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.dataRowIdToModelLookup);
exports.gridRowsLookupSelector = gridRowsLookupSelector;
const gridRowsDataRowIdToIdLookupSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.dataRowIdToIdLookup);
exports.gridRowsDataRowIdToIdLookupSelector = gridRowsDataRowIdToIdLookupSelector;
const gridRowTreeSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.tree);
exports.gridRowTreeSelector = gridRowTreeSelector;
const gridRowGroupingNameSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.groupingName);
exports.gridRowGroupingNameSelector = gridRowGroupingNameSelector;
const gridRowTreeDepthsSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.treeDepths);
exports.gridRowTreeDepthsSelector = gridRowTreeDepthsSelector;
const gridRowMaximumTreeDepthSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => {
  const entries = Object.entries(rows.treeDepths);
  if (entries.length === 0) {
    return 1;
  }
  return entries.filter(([, nodeCount]) => nodeCount > 0).map(([depth]) => Number(depth)).sort((a, b) => b - a)[0] + 1;
});
exports.gridRowMaximumTreeDepthSelector = gridRowMaximumTreeDepthSelector;
const gridDataRowIdsSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.dataRowIds);

/**
 * @ignore - do not document.
 */
exports.gridDataRowIdsSelector = gridDataRowIdsSelector;
const gridAdditionalRowGroupsSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows?.additionalRowGroups);

/**
 * @ignore - do not document.
 */
exports.gridAdditionalRowGroupsSelector = gridAdditionalRowGroupsSelector;
const gridPinnedRowsSelector = (0, _createSelector.createSelector)(gridAdditionalRowGroupsSelector, additionalRowGroups => {
  const rawPinnedRows = additionalRowGroups?.pinnedRows;
  return {
    bottom: rawPinnedRows?.bottom?.map(rowEntry => ({
      id: rowEntry.id,
      model: rowEntry.model ?? {}
    })),
    top: rawPinnedRows?.top?.map(rowEntry => ({
      id: rowEntry.id,
      model: rowEntry.model ?? {}
    }))
  };
});

/**
 * @ignore - do not document.
 */
exports.gridPinnedRowsSelector = gridPinnedRowsSelector;
const gridPinnedRowsCountSelector = (0, _createSelector.createSelector)(gridPinnedRowsSelector, pinnedRows => {
  return (pinnedRows?.top?.length || 0) + (pinnedRows?.bottom?.length || 0);
});
exports.gridPinnedRowsCountSelector = gridPinnedRowsCountSelector;