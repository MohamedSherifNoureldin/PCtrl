import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef", "color", "error", "helperText", "size", "variant"];
import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
function GridFilterInputMultipleValue(props) {
  var item = props.item,
    applyValue = props.applyValue,
    type = props.type,
    apiRef = props.apiRef,
    focusElementRef = props.focusElementRef,
    color = props.color,
    error = props.error,
    helperText = props.helperText,
    size = props.size,
    variant = props.variant,
    other = _objectWithoutProperties(props, _excluded);
  var TextFieldProps = {
    color: color,
    error: error,
    helperText: helperText,
    size: size,
    variant: variant
  };
  var _React$useState = React.useState(item.value || []),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    filterValueState = _React$useState2[0],
    setFilterValueState = _React$useState2[1];
  var id = useId();
  var rootProps = useGridRootProps();
  React.useEffect(function () {
    var _item$value;
    var itemValue = (_item$value = item.value) != null ? _item$value : [];
    setFilterValueState(itemValue.map(String));
  }, [item.value]);
  var handleChange = React.useCallback(function (event, value) {
    setFilterValueState(value.map(String));
    applyValue(_extends({}, item, {
      value: _toConsumableArray(value)
    }));
  }, [applyValue, item]);
  return /*#__PURE__*/_jsx(Autocomplete, _extends({
    multiple: true,
    freeSolo: true,
    options: [],
    filterOptions: function filterOptions(options, params) {
      var inputValue = params.inputValue;
      return inputValue == null || inputValue === '' ? [] : [inputValue];
    },
    id: id,
    value: filterValueState,
    onChange: handleChange,
    renderTags: function renderTags(value, getTagProps) {
      return value.map(function (option, index) {
        return /*#__PURE__*/_jsx(Chip, _extends({
          variant: "outlined",
          size: "small",
          label: option
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
        type: type || 'text'
      }, TextFieldProps, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseTextField));
    }
  }, other));
}
process.env.NODE_ENV !== "production" ? GridFilterInputMultipleValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.func, PropTypes.object]),
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired,
  type: PropTypes.oneOf(['number', 'text'])
} : void 0;
export { GridFilterInputMultipleValue };