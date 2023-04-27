import { createSelector } from '../../../utils/createSelector';
const gridRowsStateSelector = state => state.rows;
export const gridRowCountSelector = createSelector(gridRowsStateSelector, rows => rows.totalRowCount);
export const gridRowsLoadingSelector = createSelector(gridRowsStateSelector, rows => rows.loading);
export const gridTopLevelRowCountSelector = createSelector(gridRowsStateSelector, rows => rows.totalTopLevelRowCount);

// TODO rows v6: Rename
export const gridRowsLookupSelector = createSelector(gridRowsStateSelector, rows => rows.dataRowIdToModelLookup);
export const gridRowsDataRowIdToIdLookupSelector = createSelector(gridRowsStateSelector, rows => rows.dataRowIdToIdLookup);
export const gridRowTreeSelector = createSelector(gridRowsStateSelector, rows => rows.tree);
export const gridRowGroupingNameSelector = createSelector(gridRowsStateSelector, rows => rows.groupingName);
export const gridRowTreeDepthsSelector = createSelector(gridRowsStateSelector, rows => rows.treeDepths);
export const gridRowMaximumTreeDepthSelector = createSelector(gridRowsStateSelector, rows => {
  const entries = Object.entries(rows.treeDepths);
  if (entries.length === 0) {
    return 1;
  }
  return entries.filter(([, nodeCount]) => nodeCount > 0).map(([depth]) => Number(depth)).sort((a, b) => b - a)[0] + 1;
});
export const gridDataRowIdsSelector = createSelector(gridRowsStateSelector, rows => rows.dataRowIds);

/**
 * @ignore - do not document.
 */
export const gridAdditionalRowGroupsSelector = createSelector(gridRowsStateSelector, rows => rows == null ? void 0 : rows.additionalRowGroups);

/**
 * @ignore - do not document.
 */
export const gridPinnedRowsSelector = createSelector(gridAdditionalRowGroupsSelector, additionalRowGroups => {
  var _rawPinnedRows$bottom, _rawPinnedRows$top;
  const rawPinnedRows = additionalRowGroups == null ? void 0 : additionalRowGroups.pinnedRows;
  return {
    bottom: rawPinnedRows == null ? void 0 : (_rawPinnedRows$bottom = rawPinnedRows.bottom) == null ? void 0 : _rawPinnedRows$bottom.map(rowEntry => {
      var _rowEntry$model;
      return {
        id: rowEntry.id,
        model: (_rowEntry$model = rowEntry.model) != null ? _rowEntry$model : {}
      };
    }),
    top: rawPinnedRows == null ? void 0 : (_rawPinnedRows$top = rawPinnedRows.top) == null ? void 0 : _rawPinnedRows$top.map(rowEntry => {
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
export const gridPinnedRowsCountSelector = createSelector(gridPinnedRowsSelector, pinnedRows => {
  var _pinnedRows$top, _pinnedRows$bottom;
  return ((pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.length) || 0) + ((pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.length) || 0);
});