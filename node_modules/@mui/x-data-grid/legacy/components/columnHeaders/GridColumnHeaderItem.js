import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var colDef = ownerState.colDef,
    classes = ownerState.classes,
    isDragging = ownerState.isDragging,
    sortDirection = ownerState.sortDirection,
    showRightBorder = ownerState.showRightBorder,
    filterItemsCounter = ownerState.filterItemsCounter;
  var isColumnSorted = sortDirection != null;
  var isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  var isColumnNumeric = colDef.type === 'number';
  var slots = {
    root: ['columnHeader', colDef.headerAlign === 'left' && 'columnHeader--alignLeft', colDef.headerAlign === 'center' && 'columnHeader--alignCenter', colDef.headerAlign === 'right' && 'columnHeader--alignRight', colDef.sortable && 'columnHeader--sortable', isDragging && 'columnHeader--moving', isColumnSorted && 'columnHeader--sorted', isColumnFiltered && 'columnHeader--filtered', isColumnNumeric && 'columnHeader--numeric', 'withBorderColor', showRightBorder && 'columnHeader--withRightBorder'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnHeaderItem(props) {
  var _rootProps$slotProps, _colDef$sortingOrder, _rootProps$slotProps2, _colDef$headerName;
  var colDef = props.colDef,
    columnMenuOpen = props.columnMenuOpen,
    colIndex = props.colIndex,
    headerHeight = props.headerHeight,
    isResizing = props.isResizing,
    sortDirection = props.sortDirection,
    sortIndex = props.sortIndex,
    filterItemsCounter = props.filterItemsCounter,
    hasFocus = props.hasFocus,
    tabIndex = props.tabIndex,
    disableReorder = props.disableReorder,
    separatorSide = props.separatorSide;
  var apiRef = useGridPrivateApiContext();
  var rootProps = useGridRootProps();
  var headerCellRef = React.useRef(null);
  var columnMenuId = useId();
  var columnMenuButtonId = useId();
  var iconButtonRef = React.useRef(null);
  var _React$useState = React.useState(columnMenuOpen),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    showColumnMenuIcon = _React$useState2[0],
    setShowColumnMenuIcon = _React$useState2[1];
  var isDraggable = React.useMemo(function () {
    return !rootProps.disableColumnReorder && !disableReorder && !colDef.disableReorder;
  }, [rootProps.disableColumnReorder, disableReorder, colDef.disableReorder]);
  var headerComponent;
  if (colDef.renderHeader) {
    headerComponent = colDef.renderHeader(apiRef.current.getColumnHeaderParams(colDef.field));
  }
  var ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showRightBorder: rootProps.showColumnVerticalBorder
  });
  var classes = useUtilityClasses(ownerState);
  var publish = React.useCallback(function (eventName) {
    return function (event) {
      // Ignore portal
      // See https://github.com/mui/mui-x/issues/1721
      if (!event.currentTarget.contains(event.target)) {
        return;
      }
      apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(colDef.field), event);
    };
  }, [apiRef, colDef.field]);
  var mouseEventsHandlers = React.useMemo(function () {
    return {
      onClick: publish('columnHeaderClick'),
      onDoubleClick: publish('columnHeaderDoubleClick'),
      onMouseOver: publish('columnHeaderOver'),
      // TODO remove as it's not used
      onMouseOut: publish('columnHeaderOut'),
      // TODO remove as it's not used
      onMouseEnter: publish('columnHeaderEnter'),
      // TODO remove as it's not used
      onMouseLeave: publish('columnHeaderLeave'),
      // TODO remove as it's not used
      onKeyDown: publish('columnHeaderKeyDown'),
      onFocus: publish('columnHeaderFocus'),
      onBlur: publish('columnHeaderBlur')
    };
  }, [publish]);
  var draggableEventHandlers = React.useMemo(function () {
    return isDraggable ? {
      onDragStart: publish('columnHeaderDragStart'),
      onDragEnter: publish('columnHeaderDragEnter'),
      onDragOver: publish('columnHeaderDragOver'),
      onDragEnd: publish('columnHeaderDragEnd')
    } : {};
  }, [isDraggable, publish]);
  var columnHeaderSeparatorProps = React.useMemo(function () {
    return {
      onMouseDown: publish('columnSeparatorMouseDown')
    };
  }, [publish]);
  React.useEffect(function () {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  var handleExited = React.useCallback(function () {
    setShowColumnMenuIcon(false);
  }, []);
  var columnMenuIconButton = !rootProps.disableColumnMenu && !colDef.disableColumnMenu && /*#__PURE__*/_jsx(ColumnHeaderMenuIcon, {
    colDef: colDef,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });
  var columnMenu = /*#__PURE__*/_jsx(GridColumnHeaderMenu, {
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    field: colDef.field,
    open: columnMenuOpen,
    target: iconButtonRef.current,
    ContentComponent: rootProps.slots.columnMenu,
    contentComponentProps: (_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.columnMenu,
    onExited: handleExited
  });
  var sortingOrder = (_colDef$sortingOrder = colDef.sortingOrder) != null ? _colDef$sortingOrder : rootProps.sortingOrder;
  var columnTitleIconButtons = /*#__PURE__*/_jsxs(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/_jsx(rootProps.slots.columnHeaderFilterIconButton, _extends({
      field: colDef.field,
      counter: filterItemsCounter
    }, (_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.columnHeaderFilterIconButton)), colDef.sortable && !colDef.hideSortIcons && /*#__PURE__*/_jsx(GridColumnHeaderSortIcon, {
      direction: sortDirection,
      index: sortIndex,
      sortingOrder: sortingOrder
    })]
  });
  React.useLayoutEffect(function () {
    var columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      var elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus == null ? void 0 : elementToFocus.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  var headerClassName = typeof colDef.headerClassName === 'function' ? colDef.headerClassName({
    field: colDef.field,
    colDef: colDef
  }) : colDef.headerClassName;
  var label = (_colDef$headerName = colDef.headerName) != null ? _colDef$headerName : colDef.field;
  return /*#__PURE__*/_jsx(GridGenericColumnHeaderItem, _extends({
    ref: headerCellRef,
    classes: classes,
    columnMenuOpen: columnMenuOpen,
    colIndex: colIndex,
    height: headerHeight,
    isResizing: isResizing,
    sortDirection: sortDirection,
    hasFocus: hasFocus,
    tabIndex: tabIndex,
    separatorSide: separatorSide,
    isDraggable: isDraggable,
    headerComponent: headerComponent,
    description: colDef.description,
    elementId: colDef.field,
    width: colDef.computedWidth,
    columnMenuIconButton: columnMenuIconButton,
    columnTitleIconButtons: columnTitleIconButtons,
    headerClassName: headerClassName,
    label: label,
    resizable: !rootProps.disableColumnResize && !!colDef.resizable,
    "data-field": colDef.field,
    columnMenu: columnMenu,
    draggableContainerProps: draggableEventHandlers,
    columnHeaderSeparatorProps: columnHeaderSeparatorProps
  }, mouseEventsHandlers));
}
process.env.NODE_ENV !== "production" ? GridColumnHeaderItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  columnMenuOpen: PropTypes.bool.isRequired,
  disableReorder: PropTypes.bool,
  filterItemsCounter: PropTypes.number,
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  separatorSide: PropTypes.oneOf(['left', 'right']),
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired
} : void 0;
export { GridColumnHeaderItem };