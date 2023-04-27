import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_ownerDocument as ownerDocument } from '@mui/utils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { gridFocusCellSelector, unstable_gridFocusColumnGroupHeaderSelector } from './gridFocusStateSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { clamp } from '../../../utils/utils';
export const focusStateInitializer = state => _extends({}, state, {
  focus: {
    cell: null,
    columnHeader: null,
    columnGroupHeader: null
  },
  tabIndex: {
    cell: null,
    columnHeader: null,
    columnGroupHeader: null
  }
});

/**
 * @requires useGridParamsApi (method)
 * @requires useGridRows (method)
 * @requires useGridEditing (event)
 */
export const useGridFocus = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useGridFocus');
  const lastClickedCell = React.useRef(null);
  const publishCellFocusOut = React.useCallback((cell, event) => {
    if (cell) {
      // The row might have been deleted
      if (apiRef.current.getRow(cell.id)) {
        apiRef.current.publishEvent('cellFocusOut', apiRef.current.getCellParams(cell.id, cell.field), event);
      }
    }
  }, [apiRef]);
  const setCellFocus = React.useCallback((id, field) => {
    const focusedCell = gridFocusCellSelector(apiRef);
    if (focusedCell?.id === id && focusedCell?.field === field) {
      return;
    }
    apiRef.current.setState(state => {
      logger.debug(`Focusing on cell with id=${id} and field=${field}`);
      return _extends({}, state, {
        tabIndex: {
          cell: {
            id,
            field
          },
          columnHeader: null,
          columnGroupHeader: null
        },
        focus: {
          cell: {
            id,
            field
          },
          columnHeader: null,
          columnGroupHeader: null
        }
      });
    });
    apiRef.current.forceUpdate();

    // The row might have been deleted
    if (!apiRef.current.getRow(id)) {
      return;
    }
    if (focusedCell) {
      // There's a focused cell but another cell was clicked
      // Publishes an event to notify that the focus was lost
      publishCellFocusOut(focusedCell, {});
    }
    apiRef.current.publishEvent('cellFocusIn', apiRef.current.getCellParams(id, field));
  }, [apiRef, logger, publishCellFocusOut]);
  const setColumnHeaderFocus = React.useCallback((field, event = {}) => {
    const cell = gridFocusCellSelector(apiRef);
    publishCellFocusOut(cell, event);
    apiRef.current.setState(state => {
      logger.debug(`Focusing on column header with colIndex=${field}`);
      return _extends({}, state, {
        tabIndex: {
          columnHeader: {
            field
          },
          cell: null,
          columnGroupHeader: null
        },
        focus: {
          columnHeader: {
            field
          },
          cell: null,
          columnGroupHeader: null
        }
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef, logger, publishCellFocusOut]);
  const setColumnGroupHeaderFocus = React.useCallback((field, depth, event = {}) => {
    const cell = gridFocusCellSelector(apiRef);
    if (cell) {
      apiRef.current.publishEvent('cellFocusOut', apiRef.current.getCellParams(cell.id, cell.field), event);
    }
    apiRef.current.setState(state => {
      return _extends({}, state, {
        tabIndex: {
          columnGroupHeader: {
            field,
            depth
          },
          columnHeader: null,
          cell: null
        },
        focus: {
          columnGroupHeader: {
            field,
            depth
          },
          columnHeader: null,
          cell: null
        }
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  const getColumnGroupHeaderFocus = React.useCallback(() => unstable_gridFocusColumnGroupHeaderSelector(apiRef), [apiRef]);
  const moveFocusToRelativeCell = React.useCallback((id, field, direction) => {
    let columnIndexToFocus = apiRef.current.getColumnIndex(field);
    let rowIndexToFocus = apiRef.current.getRowIndexRelativeToVisibleRows(id);
    const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
    if (direction === 'right') {
      columnIndexToFocus += 1;
    } else if (direction === 'left') {
      columnIndexToFocus -= 1;
    } else {
      rowIndexToFocus += 1;
    }
    const currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode
    });
    if (columnIndexToFocus >= visibleColumns.length) {
      // Go to next row if we are after the last column
      rowIndexToFocus += 1;
      if (rowIndexToFocus < currentPage.rows.length) {
        // Go to first column of the next row if there's one more row
        columnIndexToFocus = 0;
      }
    } else if (columnIndexToFocus < 0) {
      // Go to previous row if we are before the first column
      rowIndexToFocus -= 1;
      if (rowIndexToFocus >= 0) {
        // Go to last column of the previous if there's one more row
        columnIndexToFocus = visibleColumns.length - 1;
      }
    }
    rowIndexToFocus = clamp(rowIndexToFocus, 0, currentPage.rows.length - 1);
    const rowToFocus = currentPage.rows[rowIndexToFocus];
    const colSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowToFocus.id, columnIndexToFocus);
    if (colSpanInfo && colSpanInfo.spannedByColSpan) {
      if (direction === 'left' || direction === 'below') {
        columnIndexToFocus = colSpanInfo.leftVisibleCellIndex;
      } else if (direction === 'right') {
        columnIndexToFocus = colSpanInfo.rightVisibleCellIndex;
      }
    }
    columnIndexToFocus = clamp(columnIndexToFocus, 0, visibleColumns.length - 1);
    const columnToFocus = visibleColumns[columnIndexToFocus];
    apiRef.current.setCellFocus(rowToFocus.id, columnToFocus.field);
  }, [apiRef, props.pagination, props.paginationMode]);
  const handleCellDoubleClick = React.useCallback(({
    id,
    field
  }) => {
    apiRef.current.setCellFocus(id, field);
  }, [apiRef]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    // GRID_CELL_NAVIGATION_KEY_DOWN handles the focus on Enter, Tab and navigation keys
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === 'Shift' || isNavigationKey(event.key)) {
      return;
    }
    apiRef.current.setCellFocus(params.id, params.field);
  }, [apiRef]);
  const handleColumnHeaderFocus = React.useCallback(({
    field
  }, event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    apiRef.current.setColumnHeaderFocus(field, event);
  }, [apiRef]);
  const focussedColumnGroup = unstable_gridFocusColumnGroupHeaderSelector(apiRef);
  const handleColumnGroupHeaderFocus = React.useCallback(({
    fields,
    depth
  }, event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (focussedColumnGroup !== null && focussedColumnGroup.depth === depth && fields.includes(focussedColumnGroup.field)) {
      // This group cell has already been focused
      return;
    }
    apiRef.current.setColumnGroupHeaderFocus(fields[0], depth, event);
  }, [apiRef, focussedColumnGroup]);
  const handleBlur = React.useCallback(() => {
    logger.debug(`Clearing focus`);
    apiRef.current.setState(state => _extends({}, state, {
      focus: {
        cell: null,
        columnHeader: null,
        columnGroupHeader: null
      }
    }));
  }, [logger, apiRef]);
  const handleCellMouseDown = React.useCallback(params => {
    lastClickedCell.current = params;
  }, []);
  const handleDocumentClick = React.useCallback(event => {
    const cellParams = lastClickedCell.current;
    lastClickedCell.current = null;
    const focusedCell = gridFocusCellSelector(apiRef);
    const canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
      event,
      cell: cellParams
    });
    if (!canUpdateFocus) {
      return;
    }
    if (!focusedCell) {
      if (cellParams) {
        apiRef.current.setCellFocus(cellParams.id, cellParams.field);
      }
      return;
    }
    if (cellParams?.id === focusedCell.id && cellParams?.field === focusedCell.field) {
      return;
    }
    const cellElement = apiRef.current.getCellElement(focusedCell.id, focusedCell.field);
    if (cellElement?.contains(event.target)) {
      return;
    }
    if (cellParams) {
      apiRef.current.setCellFocus(cellParams.id, cellParams.field);
    } else {
      apiRef.current.setState(state => _extends({}, state, {
        focus: {
          cell: null,
          columnHeader: null,
          columnGroupHeader: null
        }
      }));
      apiRef.current.forceUpdate();

      // There's a focused cell but another element (not a cell) was clicked
      // Publishes an event to notify that the focus was lost
      publishCellFocusOut(focusedCell, event);
    }
  }, [apiRef, publishCellFocusOut]);
  const handleCellModeChange = React.useCallback(params => {
    if (params.cellMode === 'view') {
      return;
    }
    const cell = gridFocusCellSelector(apiRef);
    if (cell?.id !== params.id || cell?.field !== params.field) {
      apiRef.current.setCellFocus(params.id, params.field);
    }
  }, [apiRef]);
  const handleRowSet = React.useCallback(() => {
    const cell = gridFocusCellSelector(apiRef);

    // If the focused cell is in a row which does not exist anymore, then remove the focus
    if (cell && !apiRef.current.getRow(cell.id)) {
      apiRef.current.setState(state => _extends({}, state, {
        focus: {
          cell: null,
          columnHeader: null,
          columnGroupHeader: null
        }
      }));
    }
  }, [apiRef]);
  const focusApi = {
    setCellFocus,
    setColumnHeaderFocus
  };
  const focusPrivateApi = {
    moveFocusToRelativeCell,
    setColumnGroupHeaderFocus,
    getColumnGroupHeaderFocus
  };
  useGridApiMethod(apiRef, focusApi, 'public');
  useGridApiMethod(apiRef, focusPrivateApi, 'private');
  React.useEffect(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef.current);
    doc.addEventListener('click', handleDocumentClick);
    return () => {
      doc.removeEventListener('click', handleDocumentClick);
    };
  }, [apiRef, handleDocumentClick]);
  useGridApiEventHandler(apiRef, 'columnHeaderBlur', handleBlur);
  useGridApiEventHandler(apiRef, 'cellDoubleClick', handleCellDoubleClick);
  useGridApiEventHandler(apiRef, 'cellMouseDown', handleCellMouseDown);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridApiEventHandler(apiRef, 'cellModeChange', handleCellModeChange);
  useGridApiEventHandler(apiRef, 'columnHeaderFocus', handleColumnHeaderFocus);
  useGridApiEventHandler(apiRef, 'columnGroupHeaderFocus', handleColumnGroupHeaderFocus);
  useGridApiEventHandler(apiRef, 'rowsSet', handleRowSet);
};