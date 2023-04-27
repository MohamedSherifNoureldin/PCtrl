import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef", "color", "error", "helperText", "size", "variant", "getOptionLabel", "getOptionValue"];
import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { unstable_useId as useId } from '@mui/utils';
import { isSingleSelectColDef } from './filterPanelUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
var filter = createFilterOptions();
function GridFilterInputMultipleSingleSelect(props) {
  var _resolvedColumn, _resolvedColumn2;
  var item = props.item,
    applyValue = props.applyValue,
    type = props.type,
    apiRef = props.apiRef,
    focusElementRef = props.focusElementRef,
    color = props.color,
    error = props.error,
    helperText = props.helperText,
    size = props.size,
    _props$variant = props.variant,
    variant = _props$variant === void 0 ? 'standard' : _props$variant,
    getOptionLabelProp = props.getOptionLabel,
    getOptionValueProp = props.getOptionValue,
    other = _objectWithoutProperties(props, _excluded);
  var TextFieldProps = {
    color: color,
    error: error,
    helperText: helperText,
    size: size,
    variant: variant
  };
  var id = useId();
  var rootProps = useGridRootProps();
  var resolvedColumn = null;
  if (item.field) {
    var column = apiRef.current.getColumn(item.field);
    if (isSingleSelectColDef(column)) {
      resolvedColumn = column;
    }
  }
  var getOptionValue = getOptionValueProp || ((_resolvedColumn = resolvedColumn) == null ? void 0 : _resolvedColumn.getOptionValue);
  var getOptionLabel = getOptionLabelProp || ((_resolvedColumn2 = resolvedColumn) == null ? void 0 : _resolvedColumn2.getOptionLabel);
  var isOptionEqualToValue = React.useCallback(function (option, value) {
    return getOptionValue(option) === getOptionValue(value);
  }, [getOptionValue]);
  var resolvedValueOptions = React.useMemo(function () {
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
  var resolvedFormattedValueOptions = React.useMemo(function () {
    return resolvedValueOptions == null ? void 0 : resolvedValueOptions.map(getOptionValue);
  }, [resolvedValueOptions, getOptionValue]);

  // The value is computed from the item.value and used directly
  // If it was done by a useEffect/useState, the Autocomplete could receive incoherent value and options
  var filteredValues = React.useMemo(function () {
    if (!Array.isArray(item.value)) {
      return [];
    }
    if (resolvedValueOptions !== undefined) {
      var itemValueIndexes = item.value.map(function (element) {
        // Gets the index matching between values and valueOptions
        return resolvedFormattedValueOptions == null ? void 0 : resolvedFormattedValueOptions.findIndex(function (formattedOption) {
          return formattedOption === element;
        });
      });
      return itemValueIndexes.filter(function (index) {
        return index >= 0;
      }).map(function (index) {
        return resolvedValueOptions[index];
      });
    }
    return item.value;
  }, [item.value, resolvedValueOptions, resolvedFormattedValueOptions]);
  React.useEffect(function () {
    if (!Array.isArray(item.value) || filteredValues.length !== item.value.length) {
      // Updates the state if the filter value has been cleaned by the component
      applyValue(_extends({}, item, {
        value: filteredValues.map(getOptionValue)
      }));
    }
  }, [item, filteredValues, applyValue, getOptionValue]);
  var handleChange = React.useCallback(function (event, value) {
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
    renderTags: function renderTags(value, getTagProps) {
      return value.map(function (option, index) {
        return /*#__PURE__*/_jsx(Chip, _extends({
          variant: "outlined",
          size: "small",
          label: getOptionLabel(option)
        }, getTagProps({
          index: index
        })));
      });
    },
    renderInput: function renderInput(params) {
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