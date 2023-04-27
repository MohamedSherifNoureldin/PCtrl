export function isSingleSelectColDef(colDef) {
  return colDef?.type === 'singleSelect';
}
export function getValueFromValueOptions(value, valueOptions, getOptionValue) {
  if (valueOptions === undefined) {
    return undefined;
  }
  const result = valueOptions.find(option => {
    const optionValue = getOptionValue(option);
    return String(optionValue) === String(value);
  });
  return getOptionValue(result);
}
export const getLabelFromValueOption = valueOption => {
  const label = typeof valueOption === 'object' ? valueOption.label : valueOption;
  return label != null ? String(label) : '';
};