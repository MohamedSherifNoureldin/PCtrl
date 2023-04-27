import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { styled, useTheme } from '@mui/system';
import { defaultMemoize } from 'reselect';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { getFirstColumnIndexToRender, getTotalHeaderHeight } from '../columns/gridColumnsUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { getRenderableIndexes } from '../virtualization/useGridVirtualScroller';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';
import { jsx as _jsx } from "react/jsx-runtime";
var GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.columnHeaderRow;
  }
})(function () {
  return {
    display: 'flex'
  };
});
function isUIEvent(event) {
  return !!event.target;
}
export var useGridColumnHeaders = function useGridColumnHeaders(props) {
  var innerRefProp = props.innerRef,
    _props$minColumnIndex = props.minColumnIndex,
    minColumnIndex = _props$minColumnIndex === void 0 ? 0 : _props$minColumnIndex,
    visibleColumns = props.visibleColumns,
    sortColumnLookup = props.sortColumnLookup,
    filterColumnLookup = props.filterColumnLookup,
    columnPositions = props.columnPositions,
    columnHeaderTabIndexState = props.columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState = props.columnGroupHeaderTabIndexState,
    columnHeaderFocus = props.columnHeaderFocus,
    columnGroupHeaderFocus = props.columnGroupHeaderFocus,
    densityFactor = props.densityFactor,
    headerGroupingMaxDepth = props.headerGroupingMaxDepth,
    columnMenuState = props.columnMenuState,
    columnVisibility = props.columnVisibility,
    columnGroupsHeaderStructure = props.columnGroupsHeaderStructure,
    hasOtherElementInTabSequence = props.hasOtherElementInTabSequence;
  var theme = useTheme();
  var _React$useState = React.useState(''),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    dragCol = _React$useState2[0],
    setDragCol = _React$useState2[1];
  var _React$useState3 = React.useState(''),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    resizeCol = _React$useState4[0],
    setResizeCol = _React$useState4[1];
  var apiRef = useGridPrivateApiContext();
  var rootProps = useGridRootProps();
  var innerRef = React.useRef(null);
  var handleInnerRef = useForkRef(innerRefProp, innerRef);
  var _React$useState5 = React.useState(null),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    renderContext = _React$useState6[0],
    setRenderContext = _React$useState6[1];
  var prevRenderContext = React.useRef(renderContext);
  var prevScrollLeft = React.useRef(0);
  var currentPage = useGridVisibleRows(apiRef, rootProps);
  var totalHeaderHeight = getTotalHeaderHeight(apiRef, rootProps.columnHeaderHeight);
  var headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);
  React.useEffect(function () {
    apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
  }, [apiRef]);

  // memoize `getFirstColumnIndexToRender`, since it's called on scroll
  var getFirstColumnIndexToRenderRef = React.useRef(defaultMemoize(getFirstColumnIndexToRender, {
    equalityCheck: function equalityCheck(a, b) {
      return ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every(function (key) {
        return a[key] === b[key];
      });
    }
  }));
  var updateInnerPosition = React.useCallback(function (nextRenderContext) {
    var _getRenderableIndexes = getRenderableIndexes({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer
      }),
      _getRenderableIndexes2 = _slicedToArray(_getRenderableIndexes, 2),
      firstRowToRender = _getRenderableIndexes2[0],
      lastRowToRender = _getRenderableIndexes2[1];
    var firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minColumnIndex,
      columnBuffer: rootProps.columnBuffer,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      apiRef: apiRef,
      visibleRows: currentPage.rows
    });
    var direction = theme.direction === 'ltr' ? 1 : -1;
    var offset = firstColumnToRender > 0 ? prevScrollLeft.current - direction * columnPositions[firstColumnToRender] : prevScrollLeft.current;
    innerRef.current.style.transform = "translate3d(".concat(-offset, "px, 0px, 0px)");
  }, [columnPositions, minColumnIndex, rootProps.columnBuffer, apiRef, currentPage.rows, rootProps.rowBuffer, theme.direction]);
  React.useLayoutEffect(function () {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);
  var handleScroll = React.useCallback(function (_ref, event) {
    var _prevRenderContext$cu, _prevRenderContext$cu2;
    var left = _ref.left,
      _ref$renderContext = _ref.renderContext,
      nextRenderContext = _ref$renderContext === void 0 ? null : _ref$renderContext;
    if (!innerRef.current) {
      return;
    }

    // Ignore vertical scroll.
    // Excepts the first event which sets the previous render context.
    if (prevScrollLeft.current === left && ((_prevRenderContext$cu = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu.firstColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.firstColumnIndex) && ((_prevRenderContext$cu2 = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu2.lastColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.lastColumnIndex)) {
      return;
    }
    prevScrollLeft.current = left;

    // We can only update the position when we guarantee that the render context has been
    // rendered. This is achieved using ReactDOM.flushSync or when the context doesn't change.
    var canUpdateInnerPosition = false;
    if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
      // ReactDOM.flushSync cannot be called on `scroll` events fired inside effects
      if (isUIEvent(event)) {
        // To prevent flickering, the inner position can only be updated after the new context has
        // been rendered. ReactDOM.flushSync ensures that the state changes will happen before
        // updating the position.
        ReactDOM.flushSync(function () {
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
  var handleColumnResizeStart = React.useCallback(function (params) {
    return setResizeCol(params.field);
  }, []);
  var handleColumnResizeStop = React.useCallback(function () {
    return setResizeCol('');
  }, []);
  var handleColumnReorderStart = React.useCallback(function (params) {
    return setDragCol(params.field);
  }, []);
  var handleColumnReorderStop = React.useCallback(function () {
    return setDragCol('');
  }, []);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);
  useGridApiEventHandler(apiRef, 'scrollPositionChange', handleScroll);

  // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
  var getColumnsToRender = function getColumnsToRender(params) {
    var _ref2 = params || {},
      _ref2$renderContext = _ref2.renderContext,
      nextRenderContext = _ref2$renderContext === void 0 ? renderContext : _ref2$renderContext,
      _ref2$minFirstColumn = _ref2.minFirstColumn,
      minFirstColumn = _ref2$minFirstColumn === void 0 ? minColumnIndex : _ref2$minFirstColumn,
      _ref2$maxLastColumn = _ref2.maxLastColumn,
      maxLastColumn = _ref2$maxLastColumn === void 0 ? visibleColumns.length : _ref2$maxLastColumn;
    if (!nextRenderContext) {
      return null;
    }
    var _getRenderableIndexes3 = getRenderableIndexes({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer
      }),
      _getRenderableIndexes4 = _slicedToArray(_getRenderableIndexes3, 2),
      firstRowToRender = _getRenderableIndexes4[0],
      lastRowToRender = _getRenderableIndexes4[1];
    var firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minFirstColumn,
      columnBuffer: rootProps.columnBuffer,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var lastColumnToRender = Math.min(nextRenderContext.lastColumnIndex + rootProps.columnBuffer, maxLastColumn);
    var renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    return {
      renderedColumns: renderedColumns,
      firstColumnToRender: firstColumnToRender,
      lastColumnToRender: lastColumnToRender,
      minFirstColumn: minFirstColumn,
      maxLastColumn: maxLastColumn
    };
  };
  var getColumnHeaders = function getColumnHeaders(params) {
    var other = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var columnsToRender = getColumnsToRender(params);
    if (columnsToRender == null) {
      return null;
    }
    var renderedColumns = columnsToRender.renderedColumns,
      firstColumnToRender = columnsToRender.firstColumnToRender;
    var columns = [];
    for (var i = 0; i < renderedColumns.length; i += 1) {
      var colDef = renderedColumns[i];
      var columnIndex = firstColumnToRender + i;
      var isFirstColumn = columnIndex === 0;
      var tabIndex = columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field || isFirstColumn && !hasOtherElementInTabSequence ? 0 : -1;
      var hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;
      var open = columnMenuState.open && columnMenuState.field === colDef.field;
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderItem, _extends({}, sortColumnLookup[colDef.field], {
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
    return /*#__PURE__*/_jsx(GridColumnHeaderRow, {
      role: "row",
      "aria-rowindex": headerGroupingMaxDepth + 1,
      ownerState: rootProps,
      children: columns
    });
  };
  var getColumnGroupHeaders = function getColumnGroupHeaders(params) {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }
    var columnsToRender = getColumnsToRender(params);
    if (columnsToRender == null || columnsToRender.renderedColumns.length === 0) {
      return null;
    }
    var firstColumnToRender = columnsToRender.firstColumnToRender,
      lastColumnToRender = columnsToRender.lastColumnToRender;
    var columns = [];
    var headerToRender = [];
    var _loop = function _loop(depth) {
      var _apiRef$current$unsta, _apiRef$current$unsta2;
      var rowStructure = columnGroupsHeaderStructure[depth];
      var firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
      var firstGroupToRender = (_apiRef$current$unsta = apiRef.current.unstable_getColumnGroupPath(firstColumnFieldToRender)[depth]) != null ? _apiRef$current$unsta : null;
      var firstGroupIndex = rowStructure.findIndex(function (_ref4) {
        var groupId = _ref4.groupId,
          columnFields = _ref4.columnFields;
        return groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender);
      });
      var lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
      var lastGroupToRender = (_apiRef$current$unsta2 = apiRef.current.unstable_getColumnGroupPath(lastColumnFieldToRender)[depth]) != null ? _apiRef$current$unsta2 : null;
      var lastGroupIndex = rowStructure.findIndex(function (_ref5) {
        var groupId = _ref5.groupId,
          columnFields = _ref5.columnFields;
        return groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender);
      });
      var visibleColumnGroupHeader = rowStructure.slice(firstGroupIndex, lastGroupIndex + 1).map(function (groupStructure) {
        return _extends({}, groupStructure, {
          columnFields: groupStructure.columnFields.filter(function (field) {
            return columnVisibility[field] !== false;
          })
        });
      }).filter(function (groupStructure) {
        return groupStructure.columnFields.length > 0;
      });
      var firstVisibleColumnIndex = visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
      var hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(0, firstVisibleColumnIndex);
      var leftOverflow = hiddenGroupColumns.reduce(function (acc, field) {
        var _column$computedWidth;
        var column = apiRef.current.getColumn(field);
        return acc + ((_column$computedWidth = column.computedWidth) != null ? _column$computedWidth : 0);
      }, 0);
      var columnIndex = firstColumnToRender;
      var elements = visibleColumnGroupHeader.map(function (_ref6) {
        var groupId = _ref6.groupId,
          columnFields = _ref6.columnFields;
        var hasFocus = columnGroupHeaderFocus !== null && columnGroupHeaderFocus.depth === depth && columnFields.includes(columnGroupHeaderFocus.field);
        var tabIndex = columnGroupHeaderTabIndexState !== null && columnGroupHeaderTabIndexState.depth === depth && columnFields.includes(columnGroupHeaderTabIndexState.field) ? 0 : -1;
        var headerInfo = {
          groupId: groupId,
          width: columnFields.map(function (field) {
            return apiRef.current.getColumn(field).computedWidth;
          }).reduce(function (acc, val) {
            return acc + val;
          }, 0),
          fields: columnFields,
          colIndex: columnIndex,
          hasFocus: hasFocus,
          tabIndex: tabIndex
        };
        columnIndex += columnFields.length;
        return headerInfo;
      });
      headerToRender.push({
        leftOverflow: leftOverflow,
        elements: elements
      });
    };
    for (var depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      _loop(depth);
    }
    headerToRender.forEach(function (depthInfo, depthIndex) {
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderRow, {
        style: {
          height: "".concat(headerHeight, "px"),
          transform: "translateX(-".concat(depthInfo.leftOverflow, "px)")
        },
        role: "row",
        "aria-rowindex": depthIndex + 1,
        ownerState: rootProps,
        children: depthInfo.elements.map(function (_ref3, groupIndex) {
          var groupId = _ref3.groupId,
            width = _ref3.width,
            fields = _ref3.fields,
            colIndex = _ref3.colIndex,
            hasFocus = _ref3.hasFocus,
            tabIndex = _ref3.tabIndex;
          return /*#__PURE__*/_jsx(GridColumnGroupHeader, {
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
  var rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: "".concat(headerHeight, "px")
  };
  return {
    renderContext: renderContext,
    getColumnHeaders: getColumnHeaders,
    getColumnGroupHeaders: getColumnGroupHeaders,
    isDragging: !!dragCol,
    getRootProps: function getRootProps() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _extends({
        style: rootStyle
      }, other);
    },
    getInnerProps: function getInnerProps() {
      return {
        ref: handleInnerRef,
        role: 'rowgroup'
      };
    }
  };
};