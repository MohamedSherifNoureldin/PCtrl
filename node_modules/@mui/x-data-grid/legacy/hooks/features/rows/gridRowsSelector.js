import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { createSelector } from '../../../utils/createSelector';
var gridRowsStateSelector = function gridRowsStateSelector(state) {
  return state.rows;
};
export var gridRowCountSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.totalRowCount;
});
export var gridRowsLoadingSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.loading;
});
export var gridTopLevelRowCountSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.totalTopLevelRowCount;
});

// TODO rows v6: Rename
export var gridRowsLookupSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.dataRowIdToModelLookup;
});
export var gridRowsDataRowIdToIdLookupSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.dataRowIdToIdLookup;
});
export var gridRowTreeSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.tree;
});
export var gridRowGroupingNameSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.groupingName;
});
export var gridRowTreeDepthsSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.treeDepths;
});
export var gridRowMaximumTreeDepthSelector = createSelector(gridRowsStateSelector, function (rows) {
  var entries = Object.entries(rows.treeDepths);
  if (entries.length === 0) {
    return 1;
  }
  return entries.filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      nodeCount = _ref2[1];
    return nodeCount > 0;
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
      depth = _ref4[0];
    return Number(depth);
  }).sort(function (a, b) {
    return b - a;
  })[0] + 1;
});
export var gridDataRowIdsSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.dataRowIds;
});

/**
 * @ignore - do not document.
 */
export var gridAdditionalRowGroupsSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows == null ? void 0 : rows.additionalRowGroups;
});

/**
 * @ignore - do not document.
 */
export var gridPinnedRowsSelector = createSelector(gridAdditionalRowGroupsSelector, function (additionalRowGroups) {
  var _rawPinnedRows$bottom, _rawPinnedRows$top;
  var rawPinnedRows = additionalRowGroups == null ? void 0 : additionalRowGroups.pinnedRows;
  return {
    bottom: rawPinnedRows == null ? void 0 : (_rawPinnedRows$bottom = rawPinnedRows.bottom) == null ? void 0 : _rawPinnedRows$bottom.map(function (rowEntry) {
      var _rowEntry$model;
      return {
        id: rowEntry.id,
        model: (_rowEntry$model = rowEntry.model) != null ? _rowEntry$model : {}
      };
    }),
    top: rawPinnedRows == null ? void 0 : (_rawPinnedRows$top = rawPinnedRows.top) == null ? void 0 : _rawPinnedRows$top.map(function (rowEntry) {
      var _rowEntry$model2;
      return {
        id: rowEntry.id,
        model: (_rowEntry$model2 = rowEntry.model) != null ? _rowEntry$model2 : {}
      };
    })
  };
});

/**
 * @ignore - do not document.
 */
export var gridPinnedRowsCountSelector = createSelector(gridPinnedRowsSelector, function (pinnedRows) {
  var _pinnedRows$top, _pinnedRows$bottom;
  return ((pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.length) || 0) + ((pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.length) || 0);
});