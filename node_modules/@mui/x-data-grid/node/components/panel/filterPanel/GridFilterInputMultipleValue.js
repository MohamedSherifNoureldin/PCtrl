"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridFilterInputMultipleValue = GridFilterInputMultipleValue;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Autocomplete = _interopRequireDefault(require("@mui/material/Autocomplete"));
var _Chip = _interopRequireDefault(require("@mui/material/Chip"));
var _utils = require("@mui/utils");
var _useGridRootProps = require("../../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef", "color", "error", "helperText", "size", "variant"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function GridFilterInputMultipleValue(props) {
  const {
      item,
      applyValue,
      type,
      apiRef,
      focusElementRef,
      color,
      error,
      helperText,
      size,
      variant
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const TextFieldProps = {
    color,
    error,
    helperText,
    size,
    variant
  };
  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const id = (0, _utils.unstable_useId)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map(String));
  }, [item.value]);
  const handleChange = React.useCallback((event, value) => {
    setFilterValueState(value.map(String));
    applyValue((0, _extends2.default)({}, item, {
      value: [...value]
    }));
  }, [applyValue, item]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Autocomplete.default, (0, _extends2.default)({
    multiple: true,
    freeSolo: true,
    options: [],
    filterOptions: (options, params) => {
      const {
        inputValue
      } = params;
      return inputValue == null || inputValue === '' ? [] : [inputValue];
    },
    id: id,
    value: filterValueState,
    onChange: handleChange,
    renderTags: (value, getTagProps) => value.map((option, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Chip.default, (0, _extends2.default)({
      variant: "outlined",
      size: "small",
      label: option
    }, getTagProps({
      index
    })))),
    renderInput: params => /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseTextField, (0, _extends2.default)({}, params, {
      label: apiRef.current.getLocaleText('filterPanelInputLabel'),
      placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
      InputLabelProps: (0, _extends2.default)({}, params.InputLabelProps, {
        shrink: true
      }),
      inputRef: focusElementRef,
      type: type || 'text'
    }, TextFieldProps, rootProps.slotProps?.baseTextField))
  }, other));
}
process.env.NODE_ENV !== "production" ? GridFilterInputMultipleValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: _propTypes.default.shape({
    current: _propTypes.default.object.isRequired
  }).isRequired,
  applyValue: _propTypes.default.func.isRequired,
  focusElementRef: _propTypes.default /* @typescript-to-proptypes-ignore */.oneOfType([_propTypes.default.func, _propTypes.default.object]),
  item: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operator: _propTypes.default.string.isRequired,
    value: _propTypes.default.any
  }).isRequired,
  type: _propTypes.default.oneOf(['number', 'text'])
} : void 0;