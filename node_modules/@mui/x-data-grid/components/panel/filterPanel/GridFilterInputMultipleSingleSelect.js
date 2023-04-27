import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef", "color", "error", "helperText", "size", "variant", "getOptionLabel", "getOptionValue"];
import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { unstable_useId as useId } from '@mui/utils';
import { isSingleSelectColDef } from './filterPanelUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
const filter = createFilterOptions();
function GridFilterInputMultipleSingleSelect(props) {
  var _resolvedColumn, _resolvedColumn2;
  const {
      item,
      applyValue,
      apiRef,
      focusElementRef,
      color,
      error,
      helperText,
      size,
      variant = 'standard',
      getOptionLabel: getOptionLabelProp,
      getOptionValue: getOptionValueProp
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const TextFieldProps = {
    color,
    error,
    helperText,
    size,
    variant
  };
  const id = useId();
  const rootProps = useGridRootProps();
  let resolvedColumn = null;
  if (item.field) {
    const column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }
  const getOptionValue = getOptionValueProp || ((_resolvedColumn = resolvedColumn) == null ? void 0 : _resolvedColumn.getOptionValue);
  const getOptionLabel = getOptionLabelProp || ((_resolvedColumn2 = resolvedColumn) == null ? void 0 : _resolvedColumn2.getOptionLabel);
  const isOptionEqualToValue = React.useCallback((option, value) => getOptionValue(option) === getOptionValue(value), [getOptionValue]);
  const resolvedValueOptions = React.useMemo(() => {
    var _resolvedColumn3;
    if (!((_resolvedColumn3 = resolvedColumn) != null && _resolvedColumn3.valueOptions)) {
      return [];
    }
    if (typeof resolvedColumn.valueOptions === 'function') {
      return resolvedColumn.valueOptions({
        field: resolvedColumn.field
      });
    }
    return resolvedColumn.valueOptions;
  }, [resolvedColumn]);
  const resolvedFormattedValueOptions = React.useMemo(() => {
    return resolvedValueOptions == null ? void 0 : resolvedValueOptions.map(getOptionValue);
  }, [resolvedValueOptions, getOptionValue]);

  // The value is computed from the item.value and used directly
  // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
  const filteredValues = React.useMemo(() => {
    if (!Array.isArray(item.value)) {
      return [];
    }
    if (resolvedValueOptions !== undefined) {
      const itemValueIndexes = item.value.map(element => {
        // Gets the index matching between values and valueOptions
        return resolvedFormattedValueOptions == null ? void 0 : resolvedFormattedValueOptions.findIndex(formattedOption => formattedOption === element);
      });
      return itemValueIndexes.filter(index => index >= 0).map(index => resolvedValueOptions[index]);
    }
    return item.value;
  }, [item.value, resolvedValueOptions, resolvedFormattedValueOptions]);
  React.useEffect(() => {
    if (!Array.isArray(item.value) || filteredValues.length !== item.value.length) {
      // Updates the state if the filter value has been cleaned by the component
      applyValue(_extends({}, item, {
        value: filteredValues.map(getOptionValue)
      }));
    }
  }, [item, filteredValues, applyValue, getOptionValue]);
  const handleChange = React.useCallback((event, value) => {
    applyValue(_extends({}, item, {
      value: value.map(getOptionValue)
    }));
  }, [applyValue, item, getOptionValue]);
  return /*#__PURE__*/_jsx(Autocomplete, _extends({
    multiple: true,
    options: resolvedValueOptions,
    isOptionEqualToValue: isOptionEqualToValue,
    filterOptions: filter,
    id: id,
    value: filteredValues,
    onChange: handleChange,
    getOptionLabel: getOptionLabel,
    renderTags: (value, getTagProps) => value.map((option, index) => /*#__PURE__*/_jsx(Chip, _extends({
      variant: "outlined",
      size: "small",
      label: getOptionLabel(option)
    }, getTagProps({
      index
    })))),
    renderInput: params => {
      var _rootProps$slotProps;
      return /*#__PURE__*/_jsx(rootProps.slots.baseTextField, _extends({}, params, {
        label: apiRef.current.getLocaleText('filterPanelInputLabel'),
        placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
        InputLabelProps: _extends({}, params.InputLabelProps, {
          shrink: true
        }),
        inputRef: focusElementRef,
        type: "singleSelect"
      }, TextFieldProps, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseTextField));
    }
  }, other));
}
process.env.NODE_ENV !== "production" ? GridFilterInputMultipleSingleSelect.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel: PropTypes.func,
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue: PropTypes.func,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired,
  type: PropTypes.oneOf(['singleSelect'])
} : void 0;
export { GridFilterInputMultipleSingleSelect };