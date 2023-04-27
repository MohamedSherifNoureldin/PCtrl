import _extends from "@babel/runtime/helpers/esm/extends";
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
const useUtilityClasses = ownerState => {
  const {
    colDef,
    classes,
    isDragging,
    sortDirection,
    showRightBorder,
    filterItemsCounter
  } = ownerState;
  const isColumnSorted = sortDirection != null;
  const isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = colDef.type === 'number';
  const slots = {
    root: ['columnHeader', colDef.headerAlign === 'left' && 'columnHeader--alignLeft', colDef.headerAlign === 'center' && 'columnHeader--alignCenter', colDef.headerAlign === 'right' && 'columnHeader--alignRight', colDef.sortable && 'columnHeader--sortable', isDragging && 'columnHeader--moving', isColumnSorted && 'columnHeader--sorted', isColumnFiltered && 'columnHeader--filtered', isColumnNumeric && 'columnHeader--numeric', 'withBorderColor', showRightBorder && 'columnHeader--withRightBorder'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnHeaderItem(props) {
  const {
    colDef,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isResizing,
    sortDirection,
    sortIndex,
    filterItemsCounter,
    hasFocus,
    tabIndex,
    disableReorder,
    separatorSide
  } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef(null);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const iconButtonRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const isDraggable = React.useMemo(() => !rootProps.disableColumnReorder && !disableReorder && !colDef.disableReorder, [rootProps.disableColumnReorder, disableReorder, colDef.disableReorder]);
  let headerComponent;
  if (colDef.renderHeader) {
    headerComponent = colDef.renderHeader(apiRef.current.getColumnHeaderParams(colDef.field));
  }
  const ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showRightBorder: rootProps.showColumnVerticalBorder
  });
  const classes = useUtilityClasses(ownerState);
  const publish = React.useCallback(eventName => event => {
    // Ignore portal
    // See https://github.com/mui/mui-x/issues/1721
    if (!event.currentTarget.contains(event.target)) {
      return;
    }
    apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(colDef.field), event);
  }, [apiRef, colDef.field]);
  const mouseEventsHandlers = React.useMemo(() => ({
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
  }), [publish]);
  const draggableEventHandlers = React.useMemo(() => isDraggable ? {
    onDragStart: publish('columnHeaderDragStart'),
    onDragEnter: publish('columnHeaderDragEnter'),
    onDragOver: publish('columnHeaderDragOver'),
    onDragEnd: publish('columnHeaderDragEnd')
  } : {}, [isDraggable, publish]);
  const columnHeaderSeparatorProps = React.useMemo(() => ({
    onMouseDown: publish('columnSeparatorMouseDown')
  }), [publish]);
  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  const handleExited = React.useCallback(() => {
    setShowColumnMenuIcon(false);
  }, []);
  const columnMenuIconButton = !rootProps.disableColumnMenu && !colDef.disableColumnMenu && /*#__PURE__*/_jsx(ColumnHeaderMenuIcon, {
    colDef: colDef,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });
  const columnMenu = /*#__PURE__*/_jsx(GridColumnHeaderMenu, {
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    field: colDef.field,
    open: columnMenuOpen,
    target: iconButtonRef.current,
    ContentComponent: rootProps.slots.columnMenu,
    contentComponentProps: rootProps.slotProps?.columnMenu,
    onExited: handleExited
  });
  const sortingOrder = colDef.sortingOrder ?? rootProps.sortingOrder;
  const columnTitleIconButtons = /*#__PURE__*/_jsxs(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/_jsx(rootProps.slots.columnHeaderFilterIconButton, _extends({
      field: colDef.field,
      counter: filterItemsCounter
    }, rootProps.slotProps?.columnHeaderFilterIconButton)), colDef.sortable && !colDef.hideSortIcons && /*#__PURE__*/_jsx(GridColumnHeaderSortIcon, {
      direction: sortDirection,
      index: sortIndex,
      sortingOrder: sortingOrder
    })]
  });
  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  const headerClassName = typeof colDef.headerClassName === 'function' ? colDef.headerClassName({
    field: colDef.field,
    colDef
  }) : colDef.headerClassName;
  const label = colDef.headerName ?? colDef.field;
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