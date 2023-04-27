"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridColumnHeaders = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _utils = require("@mui/utils");
var _system = require("@mui/system");
var _reselect = require("reselect");
var _useGridPrivateApiContext = require("../../utils/useGridPrivateApiContext");
var _useGridRootProps = require("../../utils/useGridRootProps");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _GridColumnHeaderItem = require("../../../components/columnHeaders/GridColumnHeaderItem");
var _gridColumnsUtils = require("../columns/gridColumnsUtils");
var _useGridVisibleRows = require("../../utils/useGridVisibleRows");
var _useGridVirtualScroller = require("../virtualization/useGridVirtualScroller");
var _GridColumnGroupHeader = require("../../../components/columnHeaders/GridColumnGroupHeader");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridColumnHeaderRow = (0, _system.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (props, styles) => styles.columnHeaderRow
})(() => ({
  display: 'flex'
}));
function isUIEvent(event) {
  return !!event.target;
}
const useGridColumnHeaders = props => {
  const {
    innerRef: innerRefProp,
    minColumnIndex = 0,
    visibleColumns,
    sortColumnLookup,
    filterColumnLookup,
    columnPositions,
    columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState,
    columnHeaderFocus,
    columnGroupHeaderFocus,
    densityFactor,
    headerGroupingMaxDepth,
    columnMenuState,
    columnVisibility,
    columnGroupsHeaderStructure,
    hasOtherElementInTabSequence
  } = props;
  const theme = (0, _system.useTheme)();
  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const innerRef = React.useRef(null);
  const handleInnerRef = (0, _utils.unstable_useForkRef)(innerRefProp, innerRef);
  const [renderContext, setRenderContext] = React.useState(null);
  const prevRenderContext = React.useRef(renderContext);
  const prevScrollLeft = React.useRef(0);
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, rootProps);
  const totalHeaderHeight = (0, _gridColumnsUtils.getTotalHeaderHeight)(apiRef, rootProps.columnHeaderHeight);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);
  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
  }, [apiRef]);

  // memoize `getFirstColumnIndexToRender`, since it's called on scroll
  const getFirstColumnIndexToRenderRef = React.useRef((0, _reselect.defaultMemoize)(_gridColumnsUtils.getFirstColumnIndexToRender, {
    equalityCheck: (a, b) => ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every(key => a[key] === b[key])
  }));
  const updateInnerPosition = React.useCallback(nextRenderContext => {
    const [firstRowToRender, lastRowToRender] = (0, _useGridVirtualScroller.getRenderableIndexes)({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    const firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex,
      columnBuffer: rootProps.columnBuffer,
      firstRowToRender,
      lastRowToRender,
      apiRef,
      visibleRows: currentPage.rows
    });
    const direction = theme.direction === 'ltr' ? 1 : -1;
    const offset = firstColumnToRender > 0 ? prevScrollLeft.current - direction * columnPositions[firstColumnToRender] : prevScrollLeft.current;
    innerRef.current.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
  }, [columnPositions, minColumnIndex, rootProps.columnBuffer, apiRef, currentPage.rows, rootProps.rowBuffer, theme.direction]);
  React.useLayoutEffect(() => {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);
  const handleScroll = React.useCallback(({
    left,
    renderContext: nextRenderContext = null
  }, event) => {
    if (!innerRef.current) {
      return;
    }

    // Ignore vertical scroll.
    // Excepts the first event which sets the previous render context.
    if (prevScrollLeft.current === left && prevRenderContext.current?.firstColumnIndex === nextRenderContext?.firstColumnIndex && prevRenderContext.current?.lastColumnIndex === nextRenderContext?.lastColumnIndex) {
      return;
    }
    prevScrollLeft.current = left;

    // We can only update the position when we guarantee that the render context has been
    // rendered. This is achieved using ReactDOM.flushSync or when the context doesn't change.
    let canUpdateInnerPosition = false;
    if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
      // ReactDOM.flushSync cannot be called on `scroll` events fired inside effects
      if (isUIEvent(event)) {
        // To prevent flickering, the inner position can only be updated after the new context has
        // been rendered. ReactDOM.flushSync ensures that the state changes will happen before
        // updating the position.
        ReactDOM.flushSync(() => {
          setRenderContext(nextRenderContext);
        });
        canUpdateInnerPosition = true;
      } else {
        setRenderContext(nextRenderContext);
      }
      prevRenderContext.current = nextRenderContext;
    } else {
      canUpdateInnerPosition = true;
    }

    // Pass directly the render context to avoid waiting for the next render
    if (nextRenderContext && canUpdateInnerPosition) {
      updateInnerPosition(nextRenderContext);
    }
  }, [updateInnerPosition]);
  const handleColumnResizeStart = React.useCallback(params => setResizeCol(params.field), []);
  const handleColumnResizeStop = React.useCallback(() => setResizeCol(''), []);
  const handleColumnReorderStart = React.useCallback(params => setDragCol(params.field), []);
  const handleColumnReorderStop = React.useCallback(() => setDragCol(''), []);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnResizeStart', handleColumnResizeStart);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnResizeStop', handleColumnResizeStop);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'scrollPositionChange', handleScroll);

  // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
  const getColumnsToRender = params => {
    const {
      renderContext: nextRenderContext = renderContext,
      minFirstColumn = minColumnIndex,
      maxLastColumn = visibleColumns.length
    } = params || {};
    if (!nextRenderContext) {
      return null;
    }
    const [firstRowToRender, lastRowToRender] = (0, _useGridVirtualScroller.getRenderableIndexes)({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    const firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minFirstColumn,
      columnBuffer: rootProps.columnBuffer,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const lastColumnToRender = Math.min(nextRenderContext.lastColumnIndex + rootProps.columnBuffer, maxLastColumn);
    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    return {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender,
      minFirstColumn,
      maxLastColumn
    };
  };
  const getColumnHeaders = (params, other = {}) => {
    const columnsToRender = getColumnsToRender(params);
    if (columnsToRender == null) {
      return null;
    }
    const {
      renderedColumns,
      firstColumnToRender
    } = columnsToRender;
    const columns = [];
    for (let i = 0; i < renderedColumns.length; i += 1) {
      const colDef = renderedColumns[i];
      const columnIndex = firstColumnToRender + i;
      const isFirstColumn = columnIndex === 0;
      const tabIndex = columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field || isFirstColumn && !hasOtherElementInTabSequence ? 0 : -1;
      const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;
      const open = columnMenuState.open && columnMenuState.field === colDef.field;
      columns.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderItem.GridColumnHeaderItem, (0, _extends2.default)({}, sortColumnLookup[colDef.field], {
        columnMenuOpen: open,
        filterItemsCounter: filterColumnLookup[colDef.field] && filterColumnLookup[colDef.field].length,
        headerHeight: headerHeight,
        isDragging: colDef.field === dragCol,
        colDef: colDef,
        colIndex: columnIndex,
        isResizing: resizeCol === colDef.field,
        hasFocus: hasFocus,
        tabIndex: tabIndex
      }, other), colDef.field));
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(GridColumnHeaderRow, {
      role: "row",
      "aria-rowindex": headerGroupingMaxDepth + 1,
      ownerState: rootProps,
      children: columns
    });
  };
  const getColumnGroupHeaders = params => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }
    const columnsToRender = getColumnsToRender(params);
    if (columnsToRender == null || columnsToRender.renderedColumns.length === 0) {
      return null;
    }
    const {
      firstColumnToRender,
      lastColumnToRender
    } = columnsToRender;
    const columns = [];
    const headerToRender = [];
    for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      const rowStructure = columnGroupsHeaderStructure[depth];
      const firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
      const firstGroupToRender = apiRef.current.unstable_getColumnGroupPath(firstColumnFieldToRender)[depth] ?? null;
      const firstGroupIndex = rowStructure.findIndex(({
        groupId,
        columnFields
      }) => groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender));
      const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
      const lastGroupToRender = apiRef.current.unstable_getColumnGroupPath(lastColumnFieldToRender)[depth] ?? null;
      const lastGroupIndex = rowStructure.findIndex(({
        groupId,
        columnFields
      }) => groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender));
      const visibleColumnGroupHeader = rowStructure.slice(firstGroupIndex, lastGroupIndex + 1).map(groupStructure => {
        return (0, _extends2.default)({}, groupStructure, {
          columnFields: groupStructure.columnFields.filter(field => columnVisibility[field] !== false)
        });
      }).filter(groupStructure => groupStructure.columnFields.length > 0);
      const firstVisibleColumnIndex = visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
      const hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(0, firstVisibleColumnIndex);
      const leftOverflow = hiddenGroupColumns.reduce((acc, field) => {
        const column = apiRef.current.getColumn(field);
        return acc + (column.computedWidth ?? 0);
      }, 0);
      let columnIndex = firstColumnToRender;
      const elements = visibleColumnGroupHeader.map(({
        groupId,
        columnFields
      }) => {
        const hasFocus = columnGroupHeaderFocus !== null && columnGroupHeaderFocus.depth === depth && columnFields.includes(columnGroupHeaderFocus.field);
        const tabIndex = columnGroupHeaderTabIndexState !== null && columnGroupHeaderTabIndexState.depth === depth && columnFields.includes(columnGroupHeaderTabIndexState.field) ? 0 : -1;
        const headerInfo = {
          groupId,
          width: columnFields.map(field => apiRef.current.getColumn(field).computedWidth).reduce((acc, val) => acc + val, 0),
          fields: columnFields,
          colIndex: columnIndex,
          hasFocus,
          tabIndex
        };
        columnIndex += columnFields.length;
        return headerInfo;
      });
      headerToRender.push({
        leftOverflow,
        elements
      });
    }
    headerToRender.forEach((depthInfo, depthIndex) => {
      columns.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(GridColumnHeaderRow, {
        style: {
          height: `${headerHeight}px`,
          transform: `translateX(-${depthInfo.leftOverflow}px)`
        },
        role: "row",
        "aria-rowindex": depthIndex + 1,
        ownerState: rootProps,
        children: depthInfo.elements.map(({
          groupId,
          width,
          fields,
          colIndex,
          hasFocus,
          tabIndex
        }, groupIndex) => {
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnGroupHeader.GridColumnGroupHeader, {
            groupId: groupId,
            width: width,
            fields: fields,
            colIndex: colIndex,
            depth: depthIndex,
            isLastColumn: colIndex === visibleColumns.length - fields.length,
            maxDepth: headerToRender.length,
            height: headerHeight,
            hasFocus: hasFocus,
            tabIndex: tabIndex
          }, groupIndex);
        })
      }, depthIndex));
    });
    return columns;
  };
  const rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: `${headerHeight}px`
  };
  return {
    renderContext,
    getColumnHeaders,
    getColumnGroupHeaders,
    isDragging: !!dragCol,
    getRootProps: (other = {}) => (0, _extends2.default)({
      style: rootStyle
    }, other),
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup'
    })
  };
};
exports.useGridColumnHeaders = useGridColumnHeaders;