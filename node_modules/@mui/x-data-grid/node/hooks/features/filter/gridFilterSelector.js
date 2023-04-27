"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridVisibleRowsLookupSelector = exports.gridQuickFilterValuesSelector = exports.gridFilteredTopLevelRowCountSelector = exports.gridFilteredSortedTopLevelRowEntriesSelector = exports.gridFilteredSortedRowIdsSelector = exports.gridFilteredSortedRowEntriesSelector = exports.gridFilteredRowsLookupSelector = exports.gridFilteredDescendantCountLookupSelector = exports.gridFilterModelSelector = exports.gridFilterActiveItemsSelector = exports.gridFilterActiveItemsLookupSelector = exports.gridExpandedSortedRowIdsSelector = exports.gridExpandedSortedRowEntriesSelector = exports.gridExpandedRowCountSelector = void 0;
var _createSelector = require("../../../utils/createSelector");
var _gridSortingSelector = require("../sorting/gridSortingSelector");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
var _gridRowsSelector = require("../rows/gridRowsSelector");
/**
 * @category Filtering
 */
const gridFilterStateSelector = state => state.filter;

/**
 * Get the current filter model.
 * @category Filtering
 */
const gridFilterModelSelector = (0, _createSelector.createSelector)(gridFilterStateSelector, filterState => filterState.filterModel);

/**
 * Get the current quick filter values.
 * @category Filtering
 */
exports.gridFilterModelSelector = gridFilterModelSelector;
const gridQuickFilterValuesSelector = (0, _createSelector.createSelector)(gridFilterModelSelector, filterModel => filterModel.quickFilterValues);

/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridQuickFilterValuesSelector = gridQuickFilterValuesSelector;
const gridVisibleRowsLookupSelector = (0, _createSelector.createSelector)(gridFilterStateSelector, filterState => filterState.visibleRowsLookup);

/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridVisibleRowsLookupSelector = gridVisibleRowsLookupSelector;
const gridFilteredRowsLookupSelector = (0, _createSelector.createSelector)(gridFilterStateSelector, filterState => filterState.filteredRowsLookup);

/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilteredRowsLookupSelector = gridFilteredRowsLookupSelector;
const gridFilteredDescendantCountLookupSelector = (0, _createSelector.createSelector)(gridFilterStateSelector, filterState => filterState.filteredDescendantCountLookup);

/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
exports.gridFilteredDescendantCountLookupSelector = gridFilteredDescendantCountLookupSelector;
const gridExpandedSortedRowEntriesSelector = (0, _createSelector.createSelector)(gridVisibleRowsLookupSelector, _gridSortingSelector.gridSortedRowEntriesSelector, (visibleRowsLookup, sortedRows) => sortedRows.filter(row => visibleRowsLookup[row.id] !== false));

/**
 * Get the id of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
exports.gridExpandedSortedRowEntriesSelector = gridExpandedSortedRowEntriesSelector;
const gridExpandedSortedRowIdsSelector = (0, _createSelector.createSelector)(gridExpandedSortedRowEntriesSelector, visibleSortedRowEntries => visibleSortedRowEntries.map(row => row.id));

/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
exports.gridExpandedSortedRowIdsSelector = gridExpandedSortedRowIdsSelector;
const gridFilteredSortedRowEntriesSelector = (0, _createSelector.createSelector)(gridFilteredRowsLookupSelector, _gridSortingSelector.gridSortedRowEntriesSelector, (filteredRowsLookup, sortedRows) => sortedRows.filter(row => filteredRowsLookup[row.id] !== false));

/**
 * Get the id of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
exports.gridFilteredSortedRowEntriesSelector = gridFilteredSortedRowEntriesSelector;
const gridFilteredSortedRowIdsSelector = (0, _createSelector.createSelector)(gridFilteredSortedRowEntriesSelector, filteredSortedRowEntries => filteredSortedRowEntries.map(row => row.id));

/**
 * Get the id and the model of the top level rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridFilteredSortedRowIdsSelector = gridFilteredSortedRowIdsSelector;
const gridFilteredSortedTopLevelRowEntriesSelector = (0, _createSelector.createSelector)(gridExpandedSortedRowEntriesSelector, _gridRowsSelector.gridRowTreeSelector, _gridRowsSelector.gridRowMaximumTreeDepthSelector, (visibleSortedRows, rowTree, rowTreeDepth) => {
  if (rowTreeDepth < 2) {
    return visibleSortedRows;
  }
  return visibleSortedRows.filter(row => rowTree[row.id]?.depth === 0);
});

/**
 * Get the amount of rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridFilteredSortedTopLevelRowEntriesSelector = gridFilteredSortedTopLevelRowEntriesSelector;
const gridExpandedRowCountSelector = (0, _createSelector.createSelector)(gridExpandedSortedRowEntriesSelector, visibleSortedRows => visibleSortedRows.length);

/**
 * Get the amount of top level rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridExpandedRowCountSelector = gridExpandedRowCountSelector;
const gridFilteredTopLevelRowCountSelector = (0, _createSelector.createSelector)(gridFilteredSortedTopLevelRowEntriesSelector, visibleSortedTopLevelRows => visibleSortedTopLevelRows.length);

/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilteredTopLevelRowCountSelector = gridFilteredTopLevelRowCountSelector;
const gridFilterActiveItemsSelector = (0, _createSelector.createSelector)(gridFilterModelSelector, _gridColumnsSelector.gridColumnLookupSelector, (filterModel, columnLookup) => filterModel.items?.filter(item => {
  if (!item.field) {
    return false;
  }
  const column = columnLookup[item.field];
  if (!column?.filterOperators || column?.filterOperators?.length === 0) {
    return false;
  }
  const filterOperator = column.filterOperators.find(operator => operator.value === item.operator);
  if (!filterOperator) {
    return false;
  }
  return !filterOperator.InputComponent || item.value != null && item.value?.toString() !== '';
}));
exports.gridFilterActiveItemsSelector = gridFilterActiveItemsSelector;
/**
 * @category Filtering
 * @ignore - do not document.
 */
const gridFilterActiveItemsLookupSelector = (0, _createSelector.createSelector)(gridFilterActiveItemsSelector, activeFilters => {
  const result = activeFilters.reduce((res, filterItem) => {
    if (!res[filterItem.field]) {
      res[filterItem.field] = [filterItem];
    } else {
      res[filterItem.field].push(filterItem);
    }
    return res;
  }, {});
  return result;
});
exports.gridFilterActiveItemsLookupSelector = gridFilterActiveItemsLookupSelector;