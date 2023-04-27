"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridFilterInputValue = GridFilterInputValue;
exports.SUBMIT_FILTER_STROKE_TIME = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _useGridRootProps = require("../../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const SUBMIT_FILTER_STROKE_TIME = 500;
exports.SUBMIT_FILTER_STROKE_TIME = SUBMIT_FILTER_STROKE_TIME;
function GridFilterInputValue(props) {
  const {
      item,
      applyValue,
      type,
      apiRef,
      focusElementRef
    } = props,
    others = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const filterTimeout = React.useRef();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = (0, _utils.unstable_useId)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const onFilterChange = React.useCallback(event => {
    const {
      value
    } = event.target;
    clearTimeout(filterTimeout.current);
    setFilterValueState(String(value));
    setIsApplying(true);
    filterTimeout.current = setTimeout(() => {
      applyValue((0, _extends2.default)({}, item, {
        value
      }));
      setIsApplying(false);
    }, SUBMIT_FILTER_STROKE_TIME);
  }, [applyValue, item]);
  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);
  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);
  const InputProps = applying ? {
    endAdornment: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.loadIcon, {})
  } : others.InputProps;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseTextField, (0, _extends2.default)({
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
  }, others, rootProps.slotProps?.baseTextField));
}
process.env.NODE_ENV !== "production" ? GridFilterInputValue.propTypes = {
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
  }).isRequired
} : void 0;