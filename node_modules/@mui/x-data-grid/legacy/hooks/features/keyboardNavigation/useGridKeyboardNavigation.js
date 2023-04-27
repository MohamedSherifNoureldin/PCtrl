import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { gridExpandedSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef/gridCheckboxSelectionColDef';
import { gridClasses } from '../../../constants/gridClasses';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../constants/gridDetailPanelToggleField';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';
import { unstable_gridFocusColumnGroupHeaderSelector } from '../focus';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../columnGrouping/gridColumnGroupsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
function enrichPageRowsWithPinnedRows(apiRef, rows) {
  var pinnedRows = gridPinnedRowsSelector(apiRef) || {};
  return [].concat(_toConsumableArray(pinnedRows.top || []), _toConsumableArray(rows), _toConsumableArray(pinnedRows.bottom || []));
}
var getLeftColumnIndex = function getLeftColumnIndex(_ref) {
  var currentColIndex = _ref.currentColIndex,
    firstColIndex = _ref.firstColIndex,
    lastColIndex = _ref.lastColIndex,
    direction = _ref.direction;
  if (direction === 'rtl') {
    if (currentColIndex < lastColIndex) {
      return currentColIndex + 1;
    }
  } else if (direction === 'ltr') {
    if (currentColIndex > firstColIndex) {
      return currentColIndex - 1;
    }
  }
  return null;
};
var getRightColumnIndex = function getRightColumnIndex(_ref2) {
  var currentColIndex = _ref2.currentColIndex,
    firstColIndex = _ref2.firstColIndex,
    lastColIndex = _ref2.lastColIndex,
    direction = _ref2.direction;
  if (direction === 'rtl') {
    if (currentColIndex > firstColIndex) {
      return currentColIndex - 1;
    }
  } else if (direction === 'ltr') {
    if (currentColIndex < lastColIndex) {
      return currentColIndex + 1;
    }
  }
  return null;
};

/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */
export var useGridKeyboardNavigation = function useGridKeyboardNavigation(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  var initialCurrentPageRows = useGridVisibleRows(apiRef, props).rows;
  var theme = useTheme();
  var currentPageRows = React.useMemo(function () {
    return enrichPageRowsWithPinnedRows(apiRef, initialCurrentPageRows);
  }, [apiRef, initialCurrentPageRows]);

  /**
   * @param {number} colIndex Index of the column to focus
   * @param {number} rowIndex index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   * TODO replace with apiRef.current.moveFocusToRelativeCell()
   */
  var goToCell = React.useCallback(function (colIndex, rowId) {
    var closestColumnToUse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
    var visibleSortedRows = gridExpandedSortedRowEntriesSelector(apiRef);
    var nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);
    if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
      if (closestColumnToUse === 'left') {
        colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
      } else if (closestColumnToUse === 'right') {
        colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
      }
    }
    // `scrollToIndexes` requires a rowIndex relative to all visible rows.
    // Those rows do not include pinned rows, but pinned rows do not need scroll anyway.
    var rowIndexRelativeToAllRows = visibleSortedRows.findIndex(function (row) {
      return row.id === rowId;
    });
    logger.debug("Navigating to cell row ".concat(rowIndexRelativeToAllRows, ", col ").concat(colIndex));
    apiRef.current.scrollToIndexes({
      colIndex: colIndex,
      rowIndex: rowIndexRelativeToAllRows
    });
    var field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setCellFocus(rowId, field);
  }, [apiRef, logger]);
  var goToHeader = React.useCallback(function (colIndex, event) {
    logger.debug("Navigating to header col ".concat(colIndex));
    apiRef.current.scrollToIndexes({
      colIndex: colIndex
    });
    var field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setColumnHeaderFocus(field, event);
  }, [apiRef, logger]);
  var goToGroupHeader = React.useCallback(function (colIndex, depth, event) {
    logger.debug("Navigating to header col ".concat(colIndex));
    apiRef.current.scrollToIndexes({
      colIndex: colIndex
    });
    var field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setColumnGroupHeaderFocus(field, depth, event);
  }, [apiRef, logger]);
  var getRowIdFromIndex = React.useCallback(function (rowIndex) {
    return currentPageRows[rowIndex].id;
  }, [currentPageRows]);
  var handleColumnHeaderKeyDown = React.useCallback(function (params, event) {
    var headerTitleNode = event.currentTarget.querySelector(".".concat(gridClasses.columnHeaderTitleContainerContent));
    var isFromInsideContent = !!headerTitleNode && headerTitleNode.contains(event.target);
    if (isFromInsideContent && params.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      // When focus is on a nested input, keyboard events have no effect to avoid conflicts with native events.
      // There is one exception for the checkBoxHeader
      return;
    }
    var dimensions = apiRef.current.getRootDimensions();
    if (!dimensions) {
      return;
    }
    var viewportPageSize = apiRef.current.getViewportPageSize();
    var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    var firstRowIndexInPage = 0;
    var lastRowIndexInPage = currentPageRows.length - 1;
    var firstColIndex = 0;
    var lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    var columnGroupMaxDepth = gridColumnGroupsHeaderMaxDepthSelector(apiRef);
    var shouldPreventDefault = true;
    switch (event.key) {
      case 'ArrowDown':
        {
          if (firstRowIndexInPage !== null) {
            goToCell(colIndexBefore, getRowIdFromIndex(firstRowIndexInPage));
          }
          break;
        }
      case 'ArrowRight':
        {
          var rightColIndex = getRightColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex: firstColIndex,
            lastColIndex: lastColIndex,
            direction: theme.direction
          });
          if (rightColIndex !== null) {
            goToHeader(rightColIndex, event);
          }
          break;
        }
      case 'ArrowLeft':
        {
          var leftColIndex = getLeftColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex: firstColIndex,
            lastColIndex: lastColIndex,
            direction: theme.direction
          });
          if (leftColIndex !== null) {
            goToHeader(leftColIndex, event);
          }
          break;
        }
      case 'ArrowUp':
        {
          if (columnGroupMaxDepth > 0) {
            goToGroupHeader(colIndexBefore, columnGroupMaxDepth - 1, event);
          }
          break;
        }
      case 'PageDown':
        {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage)));
          }
          break;
        }
      case 'Home':
        {
          goToHeader(firstColIndex, event);
          break;
        }
      case 'End':
        {
          goToHeader(lastColIndex, event);
          break;
        }
      case 'Enter':
        {
          if (event.ctrlKey || event.metaKey) {
            apiRef.current.toggleColumnMenu(params.field);
          }
          break;
        }
      case ' ':
        {
          // prevent Space event from scrolling
          break;
        }
      default:
        {
          shouldPreventDefault = false;
        }
    }
    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, currentPageRows.length, theme.direction, goToCell, getRowIdFromIndex, goToHeader, goToGroupHeader]);
  var focusedColumnGroup = useGridSelector(apiRef, unstable_gridFocusColumnGroupHeaderSelector);
  var handleColumnGroupHeaderKeyDown = React.useCallback(function (params, event) {
    var dimensions = apiRef.current.getRootDimensions();
    if (!dimensions) {
      return;
    }
    if (focusedColumnGroup === null) {
      return;
    }
    var currentField = focusedColumnGroup.field,
      currentDepth = focusedColumnGroup.depth;
    var fields = params.fields,
      depth = params.depth,
      maxDepth = params.maxDepth;
    var viewportPageSize = apiRef.current.getViewportPageSize();
    var currentColIndex = apiRef.current.getColumnIndex(currentField);
    var colIndexBefore = currentField ? apiRef.current.getColumnIndex(currentField) : 0;
    var firstRowIndexInPage = 0;
    var lastRowIndexInPage = currentPageRows.length - 1;
    var firstColIndex = 0;
    var lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    var shouldPreventDefault = true;
    switch (event.key) {
      case 'ArrowDown':
        {
          if (depth === maxDepth - 1) {
            goToHeader(currentColIndex, event);
          } else {
            goToGroupHeader(currentColIndex, currentDepth + 1, event);
          }
          break;
        }
      case 'ArrowUp':
        {
          if (depth > 0) {
            goToGroupHeader(currentColIndex, currentDepth - 1, event);
          }
          break;
        }
      case 'ArrowRight':
        {
          var remainingRightColumns = fields.length - fields.indexOf(currentField) - 1;
          if (currentColIndex + remainingRightColumns + 1 <= lastColIndex) {
            goToGroupHeader(currentColIndex + remainingRightColumns + 1, currentDepth, event);
          }
          break;
        }
      case 'ArrowLeft':
        {
          var remainingLeftColumns = fields.indexOf(currentField);
          if (currentColIndex - remainingLeftColumns - 1 >= firstColIndex) {
            goToGroupHeader(currentColIndex - remainingLeftColumns - 1, currentDepth, event);
          }
          break;
        }
      case 'PageDown':
        {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage)));
          }
          break;
        }
      case 'Home':
        {
          goToGroupHeader(firstColIndex, currentDepth, event);
          break;
        }
      case 'End':
        {
          goToGroupHeader(lastColIndex, currentDepth, event);
          break;
        }
      case ' ':
        {
          // prevent Space event from scrolling
          break;
        }
      default:
        {
          shouldPreventDefault = false;
        }
    }
    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, focusedColumnGroup, currentPageRows.length, goToHeader, goToGroupHeader, goToCell, getRowIdFromIndex]);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    // Ignore portal
    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    // Get the most recent params because the cell mode may have changed by another listener
    var cellParams = apiRef.current.getCellParams(params.id, params.field);
    if (cellParams.cellMode === GridCellModes.Edit || !isNavigationKey(event.key)) {
      return;
    }
    var canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
      event: event,
      cell: cellParams
    });
    if (!canUpdateFocus) {
      return;
    }
    var dimensions = apiRef.current.getRootDimensions();
    if (currentPageRows.length === 0 || !dimensions) {
      return;
    }
    var direction = theme.direction;
    var viewportPageSize = apiRef.current.getViewportPageSize();
    var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    var rowIndexBefore = currentPageRows.findIndex(function (row) {
      return row.id === params.id;
    });
    var firstRowIndexInPage = 0;
    var lastRowIndexInPage = currentPageRows.length - 1;
    var firstColIndex = 0;
    var lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    var shouldPreventDefault = true;
    switch (event.key) {
      case 'ArrowDown':
        {
          // "Enter" is only triggered by the row / cell editing feature
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore + 1));
          }
          break;
        }
      case 'ArrowUp':
        {
          if (rowIndexBefore > firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore - 1));
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }
      case 'ArrowRight':
        {
          var rightColIndex = getRightColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex: firstColIndex,
            lastColIndex: lastColIndex,
            direction: direction
          });
          if (rightColIndex !== null) {
            goToCell(rightColIndex, getRowIdFromIndex(rowIndexBefore), direction === 'rtl' ? 'left' : 'right');
          }
          break;
        }
      case 'ArrowLeft':
        {
          var leftColIndex = getLeftColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex: firstColIndex,
            lastColIndex: lastColIndex,
            direction: direction
          });
          if (leftColIndex !== null) {
            goToCell(leftColIndex, getRowIdFromIndex(rowIndexBefore), direction === 'rtl' ? 'right' : 'left');
          }
          break;
        }
      case 'Tab':
        {
          // "Tab" is only triggered by the row / cell editing feature
          if (event.shiftKey && colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore), 'left');
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
          }
          break;
        }
      case ' ':
        {
          var field = params.field;
          if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
            break;
          }
          var colDef = params.colDef;
          if (colDef && colDef.type === 'treeDataGroup') {
            break;
          }
          if (!event.shiftKey && rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)));
          }
          break;
        }
      case 'PageDown':
        {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)));
          }
          break;
        }
      case 'PageUp':
        {
          // Go to the first row before going to header
          var nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);
          if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(nextRowIndex));
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }
      case 'Home':
        {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(firstColIndex, getRowIdFromIndex(firstRowIndexInPage));
          } else {
            goToCell(firstColIndex, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }
      case 'End':
        {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(lastColIndex, getRowIdFromIndex(lastRowIndexInPage));
          } else {
            goToCell(lastColIndex, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }
      default:
        {
          shouldPreventDefault = false;
        }
    }
    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, currentPageRows, theme.direction, getRowIdFromIndex, goToCell, goToHeader]);
  useGridApiEventHandler(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'columnGroupHeaderKeyDown', handleColumnGroupHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};