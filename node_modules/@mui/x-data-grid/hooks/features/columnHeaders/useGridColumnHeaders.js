import _extends from "@babel/runtime/helpers/esm/extends";
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
const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (props, styles) => styles.columnHeaderRow
})(() => ({
  display: 'flex'
}));
function isUIEvent(event) {
  return !!event.target;
}
export const useGridColumnHeaders = props => {
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
  const theme = useTheme();
  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const innerRef = React.useRef(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const [renderContext, setRenderContext] = React.useState(null);
  const prevRenderContext = React.useRef(renderContext);
  const prevScrollLeft = React.useRef(0);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const totalHeaderHeight = getTotalHeaderHeight(apiRef, rootProps.columnHeaderHeight);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);
  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
  }, [apiRef]);

  // memoize `getFirstColumnIndexToRender`, since it's called on scroll
  const getFirstColumnIndexToRenderRef = React.useRef(defaultMemoize(getFirstColumnIndexToRender, {
    equalityCheck: (a, b) => ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every(key => a[key] === b[key])
  }));
  const updateInnerPosition = React.useCallback(nextRenderContext => {
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
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
    var _prevRenderContext$cu, _prevRenderContext$cu2;
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
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);
  useGridApiEventHandler(apiRef, 'scrollPositionChange', handleScroll);

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
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
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
      var _apiRef$current$unsta, _apiRef$current$unsta2;
      const rowStructure = columnGroupsHeaderStructure[depth];
      const firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
      const firstGroupToRender = (_apiRef$current$unsta = apiRef.current.unstable_getColumnGroupPath(firstColumnFieldToRender)[depth]) != null ? _apiRef$current$unsta : null;
      const firstGroupIndex = rowStructure.findIndex(({
        groupId,
        columnFields
      }) => groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender));
      const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
      const lastGroupToRender = (_apiRef$current$unsta2 = apiRef.current.unstable_getColumnGroupPath(lastColumnFieldToRender)[depth]) != null ? _apiRef$current$unsta2 : null;
      const lastGroupIndex = rowStructure.findIndex(({
        groupId,
        columnFields
      }) => groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender));
      const visibleColumnGroupHeader = rowStructure.slice(firstGroupIndex, lastGroupIndex + 1).map(groupStructure => {
        return _extends({}, groupStructure, {
          columnFields: groupStructure.columnFields.filter(field => columnVisibility[field] !== false)
        });
      }).filter(groupStructure => groupStructure.columnFields.length > 0);
      const firstVisibleColumnIndex = visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
      const hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(0, firstVisibleColumnIndex);
      const leftOverflow = hiddenGroupColumns.reduce((acc, field) => {
        var _column$computedWidth;
        const column = apiRef.current.getColumn(field);
        return acc + ((_column$computedWidth = column.computedWidth) != null ? _column$computedWidth : 0);
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
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderRow, {
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
    getRootProps: (other = {}) => _extends({
      style: rootStyle
    }, other),
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup'
    })
  };
};