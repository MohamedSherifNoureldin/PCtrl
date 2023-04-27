"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridVisibleColumnFieldsSelector = exports.gridVisibleColumnDefinitionsSelector = exports.gridFilterableColumnLookupSelector = exports.gridFilterableColumnDefinitionsSelector = exports.gridColumnsTotalWidthSelector = exports.gridColumnsStateSelector = exports.gridColumnVisibilityModelSelector = exports.gridColumnPositionsSelector = exports.gridColumnLookupSelector = exports.gridColumnFieldsSelector = exports.gridColumnDefinitionsSelector = void 0;
var _createSelector = require("../../../utils/createSelector");
/**
 * Get the columns state
 * @category Columns
 */
const gridColumnsStateSelector = state => state.columns;

/**
 * Get an array of column fields in the order rendered on screen.
 * @category Columns
 */
exports.gridColumnsStateSelector = gridColumnsStateSelector;
const gridColumnFieldsSelector = (0, _createSelector.createSelector)(gridColumnsStateSelector, columnsState => columnsState.orderedFields);

/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
exports.gridColumnFieldsSelector = gridColumnFieldsSelector;
const gridColumnLookupSelector = (0, _createSelector.createSelector)(gridColumnsStateSelector, columnsState => columnsState.lookup);

/**
 * Get an array of column definitions in the order rendered on screen..
 * @category Columns
 */
exports.gridColumnLookupSelector = gridColumnLookupSelector;
const gridColumnDefinitionsSelector = (0, _createSelector.createSelector)(gridColumnFieldsSelector, gridColumnLookupSelector, (allFields, lookup) => allFields.map(field => lookup[field]));

/**
 * Get the column visibility model, containing the visibility status of each column.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
exports.gridColumnDefinitionsSelector = gridColumnDefinitionsSelector;
const gridColumnVisibilityModelSelector = (0, _createSelector.createSelector)(gridColumnsStateSelector, columnsState => columnsState.columnVisibilityModel);

/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
exports.gridColumnVisibilityModelSelector = gridColumnVisibilityModelSelector;
const gridVisibleColumnDefinitionsSelector = (0, _createSelector.createSelector)(gridColumnDefinitionsSelector, gridColumnVisibilityModelSelector, (columns, columnVisibilityModel) => columns.filter(column => columnVisibilityModel[column.field] !== false));

/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
exports.gridVisibleColumnDefinitionsSelector = gridVisibleColumnDefinitionsSelector;
const gridVisibleColumnFieldsSelector = (0, _createSelector.createSelector)(gridVisibleColumnDefinitionsSelector, visibleColumns => visibleColumns.map(column => column.field));

/**
 * Get the left position in pixel of each visible columns relative to the left of the first column.
 * @category Visible Columns
 */
exports.gridVisibleColumnFieldsSelector = gridVisibleColumnFieldsSelector;
const gridColumnPositionsSelector = (0, _createSelector.createSelector)(gridVisibleColumnDefinitionsSelector, visibleColumns => {
  const positions = [];
  let currentPosition = 0;
  for (let i = 0; i < visibleColumns.length; i += 1) {
    positions.push(currentPosition);
    currentPosition += visibleColumns[i].computedWidth;
  }
  return positions;
});

/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
exports.gridColumnPositionsSelector = gridColumnPositionsSelector;
const gridColumnsTotalWidthSelector = (0, _createSelector.createSelector)(gridVisibleColumnDefinitionsSelector, gridColumnPositionsSelector, (visibleColumns, positions) => {
  const colCount = visibleColumns.length;
  if (colCount === 0) {
    return 0;
  }
  return positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth;
});

/**
 * Get the filterable columns as an array.
 * @category Columns
 */
exports.gridColumnsTotalWidthSelector = gridColumnsTotalWidthSelector;
const gridFilterableColumnDefinitionsSelector = (0, _createSelector.createSelector)(gridColumnDefinitionsSelector, columns => columns.filter(col => col.filterable));

/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
exports.gridFilterableColumnDefinitionsSelector = gridFilterableColumnDefinitionsSelector;
const gridFilterableColumnLookupSelector = (0, _createSelector.createSelector)(gridColumnDefinitionsSelector, columns => columns.reduce((acc, col) => {
  if (col.filterable) {
    acc[col.field] = col;
  }
  return acc;
}, {}));
exports.gridFilterableColumnLookupSelector = gridFilterableColumnLookupSelector;