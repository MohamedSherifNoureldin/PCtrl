import _extends from "@babel/runtime/helpers/esm/extends";
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { renderEditSingleSelectCell } from '../components/cell/GridEditSingleSelectCell';
import { getGridSingleSelectOperators } from './gridSingleSelectOperators';
import { isSingleSelectColDef } from '../components/panel/filterPanel/filterPanelUtils';
import { isObject } from '../utils/utils';
const isArrayOfObjects = options => {
  return typeof options[0] === 'object';
};
const defaultGetOptionValue = value => {
  return isObject(value) ? value.value : value;
};
const defaultGetOptionLabel = value => {
  return isObject(value) ? value.label : String(value);
};
export const GRID_SINGLE_SELECT_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'singleSelect',
  getOptionLabel: defaultGetOptionLabel,
  getOptionValue: defaultGetOptionValue,
  valueFormatter(params) {
    const {
      id,
      field,
      value,
      api
    } = params;
    const colDef = params.api.getColumn(field);
    if (!isSingleSelectColDef(colDef)) {
      return '';
    }
    let valueOptions;
    if (typeof colDef.valueOptions === 'function') {
      valueOptions = colDef.valueOptions({
        id,
        row: id ? api.getRow(id) : null,
        field
      });
    } else {
      valueOptions = colDef.valueOptions;
    }
    if (value == null) {
      return '';
    }
    if (!valueOptions) {
      return value;
    }
    if (!isArrayOfObjects(valueOptions)) {
      return colDef.getOptionLabel(value);
    }
    const valueOption = valueOptions.find(option => colDef.getOptionValue(option) === value);
    return valueOption ? colDef.getOptionLabel(valueOption) : '';
  },
  renderEditCell: renderEditSingleSelectCell,
  filterOperators: getGridSingleSelectOperators()
});