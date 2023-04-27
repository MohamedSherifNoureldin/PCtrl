import { createSelector } from '../../../utils/createSelector';
import { gridFilteredTopLevelRowCountSelector, gridExpandedSortedRowEntriesSelector, gridExpandedSortedRowIdsSelector, gridFilteredSortedTopLevelRowEntriesSelector } from '../filter/gridFilterSelector';
import { gridRowMaximumTreeDepthSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';
import { getPageCount } from './gridPaginationUtils';

/**
 * @category Pagination
 * @ignore - do not document.
 */
export var gridPaginationSelector = function gridPaginationSelector(state) {
  return state.pagination;
};

/**
 * Get the pagination model
 * @category Pagination
 */
export var gridPaginationModelSelector = createSelector(gridPaginationSelector, function (pagination) {
  return pagination.paginationModel;
});

/**
 * Get the index of the page to render if the pagination is enabled
 * @category Pagination
 */
export var gridPageSelector = createSelector(gridPaginationModelSelector, function (paginationModel) {
  return paginationModel.page;
});

/**
 * Get the maximum amount of rows to display on a single page if the pagination is enabled
 * @category Pagination
 */
export var gridPageSizeSelector = createSelector(gridPaginationModelSelector, function (paginationModel) {
  return paginationModel.pageSize;
});

/**
 * Get the amount of pages needed to display all the rows if the pagination is enabled
 * @category Pagination
 */
export var gridPageCountSelector = createSelector(gridPaginationModelSelector, gridFilteredTopLevelRowCountSelector, function (paginationModel, visibleTopLevelRowCount) {
  return getPageCount(visibleTopLevelRowCount, paginationModel.pageSize);
});

/**
 * Get the index of the first and the last row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
export var gridPaginationRowRangeSelector = createSelector(gridPaginationModelSelector, gridRowTreeSelector, gridRowMaximumTreeDepthSelector, gridExpandedSortedRowEntriesSelector, gridFilteredSortedTopLevelRowEntriesSelector, function (paginationModel, rowTree, rowTreeDepth, visibleSortedRowEntries, visibleSortedTopLevelRowEntries) {
  var visibleTopLevelRowCount = visibleSortedTopLevelRowEntries.length;
  var topLevelFirstRowIndex = Math.min(paginationModel.pageSize * paginationModel.page, visibleTopLevelRowCount - 1);
  var topLevelLastRowIndex = Math.min(topLevelFirstRowIndex + paginationModel.pageSize - 1, visibleTopLevelRowCount - 1);

  // The range contains no element
  if (topLevelFirstRowIndex === -1 || topLevelLastRowIndex === -1) {
    return null;
  }

  // The tree is flat, there is no need to look for children
  if (rowTreeDepth < 2) {
    return {
      firstRowIndex: topLevelFirstRowIndex,
      lastRowIndex: topLevelLastRowIndex
    };
  }
  var topLevelFirstRow = visibleSortedTopLevelRowEntries[topLevelFirstRowIndex];
  var topLevelRowsInCurrentPageCount = topLevelLastRowIndex - topLevelFirstRowIndex + 1;
  var firstRowIndex = visibleSortedRowEntries.findIndex(function (row) {
    return row.id === topLevelFirstRow.id;
  });
  var lastRowIndex = firstRowIndex;
  var topLevelRowAdded = 0;
  while (lastRowIndex < visibleSortedRowEntries.length && topLevelRowAdded <= topLevelRowsInCurrentPageCount) {
    var row = visibleSortedRowEntries[lastRowIndex];
    var depth = rowTree[row.id].depth;
    if (topLevelRowAdded < topLevelRowsInCurrentPageCount || depth > 0) {
      lastRowIndex += 1;
    }
    if (depth === 0) {
      topLevelRowAdded += 1;
    }
  }
  return {
    firstRowIndex: firstRowIndex,
    lastRowIndex: lastRowIndex - 1
  };
});

/**
 * Get the id and the model of each row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
export var gridPaginatedVisibleSortedGridRowEntriesSelector = createSelector(gridExpandedSortedRowEntriesSelector, gridPaginationRowRangeSelector, function (visibleSortedRowEntries, paginationRange) {
  if (!paginationRange) {
    return [];
  }
  return visibleSortedRowEntries.slice(paginationRange.firstRowIndex, paginationRange.lastRowIndex + 1);
});

/**
 * Get the id of each row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
export var gridPaginatedVisibleSortedGridRowIdsSelector = createSelector(gridExpandedSortedRowIdsSelector, gridPaginationRowRangeSelector, function (visibleSortedRowIds, paginationRange) {
  if (!paginationRange) {
    return [];
  }
  return visibleSortedRowIds.slice(paginationRange.firstRowIndex, paginationRange.lastRowIndex + 1);
});