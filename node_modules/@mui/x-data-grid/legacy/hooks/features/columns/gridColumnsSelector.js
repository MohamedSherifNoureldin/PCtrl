import { createSelector } from '../../../utils/createSelector';
/**
 * Get the columns state
 * @category Columns
 */
export var gridColumnsStateSelector = function gridColumnsStateSelector(state) {
  return state.columns;
};

/**
 * Get an array of column fields in the order rendered on screen.
 * @category Columns
 */
export var gridColumnFieldsSelector = createSelector(gridColumnsStateSelector, function (columnsState) {
  return columnsState.orderedFields;
});

/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export var gridColumnLookupSelector = createSelector(gridColumnsStateSelector, function (columnsState) {
  return columnsState.lookup;
});

/**
 * Get an array of column definitions in the order rendered on screen..
 * @category Columns
 */
export var gridColumnDefinitionsSelector = createSelector(gridColumnFieldsSelector, gridColumnLookupSelector, function (allFields, lookup) {
  return allFields.map(function (field) {
    return lookup[field];
  });
});

/**
 * Get the column visibility model, containing the visibility status of each column.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
export var gridColumnVisibilityModelSelector = createSelector(gridColumnsStateSelector, function (columnsState) {
  return columnsState.columnVisibilityModel;
});

/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
export var gridVisibleColumnDefinitionsSelector = createSelector(gridColumnDefinitionsSelector, gridColumnVisibilityModelSelector, function (columns, columnVisibilityModel) {
  return columns.filter(function (column) {
    return columnVisibilityModel[column.field] !== false;
  });
});

/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
export var gridVisibleColumnFieldsSelector = createSelector(gridVisibleColumnDefinitionsSelector, function (visibleColumns) {
  return visibleColumns.map(function (column) {
    return column.field;
  });
});

/**
 * Get the left position in pixel of each visible columns relative to the left of the first column.
 * @category Visible Columns
 */
export var gridColumnPositionsSelector = createSelector(gridVisibleColumnDefinitionsSelector, function (visibleColumns) {
  var positions = [];
  var currentPosition = 0;
  for (var i = 0; i < visibleColumns.length; i += 1) {
    positions.push(currentPosition);
    currentPosition += visibleColumns[i].computedWidth;
  }
  return positions;
});

/**
 * Get the summed width of all the visible columns.
 * @category Visible Columns
 */
export var gridColumnsTotalWidthSelector = createSelector(gridVisibleColumnDefinitionsSelector, gridColumnPositionsSelector, function (visibleColumns, positions) {
  var colCount = visibleColumns.length;
  if (colCount === 0) {
    return 0;
  }
  return positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth;
});

/**
 * Get the filterable columns as an array.
 * @category Columns
 */
export var gridFilterableColumnDefinitionsSelector = createSelector(gridColumnDefinitionsSelector, function (columns) {
  return columns.filter(function (col) {
    return col.filterable;
  });
});

/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
export var gridFilterableColumnLookupSelector = createSelector(gridColumnDefinitionsSelector, function (columns) {
  return columns.reduce(function (acc, col) {
    if (col.filterable) {
      acc[col.field] = col;
    }
    return acc;
  }, {});
});