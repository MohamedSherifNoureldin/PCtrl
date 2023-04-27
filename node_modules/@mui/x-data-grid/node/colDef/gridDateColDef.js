"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRID_DATE_COL_DEF = exports.GRID_DATETIME_COL_DEF = void 0;
exports.gridDateFormatter = gridDateFormatter;
exports.gridDateTimeFormatter = gridDateTimeFormatter;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _gridSortingUtils = require("../hooks/features/sorting/gridSortingUtils");
var _gridDateOperators = require("./gridDateOperators");
var _gridStringColDef = require("./gridStringColDef");
var _GridEditDateCell = require("../components/cell/GridEditDateCell");
function throwIfNotDateObject({
  value,
  columnType,
  rowId,
  field
}) {
  if (!(value instanceof Date)) {
    throw new Error([`MUI: \`${columnType}\` column type only accepts \`Date\` objects as values.`, 'Use `valueGetter` to transform the value into a `Date` object.', `Row ID: ${rowId}, field: "${field}".`].join('\n'));
  }
}
function gridDateFormatter({
  value,
  field,
  id
}) {
  if (!value) {
    return '';
  }
  throwIfNotDateObject({
    value,
    columnType: 'date',
    rowId: id,
    field
  });
  return value.toLocaleDateString();
}
function gridDateTimeFormatter({
  value,
  field,
  id
}) {
  if (!value) {
    return '';
  }
  throwIfNotDateObject({
    value,
    columnType: 'dateTime',
    rowId: id,
    field
  });
  return value.toLocaleString();
}
const GRID_DATE_COL_DEF = (0, _extends2.default)({}, _gridStringColDef.GRID_STRING_COL_DEF, {
  type: 'date',
  sortComparator: _gridSortingUtils.gridDateComparator,
  valueFormatter: gridDateFormatter,
  filterOperators: (0, _gridDateOperators.getGridDateOperators)(),
  renderEditCell: _GridEditDateCell.renderEditDateCell,
  getApplyQuickFilterFn: undefined
});
exports.GRID_DATE_COL_DEF = GRID_DATE_COL_DEF;
const GRID_DATETIME_COL_DEF = (0, _extends2.default)({}, _gridStringColDef.GRID_STRING_COL_DEF, {
  type: 'dateTime',
  sortComparator: _gridSortingUtils.gridDateComparator,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: (0, _gridDateOperators.getGridDateOperators)(true),
  renderEditCell: _GridEditDateCell.renderEditDateCell,
  getApplyQuickFilterFn: undefined
});
exports.GRID_DATETIME_COL_DEF = GRID_DATETIME_COL_DEF;