import _typeof from "@babel/runtime/helpers/esm/typeof";
export function isSingleSelectColDef(colDef) {
  return (colDef == null ? void 0 : colDef.type) === 'singleSelect';
}
export function getValueFromValueOptions(value, valueOptions, getOptionValue) {
  if (valueOptions === undefined) {
    return undefined;
  }
  var result = valueOptions.find(function (option) {
    var optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });
  return getOptionValue(result);
}
export var getLabelFromValueOption = function getLabelFromValueOption(valueOption) {
  var label = _typeof(valueOption) === 'object' ? valueOption.label : valueOption;
  return label != null ? String(label) : '';
};