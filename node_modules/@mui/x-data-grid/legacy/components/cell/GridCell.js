import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["align", "children", "colIndex", "colDef", "cellMode", "field", "formattedValue", "hasFocus", "height", "isEditable", "isSelected", "rowId", "tabIndex", "value", "width", "className", "showRightBorder", "extendRowFullWidth", "row", "colSpan", "disableDragEvents", "onClick", "onDoubleClick", "onMouseDown", "onMouseUp", "onMouseOver", "onKeyDown", "onKeyUp", "onDragEnter", "onDragOver"];
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_useForkRef as useForkRef, unstable_composeClasses as composeClasses, unstable_ownerDocument as ownerDocument, unstable_capitalize as capitalize } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { GridCellModes } from '../../models';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridFocusCellSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { jsx as _jsx } from "react/jsx-runtime";
// Based on https://stackoverflow.com/a/59518678
var cachedSupportsPreventScroll;
function doesSupportPreventScroll() {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      }
    });
  }
  return cachedSupportsPreventScroll;
}
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var align = ownerState.align,
    showRightBorder = ownerState.showRightBorder,
    isEditable = ownerState.isEditable,
    isSelected = ownerState.isSelected,
    classes = ownerState.classes;
  var slots = {
    root: ['cell', "cell--text".concat(capitalize(align)), isEditable && 'cell--editable', isSelected && 'selected', showRightBorder && 'cell--withRightBorder', 'withBorderColor'],
    content: ['cellContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var warnedOnce = false;
var GridCell = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _rootProps$experiment;
  var align = props.align,
    children = props.children,
    colIndex = props.colIndex,
    colDef = props.colDef,
    cellMode = props.cellMode,
    field = props.field,
    formattedValue = props.formattedValue,
    hasFocus = props.hasFocus,
    height = props.height,
    isEditable = props.isEditable,
    isSelected = props.isSelected,
    rowId = props.rowId,
    tabIndex = props.tabIndex,
    value = props.value,
    width = props.width,
    className = props.className,
    showRightBorder = props.showRightBorder,
    extendRowFullWidth = props.extendRowFullWidth,
    row = props.row,
    colSpan = props.colSpan,
    disableDragEvents = props.disableDragEvents,
    onClick = props.onClick,
    onDoubleClick = props.onDoubleClick,
    onMouseDown = props.onMouseDown,
    onMouseUp = props.onMouseUp,
    onMouseOver = props.onMouseOver,
    onKeyDown = props.onKeyDown,
    onKeyUp = props.onKeyUp,
    onDragEnter = props.onDragEnter,
    onDragOver = props.onDragOver,
    other = _objectWithoutProperties(props, _excluded);
  var valueToRender = formattedValue == null ? value : formattedValue;
  var cellRef = React.useRef(null);
  var handleRef = useForkRef(ref, cellRef);
  var focusElementRef = React.useRef(null);
  var apiRef = useGridApiContext();
  var rootProps = useGridRootProps();
  var ownerState = {
    align: align,
    showRightBorder: showRightBorder,
    isEditable: isEditable,
    classes: rootProps.classes,
    isSelected: isSelected
  };
  var classes = useUtilityClasses(ownerState);
  var publishMouseUp = React.useCallback(function (eventName) {
    return function (event) {
      var params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);
      if (onMouseUp) {
        onMouseUp(event);
      }
    };
  }, [apiRef, field, onMouseUp, rowId]);
  var publishMouseDown = React.useCallback(function (eventName) {
    return function (event) {
      var params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);
      if (onMouseDown) {
        onMouseDown(event);
      }
    };
  }, [apiRef, field, onMouseDown, rowId]);
  var publish = React.useCallback(function (eventName, propHandler) {
    return function (event) {
      // The row might have been deleted during the click
      if (!apiRef.current.getRow(rowId)) {
        return;
      }
      var params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);
      if (propHandler) {
        propHandler(event);
      }
    };
  }, [apiRef, field, rowId]);
  var style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height === 'auto' ? 'none' : height // max-height doesn't support "auto"
  };

  React.useEffect(function () {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }
    var doc = ownerDocument(apiRef.current.rootElementRef.current);
    if (cellRef.current && !cellRef.current.contains(doc.activeElement)) {
      var focusableElement = cellRef.current.querySelector('[tabindex="0"]');
      var elementToFocus = focusElementRef.current || focusableElement || cellRef.current;
      if (doesSupportPreventScroll()) {
        elementToFocus.focus({
          preventScroll: true
        });
      } else {
        var scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [hasFocus, cellMode, apiRef]);
  var handleFocus = other.onFocus;
  if (process.env.NODE_ENV === 'test' && (_rootProps$experiment = rootProps.experimentalFeatures) != null && _rootProps$experiment.warnIfFocusStateIsNotSynced) {
    handleFocus = function handleFocus(event) {
      var focusedCell = gridFocusCellSelector(apiRef);
      if ((focusedCell == null ? void 0 : focusedCell.id) === rowId && focusedCell.field === field) {
        if (typeof other.onFocus === 'function') {
          other.onFocus(event);
        }
        return;
      }
      if (!warnedOnce) {
        console.warn(["MUI: The cell with id=".concat(rowId, " and field=").concat(field, " received focus."), "According to the state, the focus should be at id=".concat(focusedCell == null ? void 0 : focusedCell.id, ", field=").concat(focusedCell == null ? void 0 : focusedCell.field, "."), "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.", 'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.'].join('\n'));
        warnedOnce = true;
      }
    };
  }
  var column = apiRef.current.getColumn(field);
  var managesOwnFocus = column.type === 'actions';
  var renderChildren = function renderChildren() {
    if (children === undefined) {
      var valueString = valueToRender == null ? void 0 : valueToRender.toString();
      return /*#__PURE__*/_jsx("div", {
        className: classes.content,
        title: valueString,
        children: valueString
      });
    }
    if ( /*#__PURE__*/React.isValidElement(children) && managesOwnFocus) {
      return /*#__PURE__*/React.cloneElement(children, {
        focusElementRef: focusElementRef
      });
    }
    return children;
  };
  var draggableEventHandlers = disableDragEvents ? null : {
    onDragEnter: publish('cellDragEnter', onDragEnter),
    onDragOver: publish('cellDragOver', onDragOver)
  };
  return /*#__PURE__*/_jsx("div", _extends({
    ref: handleRef,
    className: clsx(className, classes.root),
    role: "cell",
    "data-field": field,
    "data-colindex": colIndex,
    "aria-colindex": colIndex + 1,
    "aria-colspan": colSpan,
    style: style,
    tabIndex: (cellMode === 'view' || !isEditable) && !managesOwnFocus ? tabIndex : -1,
    onClick: publish('cellClick', onClick),
    onDoubleClick: publish('cellDoubleClick', onDoubleClick),
    onMouseOver: publish('cellMouseOver', onMouseOver),
    onMouseDown: publishMouseDown('cellMouseDown'),
    onMouseUp: publishMouseUp('cellMouseUp'),
    onKeyDown: publish('cellKeyDown', onKeyDown),
    onKeyUp: publish('cellKeyUp', onKeyUp)
  }, draggableEventHandlers, other, {
    onFocus: handleFocus,
    children: renderChildren()
  }));
});
var MemoizedCell = /*#__PURE__*/React.memo(GridCell);
process.env.NODE_ENV !== "production" ? GridCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['center', 'left', 'right']),
  cellMode: PropTypes.oneOf(['edit', 'view']),
  children: PropTypes.node,
  className: PropTypes.string,
  colIndex: PropTypes.number,
  colSpan: PropTypes.number,
  disableDragEvents: PropTypes.bool,
  field: PropTypes.string,
  formattedValue: PropTypes.any,
  hasFocus: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
  isEditable: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showRightBorder: PropTypes.bool,
  tabIndex: PropTypes.oneOf([-1, 0]),
  value: PropTypes.any,
  width: PropTypes.number
} : void 0;
export { MemoizedCell as GridCell };