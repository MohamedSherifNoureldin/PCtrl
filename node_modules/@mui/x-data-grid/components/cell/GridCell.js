import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["align", "children", "colIndex", "colDef", "cellMode", "field", "formattedValue", "hasFocus", "height", "isEditable", "isSelected", "rowId", "tabIndex", "value", "width", "className", "showRightBorder", "extendRowFullWidth", "row", "colSpan", "disableDragEvents", "onClick", "onDoubleClick", "onMouseDown", "onMouseUp", "onMouseOver", "onKeyDown", "onKeyUp", "onDragEnter", "onDragOver"];
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
let cachedSupportsPreventScroll;
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
const useUtilityClasses = ownerState => {
  const {
    align,
    showRightBorder,
    isEditable,
    isSelected,
    classes
  } = ownerState;
  const slots = {
    root: ['cell', `cell--text${capitalize(align)}`, isEditable && 'cell--editable', isSelected && 'selected', showRightBorder && 'cell--withRightBorder', 'withBorderColor'],
    content: ['cellContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
let warnedOnce = false;
const GridCell = /*#__PURE__*/React.forwardRef((props, ref) => {
  var _rootProps$experiment;
  const {
      align,
      children,
      colIndex,
      cellMode,
      field,
      formattedValue,
      hasFocus,
      height,
      isEditable,
      isSelected,
      rowId,
      tabIndex,
      value,
      width,
      className,
      showRightBorder,
      colSpan,
      disableDragEvents,
      onClick,
      onDoubleClick,
      onMouseDown,
      onMouseUp,
      onMouseOver,
      onKeyDown,
      onKeyUp,
      onDragEnter,
      onDragOver
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef(null);
  const handleRef = useForkRef(ref, cellRef);
  const focusElementRef = React.useRef(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = {
    align,
    showRightBorder,
    isEditable,
    classes: rootProps.classes,
    isSelected
  };
  const classes = useUtilityClasses(ownerState);
  const publishMouseUp = React.useCallback(eventName => event => {
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);
    if (onMouseUp) {
      onMouseUp(event);
    }
  }, [apiRef, field, onMouseUp, rowId]);
  const publishMouseDown = React.useCallback(eventName => event => {
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);
    if (onMouseDown) {
      onMouseDown(event);
    }
  }, [apiRef, field, onMouseDown, rowId]);
  const publish = React.useCallback((eventName, propHandler) => event => {
    // The row might have been deleted during the click
    if (!apiRef.current.getRow(rowId)) {
      return;
    }
    const params = apiRef.current.getCellParams(rowId, field || '');
    apiRef.current.publishEvent(eventName, params, event);
    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, field, rowId]);
  const style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height === 'auto' ? 'none' : height // max-height doesn't support "auto"
  };

  React.useEffect(() => {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }
    const doc = ownerDocument(apiRef.current.rootElementRef.current);
    if (cellRef.current && !cellRef.current.contains(doc.activeElement)) {
      const focusableElement = cellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusElementRef.current || focusableElement || cellRef.current;
      if (doesSupportPreventScroll()) {
        elementToFocus.focus({
          preventScroll: true
        });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [hasFocus, cellMode, apiRef]);
  let handleFocus = other.onFocus;
  if (process.env.NODE_ENV === 'test' && (_rootProps$experiment = rootProps.experimentalFeatures) != null && _rootProps$experiment.warnIfFocusStateIsNotSynced) {
    handleFocus = event => {
      const focusedCell = gridFocusCellSelector(apiRef);
      if ((focusedCell == null ? void 0 : focusedCell.id) === rowId && focusedCell.field === field) {
        if (typeof other.onFocus === 'function') {
          other.onFocus(event);
        }
        return;
      }
      if (!warnedOnce) {
        console.warn([`MUI: The cell with id=${rowId} and field=${field} received focus.`, `According to the state, the focus should be at id=${focusedCell == null ? void 0 : focusedCell.id}, field=${focusedCell == null ? void 0 : focusedCell.field}.`, "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.", 'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.'].join('\n'));
        warnedOnce = true;
      }
    };
  }
  const column = apiRef.current.getColumn(field);
  const managesOwnFocus = column.type === 'actions';
  const renderChildren = () => {
    if (children === undefined) {
      const valueString = valueToRender == null ? void 0 : valueToRender.toString();
      return /*#__PURE__*/_jsx("div", {
        className: classes.content,
        title: valueString,
        children: valueString
      });
    }
    if ( /*#__PURE__*/React.isValidElement(children) && managesOwnFocus) {
      return /*#__PURE__*/React.cloneElement(children, {
        focusElementRef
      });
    }
    return children;
  };
  const draggableEventHandlers = disableDragEvents ? null : {
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
const MemoizedCell = /*#__PURE__*/React.memo(GridCell);
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