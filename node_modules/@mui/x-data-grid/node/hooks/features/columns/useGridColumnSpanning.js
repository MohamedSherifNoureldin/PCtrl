"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridColumnSpanning = void 0;
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
const useGridColumnSpanning = apiRef => {
  const lookup = React.useRef({});
  const setCellColSpanInfo = React.useCallback((rowId, columnIndex, cellColSpanInfo) => {
    const sizes = lookup.current;
    if (!sizes[rowId]) {
      sizes[rowId] = {};
    }
    sizes[rowId][columnIndex] = cellColSpanInfo;
  }, []);
  const getCellColSpanInfo = React.useCallback((rowId, columnIndex) => {
    return lookup.current[rowId]?.[columnIndex];
  }, []);

  // Calculate `colSpan` for the cell.
  const calculateCellColSpan = React.useCallback(params => {
    const {
      columnIndex,
      rowId,
      minFirstColumnIndex,
      maxLastColumnIndex,
      columns
    } = params;
    const columnsLength = columns.length;
    const column = columns[columnIndex];
    const colSpan = typeof column.colSpan === 'function' ? column.colSpan(apiRef.current.getCellParams(rowId, column.field)) : column.colSpan;
    if (!colSpan || colSpan === 1) {
      setCellColSpanInfo(rowId, columnIndex, {
        spannedByColSpan: false,
        cellProps: {
          colSpan: 1,
          width: column.computedWidth
        }
      });
      return {
        colSpan: 1
      };
    }
    let width = column.computedWidth;
    for (let j = 1; j < colSpan; j += 1) {
      const nextColumnIndex = columnIndex + j;
      // Cells should be spanned only within their column section (left-pinned, right-pinned and unpinned).
      if (nextColumnIndex >= minFirstColumnIndex && nextColumnIndex < maxLastColumnIndex) {
        const nextColumn = columns[nextColumnIndex];
        width += nextColumn.computedWidth;
        setCellColSpanInfo(rowId, columnIndex + j, {
          spannedByColSpan: true,
          rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
          leftVisibleCellIndex: columnIndex
        });
      }
      setCellColSpanInfo(rowId, columnIndex, {
        spannedByColSpan: false,
        cellProps: {
          colSpan,
          width
        }
      });
    }
    return {
      colSpan
    };
  }, [apiRef, setCellColSpanInfo]);

  // Calculate `colSpan` for each cell in the row
  const calculateColSpan = React.useCallback(({
    rowId,
    minFirstColumn,
    maxLastColumn,
    columns
  }) => {
    for (let i = minFirstColumn; i < maxLastColumn; i += 1) {
      const cellProps = calculateCellColSpan({
        columnIndex: i,
        rowId,
        minFirstColumnIndex: minFirstColumn,
        maxLastColumnIndex: maxLastColumn,
        columns
      });
      if (cellProps.colSpan > 1) {
        i += cellProps.colSpan - 1;
      }
    }
  }, [calculateCellColSpan]);
  const columnSpanningPublicApi = {
    unstable_getCellColSpanInfo: getCellColSpanInfo
  };
  const columnSpanningPrivateApi = {
    calculateColSpan
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, columnSpanningPublicApi, 'public');
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, columnSpanningPrivateApi, 'private');
  const handleColumnReorderChange = React.useCallback(() => {
    // `colSpan` needs to be recalculated after column reordering
    lookup.current = {};
  }, []);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnOrderChange', handleColumnReorderChange);
};
exports.useGridColumnSpanning = useGridColumnSpanning;