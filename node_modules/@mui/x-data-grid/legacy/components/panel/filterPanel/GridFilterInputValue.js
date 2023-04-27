import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
export var SUBMIT_FILTER_STROKE_TIME = 500;
function GridFilterInputValue(props) {
  var _item$value, _rootProps$slotProps;
  var item = props.item,
    applyValue = props.applyValue,
    type = props.type,
    apiRef = props.apiRef,
    focusElementRef = props.focusElementRef,
    others = _objectWithoutProperties(props, _excluded);
  var filterTimeout = React.useRef();
  var _React$useState = React.useState((_item$value = item.value) != null ? _item$value : ''),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    filterValueState = _React$useState2[0],
    setFilterValueState = _React$useState2[1];
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    applying = _React$useState4[0],
    setIsApplying = _React$useState4[1];
  var id = useId();
  var rootProps = useGridRootProps();
  var onFilterChange = React.useCallback(function (event) {
    var value = event.target.value;
    clearTimeout(filterTimeout.current);
    setFilterValueState(String(value));
    setIsApplying(true);
    filterTimeout.current = setTimeout(function () {
      applyValue(_extends({}, item, {
        value: value
      }));
      setIsApplying(false);
    }, SUBMIT_FILTER_STROKE_TIME);
  }, [applyValue, item]);
  React.useEffect(function () {
    return function () {
      clearTimeout(filterTimeout.current);
    };
  }, []);
  React.useEffect(function () {
    var _item$value2;
    var itemValue = (_item$value2 = item.value) != null ? _item$value2 : '';
    setFilterValueState(String(itemValue));
  }, [item.value]);
  var InputProps = applying ? {
    endAdornment: /*#__PURE__*/_jsx(rootProps.slots.loadIcon, {})
  } : others.InputProps;
  return /*#__PURE__*/_jsx(rootProps.slots.baseTextField, _extends({
    id: id,
    label: apiRef.current.getLocaleText('filterPanelInputLabel'),
    placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
    value: filterValueState,
    onChange: onFilterChange,
    variant: "standard",
    type: type || 'text',
    InputProps: InputProps,
    InputLabelProps: {
      shrink: true
    },
    inputRef: focusElementRef
  }, others, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseTextField));
}
process.env.NODE_ENV !== "production" ? GridFilterInputValue.propTypes = {
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
  }).isRequired
} : void 0;
export { GridFilterInputValue };