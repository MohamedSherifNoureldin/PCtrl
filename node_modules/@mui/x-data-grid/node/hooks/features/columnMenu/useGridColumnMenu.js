"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridColumnMenu = exports.columnMenuStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("../../utils");
var _columnMenuSelector = require("./columnMenuSelector");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const columnMenuStateInitializer = state => (0, _extends2.default)({}, state, {
  columnMenu: {
    open: false
  }
});

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
exports.columnMenuStateInitializer = columnMenuStateInitializer;
const useGridColumnMenu = apiRef => {
  const logger = (0, _utils.useGridLogger)(apiRef, 'useGridColumnMenu');

  /**
   * API METHODS
   */
  const showColumnMenu = React.useCallback(field => {
    const shouldUpdate = apiRef.current.setState(state => {
      if (state.columnMenu.open && state.columnMenu.field === field) {
        return state;
      }
      logger.debug('Opening Column Menu');
      return (0, _extends2.default)({}, state, {
        columnMenu: {
          open: true,
          field
        }
      });
    });
    if (shouldUpdate) {
      apiRef.current.hidePreferences();
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  const hideColumnMenu = React.useCallback(() => {
    const columnMenuState = (0, _columnMenuSelector.gridColumnMenuSelector)(apiRef.current.state);
    if (columnMenuState.field) {
      const columnLookup = (0, _gridColumnsSelector.gridColumnLookupSelector)(apiRef);
      const columnVisibilityModel = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
      const orderedFields = (0, _gridColumnsSelector.gridColumnFieldsSelector)(apiRef);
      let fieldToFocus = columnMenuState.field;

      // If the column was removed from the grid, we need to find the closest visible field
      if (!columnLookup[fieldToFocus]) {
        fieldToFocus = orderedFields[0];
      }

      // If the field to focus is hidden, we need to find the closest visible field
      if (columnVisibilityModel[fieldToFocus] === false) {
        // contains visible column fields + the field that was just hidden
        const visibleOrderedFields = orderedFields.filter(field => {
          if (field === fieldToFocus) {
            return true;
          }
          return columnVisibilityModel[field] !== false;
        });
        const fieldIndex = visibleOrderedFields.indexOf(fieldToFocus);
        fieldToFocus = visibleOrderedFields[fieldIndex + 1] || visibleOrderedFields[fieldIndex - 1];
      }
      apiRef.current.setColumnHeaderFocus(fieldToFocus);
    }
    const shouldUpdate = apiRef.current.setState(state => {
      if (!state.columnMenu.open && state.columnMenu.field === undefined) {
        return state;
      }
      logger.debug('Hiding Column Menu');
      return (0, _extends2.default)({}, state, {
        columnMenu: (0, _extends2.default)({}, state.columnMenu, {
          open: false,
          field: undefined
        })
      });
    });
    if (shouldUpdate) {
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  const toggleColumnMenu = React.useCallback(field => {
    logger.debug('Toggle Column Menu');
    const columnMenu = (0, _columnMenuSelector.gridColumnMenuSelector)(apiRef.current.state);
    if (!columnMenu.open || columnMenu.field !== field) {
      showColumnMenu(field);
    } else {
      hideColumnMenu();
    }
  }, [apiRef, logger, showColumnMenu, hideColumnMenu]);
  const columnMenuApi = {
    showColumnMenu,
    hideColumnMenu,
    toggleColumnMenu
  };
  (0, _utils.useGridApiMethod)(apiRef, columnMenuApi, 'public');
  (0, _utils.useGridApiEventHandler)(apiRef, 'columnResizeStart', hideColumnMenu);
  (0, _utils.useGridApiEventHandler)(apiRef, 'virtualScrollerWheel', apiRef.current.hideColumnMenu);
  (0, _utils.useGridApiEventHandler)(apiRef, 'virtualScrollerTouchMove', apiRef.current.hideColumnMenu);
};
exports.useGridColumnMenu = useGridColumnMenu;