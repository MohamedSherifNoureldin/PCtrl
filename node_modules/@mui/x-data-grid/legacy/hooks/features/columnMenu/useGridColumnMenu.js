import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridLogger, useGridApiMethod, useGridApiEventHandler } from '../../utils';
import { gridColumnMenuSelector } from './columnMenuSelector';
import { gridColumnLookupSelector, gridColumnVisibilityModelSelector, gridColumnFieldsSelector } from '../columns/gridColumnsSelector';
export var columnMenuStateInitializer = function columnMenuStateInitializer(state) {
  return _extends({}, state, {
    columnMenu: {
      open: false
    }
  });
};

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
export var useGridColumnMenu = function useGridColumnMenu(apiRef) {
  var logger = useGridLogger(apiRef, 'useGridColumnMenu');

  /**
   * API METHODS
   */
  var showColumnMenu = React.useCallback(function (field) {
    var shouldUpdate = apiRef.current.setState(function (state) {
      if (state.columnMenu.open && state.columnMenu.field === field) {
        return state;
      }
      logger.debug('Opening Column Menu');
      return _extends({}, state, {
        columnMenu: {
          open: true,
          field: field
        }
      });
    });
    if (shouldUpdate) {
      apiRef.current.hidePreferences();
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  var hideColumnMenu = React.useCallback(function () {
    var columnMenuState = gridColumnMenuSelector(apiRef.current.state);
    if (columnMenuState.field) {
      var columnLookup = gridColumnLookupSelector(apiRef);
      var columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
      var orderedFields = gridColumnFieldsSelector(apiRef);
      var fieldToFocus = columnMenuState.field;

      // If the column was removed from the grid, we need to find the closest visible field
      if (!columnLookup[fieldToFocus]) {
        fieldToFocus = orderedFields[0];
      }

      // If the field to focus is hidden, we need to find the closest visible field
      if (columnVisibilityModel[fieldToFocus] === false) {
        // contains visible column fields + the field that was just hidden
        var visibleOrderedFields = orderedFields.filter(function (field) {
          if (field === fieldToFocus) {
            return true;
          }
          return columnVisibilityModel[field] !== false;
        });
        var fieldIndex = visibleOrderedFields.indexOf(fieldToFocus);
        fieldToFocus = visibleOrderedFields[fieldIndex + 1] || visibleOrderedFields[fieldIndex - 1];
      }
      apiRef.current.setColumnHeaderFocus(fieldToFocus);
    }
    var shouldUpdate = apiRef.current.setState(function (state) {
      if (!state.columnMenu.open && state.columnMenu.field === undefined) {
        return state;
      }
      logger.debug('Hiding Column Menu');
      return _extends({}, state, {
        columnMenu: _extends({}, state.columnMenu, {
          open: false,
          field: undefined
        })
      });
    });
    if (shouldUpdate) {
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  var toggleColumnMenu = React.useCallback(function (field) {
    logger.debug('Toggle Column Menu');
    var columnMenu = gridColumnMenuSelector(apiRef.current.state);
    if (!columnMenu.open || columnMenu.field !== field) {
      showColumnMenu(field);
    } else {
      hideColumnMenu();
    }
  }, [apiRef, logger, showColumnMenu, hideColumnMenu]);
  var columnMenuApi = {
    showColumnMenu: showColumnMenu,
    hideColumnMenu: hideColumnMenu,
    toggleColumnMenu: toggleColumnMenu
  };
  useGridApiMethod(apiRef, columnMenuApi, 'public');
  useGridApiEventHandler(apiRef, 'columnResizeStart', hideColumnMenu);
  useGridApiEventHandler(apiRef, 'virtualScrollerWheel', apiRef.current.hideColumnMenu);
  useGridApiEventHandler(apiRef, 'virtualScrollerTouchMove', apiRef.current.hideColumnMenu);
};