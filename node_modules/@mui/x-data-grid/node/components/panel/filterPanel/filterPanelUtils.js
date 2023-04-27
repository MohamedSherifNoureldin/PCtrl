"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabelFromValueOption = void 0;
exports.getValueFromValueOptions = getValueFromValueOptions;
exports.isSingleSelectColDef = isSingleSelectColDef;
function isSingleSelectColDef(colDef) {
  return colDef?.type === 'singleSelect';
}
function getValueFromValueOptions(value, valueOptions, getOptionValue) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find(option => {
    const optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });
  return getOptionValue(result);
}
const getLabelFromValueOption = valueOption => {
  const label = typeof valueOption === 'object' ? valueOption.label : valueOption;
  return label != null ? String(label) : '';
};
exports.getLabelFromValueOption = getLabelFromValueOption;