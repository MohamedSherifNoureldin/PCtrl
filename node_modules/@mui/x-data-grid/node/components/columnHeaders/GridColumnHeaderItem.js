"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnHeaderItem = GridColumnHeaderItem;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/utils");
var _useGridPrivateApiContext = require("../../hooks/utils/useGridPrivateApiContext");
var _GridColumnHeaderSortIcon = require("./GridColumnHeaderSortIcon");
var _ColumnHeaderMenuIcon = require("./ColumnHeaderMenuIcon");
var _GridColumnHeaderMenu = require("../menu/columnMenu/GridColumnHeaderMenu");
var _gridClasses = require("../../constants/gridClasses");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _GridGenericColumnHeaderItem = require("./GridGenericColumnHeaderItem");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
  return (0, _utils.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
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
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const headerCellRef = React.useRef(null);
  const columnMenuId = (0, _utils.unstable_useId)();
  const columnMenuButtonId = (0, _utils.unstable_useId)();
  const iconButtonRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const isDraggable = React.useMemo(() => !rootProps.disableColumnReorder && !disableReorder && !colDef.disableReorder, [rootProps.disableColumnReorder, disableReorder, colDef.disableReorder]);
  let headerComponent;
  if (colDef.renderHeader) {
    headerComponent = colDef.renderHeader(apiRef.current.getColumnHeaderParams(colDef.field));
  }
  const ownerState = (0, _extends2.default)({}, props, {
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
  const columnMenuIconButton = !rootProps.disableColumnMenu && !colDef.disableColumnMenu && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ColumnHeaderMenuIcon.ColumnHeaderMenuIcon, {
    colDef: colDef,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });
  const columnMenu = /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderMenu.GridColumnHeaderMenu, {
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
  const columnTitleIconButtons = /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnHeaderFilterIconButton, (0, _extends2.default)({
      field: colDef.field,
      counter: filterItemsCounter
    }, rootProps.slotProps?.columnHeaderFilterIconButton)), colDef.sortable && !colDef.hideSortIcons && /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderSortIcon.GridColumnHeaderSortIcon, {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridGenericColumnHeaderItem.GridGenericColumnHeaderItem, (0, _extends2.default)({
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
  colDef: _propTypes.default.object.isRequired,
  colIndex: _propTypes.default.number.isRequired,
  columnMenuOpen: _propTypes.default.bool.isRequired,
  disableReorder: _propTypes.default.bool,
  filterItemsCounter: _propTypes.default.number,
  hasFocus: _propTypes.default.bool,
  headerHeight: _propTypes.default.number.isRequired,
  isDragging: _propTypes.default.bool.isRequired,
  isResizing: _propTypes.default.bool.isRequired,
  separatorSide: _propTypes.default.oneOf(['left', 'right']),
  sortDirection: _propTypes.default.oneOf(['asc', 'desc']),
  sortIndex: _propTypes.default.number,
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired
} : void 0;