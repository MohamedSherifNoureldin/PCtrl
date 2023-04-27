import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["classes", "columnMenuOpen", "colIndex", "height", "isResizing", "sortDirection", "hasFocus", "tabIndex", "separatorSide", "isDraggable", "headerComponent", "description", "elementId", "width", "columnMenuIconButton", "columnMenu", "columnTitleIconButtons", "headerClassName", "label", "resizable", "draggableContainerProps", "columnHeaderSeparatorProps"];
import * as React from 'react';
import clsx from 'clsx';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var GridGenericColumnHeaderItem = /*#__PURE__*/React.forwardRef(function GridGenericColumnHeaderItem(props, ref) {
  var classes = props.classes,
    columnMenuOpen = props.columnMenuOpen,
    colIndex = props.colIndex,
    height = props.height,
    isResizing = props.isResizing,
    sortDirection = props.sortDirection,
    hasFocus = props.hasFocus,
    tabIndex = props.tabIndex,
    separatorSide = props.separatorSide,
    isDraggable = props.isDraggable,
    headerComponent = props.headerComponent,
    description = props.description,
    elementId = props.elementId,
    width = props.width,
    _props$columnMenuIcon = props.columnMenuIconButton,
    columnMenuIconButton = _props$columnMenuIcon === void 0 ? null : _props$columnMenuIcon,
    _props$columnMenu = props.columnMenu,
    columnMenu = _props$columnMenu === void 0 ? null : _props$columnMenu,
    _props$columnTitleIco = props.columnTitleIconButtons,
    columnTitleIconButtons = _props$columnTitleIco === void 0 ? null : _props$columnTitleIco,
    headerClassName = props.headerClassName,
    label = props.label,
    resizable = props.resizable,
    draggableContainerProps = props.draggableContainerProps,
    columnHeaderSeparatorProps = props.columnHeaderSeparatorProps,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridPrivateApiContext();
  var rootProps = useGridRootProps();
  var headerCellRef = React.useRef(null);
  var _React$useState = React.useState(columnMenuOpen),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    showColumnMenuIcon = _React$useState2[0],
    setShowColumnMenuIcon = _React$useState2[1];
  var handleRef = useForkRef(headerCellRef, ref);
  var ariaSort = 'none';
  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }
  React.useEffect(function () {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  React.useLayoutEffect(function () {
    var columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      var elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus == null ? void 0 : elementToFocus.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  return /*#__PURE__*/_jsxs("div", _extends({
    ref: handleRef,
    className: clsx(classes.root, headerClassName),
    style: {
      height: height,
      width: width,
      minWidth: width,
      maxWidth: width
    },
    role: "columnheader",
    tabIndex: tabIndex,
    "aria-colindex": colIndex + 1,
    "aria-sort": ariaSort,
    "aria-label": headerComponent == null ? label : undefined
  }, other, {
    children: [/*#__PURE__*/_jsxs("div", _extends({
      className: classes.draggableContainer,
      draggable: isDraggable
    }, draggableContainerProps, {
      children: [/*#__PURE__*/_jsxs("div", {
        className: classes.titleContainer,
        children: [/*#__PURE__*/_jsx("div", {
          className: classes.titleContainerContent,
          children: headerComponent !== undefined ? headerComponent : /*#__PURE__*/_jsx(GridColumnHeaderTitle, {
            label: label,
            description: description,
            columnWidth: width
          })
        }), columnTitleIconButtons]
      }), columnMenuIconButton]
    })), /*#__PURE__*/_jsx(GridColumnHeaderSeparator, _extends({
      resizable: !rootProps.disableColumnResize && !!resizable,
      resizing: isResizing,
      height: height,
      side: separatorSide
    }, columnHeaderSeparatorProps)), columnMenu]
  }));
});
export { GridGenericColumnHeaderItem };