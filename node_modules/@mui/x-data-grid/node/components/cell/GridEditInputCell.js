"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderEditInputCell = exports.GridEditInputCell = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _styles = require("@mui/material/styles");
var _InputBase = _interopRequireDefault(require("@mui/material/InputBase"));
var _gridClasses = require("../../constants/gridClasses");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _useGridApiContext = require("../../hooks/utils/useGridApiContext");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "isValidating", "debounceMs", "isProcessingProps", "onValueChange"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['editInputCell']
  };
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};
const GridEditInputCellRoot = (0, _styles.styled)(_InputBase.default, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
  overridesResolver: (props, styles) => styles.editInputCell
})(({
  theme
}) => (0, _extends2.default)({}, theme.typography.body2, {
  padding: '1px 0',
  '& input': {
    padding: '0 16px',
    height: '100%'
  }
}));
const GridEditInputCell = /*#__PURE__*/React.forwardRef((props, ref) => {
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const {
      id,
      value,
      field,
      colDef,
      hasFocus,
      debounceMs = 200,
      isProcessingProps,
      onValueChange
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const inputRef = React.useRef();
  const [valueState, setValueState] = React.useState(value);
  const classes = useUtilityClasses(rootProps);
  const handleChange = React.useCallback(async event => {
    const newValue = event.target.value;
    if (onValueChange) {
      await onValueChange(event, newValue);
    }
    const column = apiRef.current.getColumn(field);
    let parsedValue = newValue;
    if (column.valueParser) {
      parsedValue = column.valueParser(newValue, apiRef.current.getCellParams(id, field));
    }
    setValueState(parsedValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: parsedValue,
      debounceMs,
      unstable_skipValueParser: true
    }, event);
  }, [apiRef, debounceMs, field, id, onValueChange]);
  const meta = apiRef.current.unstable_getEditCellMeta ? apiRef.current.unstable_getEditCellMeta(id, field) : {};
  React.useEffect(() => {
    if (meta.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta.changeReason, value]);
  (0, _utils.unstable_useEnhancedEffect)(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridEditInputCellRoot, (0, _extends2.default)({
    ref: ref,
    inputRef: inputRef,
    className: classes.root,
    ownerState: rootProps,
    fullWidth: true,
    type: colDef.type === 'number' ? colDef.type : 'text',
    value: valueState ?? '',
    onChange: handleChange,
    endAdornment: isProcessingProps ? /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.loadIcon, {}) : undefined
  }, other));
});
exports.GridEditInputCell = GridEditInputCell;
process.env.NODE_ENV !== "production" ? GridEditInputCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: _propTypes.default.object,
  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']),
  changeReason: _propTypes.default.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object,
  debounceMs: _propTypes.default.number,
  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: _propTypes.default.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool,
  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  isProcessingProps: _propTypes.default.bool,
  isValidating: _propTypes.default.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: _propTypes.default.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.any,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object,
  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]),
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: _propTypes.default.any
} : void 0;
const renderEditInputCell = params => /*#__PURE__*/(0, _jsxRuntime.jsx)(GridEditInputCell, (0, _extends2.default)({}, params));
exports.renderEditInputCell = renderEditInputCell;