import _extends from "@babel/runtime/helpers/esm/extends";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "className", "hasFocus", "isValidating", "isProcessingProps", "error", "onValueChange"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses, unstable_useId as useId, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['editBooleanCell']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridEditBooleanCell(props) {
  var _rootProps$slotProps;
  var idProp = props.id,
    value = props.value,
    formattedValue = props.formattedValue,
    api = props.api,
    field = props.field,
    row = props.row,
    rowNode = props.rowNode,
    colDef = props.colDef,
    cellMode = props.cellMode,
    isEditable = props.isEditable,
    tabIndex = props.tabIndex,
    className = props.className,
    hasFocus = props.hasFocus,
    isValidating = props.isValidating,
    isProcessingProps = props.isProcessingProps,
    error = props.error,
    onValueChange = props.onValueChange,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var inputRef = React.useRef(null);
  var id = useId();
  var _React$useState = React.useState(value),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    valueState = _React$useState2[0],
    setValueState = _React$useState2[1];
  var rootProps = useGridRootProps();
  var ownerState = {
    classes: rootProps.classes
  };
  var classes = useUtilityClasses(ownerState);
  var handleChange = React.useCallback( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var newValue;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            newValue = event.target.checked;
            if (!onValueChange) {
              _context.next = 4;
              break;
            }
            _context.next = 4;
            return onValueChange(event, newValue);
          case 4:
            setValueState(newValue);
            _context.next = 7;
            return apiRef.current.setEditCellValue({
              id: idProp,
              field: field,
              value: newValue
            }, event);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [apiRef, field, idProp, onValueChange]);
  React.useEffect(function () {
    setValueState(value);
  }, [value]);
  useEnhancedEffect(function () {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/_jsx("label", _extends({
    htmlFor: id,
    className: clsx(classes.root, className)
  }, other, {
    children: /*#__PURE__*/_jsx(rootProps.slots.baseCheckbox, _extends({
      id: id,
      inputRef: inputRef,
      checked: Boolean(valueState),
      onChange: handleChange,
      size: "small"
    }, (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseCheckbox))
  }));
}
process.env.NODE_ENV !== "production" ? GridEditBooleanCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,
  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {boolean} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
} : void 0;
export { GridEditBooleanCell };
export var renderEditBooleanCell = function renderEditBooleanCell(params) {
  return /*#__PURE__*/_jsx(GridEditBooleanCell, _extends({}, params));
};