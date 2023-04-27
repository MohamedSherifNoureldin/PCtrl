import _extends from "@babel/runtime/helpers/esm/extends";
import { gridDateComparator } from '../hooks/features/sorting/gridSortingUtils';
import { getGridDateOperators } from './gridDateOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { renderEditDateCell } from '../components/cell/GridEditDateCell';
function throwIfNotDateObject(_ref) {
  var value = _ref.value,
    columnType = _ref.columnType,
    rowId = _ref.rowId,
    field = _ref.field;
  if (!(value instanceof Date)) {
    throw new Error(["MUI: `".concat(columnType, "` column type only accepts `Date` objects as values."), 'Use `valueGetter` to transform the value into a `Date` object.', "Row ID: ".concat(rowId, ", field: \"").concat(field, "\".")].join('\n'));
  }
}
export function gridDateFormatter(_ref2) {
  var value = _ref2.value,
    field = _ref2.field,
    id = _ref2.id;
  if (!value) {
    return '';
  }
  throwIfNotDateObject({
    value: value,
    columnType: 'date',
    rowId: id,
    field: field
  });
  return value.toLocaleDateString();
}
export function gridDateTimeFormatter(_ref3) {
  var value = _ref3.value,
    field = _ref3.field,
    id = _ref3.id;
  if (!value) {
    return '';
  }
  throwIfNotDateObject({
    value: value,
    columnType: 'dateTime',
    rowId: id,
    field: field
  });
  return value.toLocaleString();
}
export var GRID_DATE_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'date',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateFormatter,
  filterOperators: getGridDateOperators(),
  renderEditCell: renderEditDateCell,
  getApplyQuickFilterFn: undefined
});
export var GRID_DATETIME_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'dateTime',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: getGridDateOperators(true),
  renderEditCell: renderEditDateCell,
  getApplyQuickFilterFn: undefined
});