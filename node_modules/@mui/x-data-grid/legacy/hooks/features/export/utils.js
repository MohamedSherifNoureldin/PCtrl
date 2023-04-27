import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { gridColumnDefinitionsSelector, gridVisibleColumnDefinitionsSelector } from '../columns';
import { gridFilteredSortedRowIdsSelector } from '../filter';
import { gridPinnedRowsSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';
export var getColumnsToExport = function getColumnsToExport(_ref) {
  var apiRef = _ref.apiRef,
    options = _ref.options;
  var columns = gridColumnDefinitionsSelector(apiRef);
  if (options.fields) {
    return options.fields.map(function (field) {
      return columns.find(function (column) {
        return column.field === field;
      });
    }).filter(function (column) {
      return !!column;
    });
  }
  var validColumns = options.allColumns ? columns : gridVisibleColumnDefinitionsSelector(apiRef);
  return validColumns.filter(function (column) {
    return !column.disableExport;
  });
};
export var defaultGetRowsToExport = function defaultGetRowsToExport(_ref2) {
  var _pinnedRows$top, _pinnedRows$bottom;
  var apiRef = _ref2.apiRef;
  var filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  var rowTree = gridRowTreeSelector(apiRef);
  var selectedRows = apiRef.current.getSelectedRows();
  var bodyRows = filteredSortedRowIds.filter(function (id) {
    return rowTree[id].type !== 'footer';
  });
  var pinnedRows = gridPinnedRowsSelector(apiRef);
  var topPinnedRowsIds = (pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.map(function (row) {
    return row.id;
  })) || [];
  var bottomPinnedRowsIds = (pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.map(function (row) {
    return row.id;
  })) || [];
  bodyRows.unshift.apply(bodyRows, _toConsumableArray(topPinnedRowsIds));
  bodyRows.push.apply(bodyRows, _toConsumableArray(bottomPinnedRowsIds));
  if (selectedRows.size > 0) {
    return bodyRows.filter(function (id) {
      return selectedRows.has(id);
    });
  }
  return bodyRows;
};