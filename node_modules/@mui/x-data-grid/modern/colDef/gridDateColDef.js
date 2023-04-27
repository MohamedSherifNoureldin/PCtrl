import _extends from "@babel/runtime/helpers/esm/extends";
import { gridDateComparator } from '../hooks/features/sorting/gridSortingUtils';
import { getGridDateOperators } from './gridDateOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { renderEditDateCell } from '../components/cell/GridEditDateCell';
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
export function gridDateFormatter({
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
export function gridDateTimeFormatter({
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
export const GRID_DATE_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'date',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateFormatter,
  filterOperators: getGridDateOperators(),
  renderEditCell: renderEditDateCell,
  getApplyQuickFilterFn: undefined
});
export const GRID_DATETIME_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'dateTime',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: getGridDateOperators(true),
  renderEditCell: renderEditDateCell,
  getApplyQuickFilterFn: undefined
});