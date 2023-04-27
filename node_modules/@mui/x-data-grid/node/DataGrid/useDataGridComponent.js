"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridComponent = void 0;
var _useGridInitialization = require("../hooks/core/useGridInitialization");
var _useGridInitializeState = require("../hooks/utils/useGridInitializeState");
var _useGridClipboard = require("../hooks/features/clipboard/useGridClipboard");
var _useGridColumnMenu = require("../hooks/features/columnMenu/useGridColumnMenu");
var _useGridColumns = require("../hooks/features/columns/useGridColumns");
var _useGridDensity = require("../hooks/features/density/useGridDensity");
var _useGridCsvExport = require("../hooks/features/export/useGridCsvExport");
var _useGridPrintExport = require("../hooks/features/export/useGridPrintExport");
var _useGridFilter = require("../hooks/features/filter/useGridFilter");
var _useGridFocus = require("../hooks/features/focus/useGridFocus");
var _useGridKeyboardNavigation = require("../hooks/features/keyboardNavigation/useGridKeyboardNavigation");
var _useGridPagination = require("../hooks/features/pagination/useGridPagination");
var _useGridPreferencesPanel = require("../hooks/features/preferencesPanel/useGridPreferencesPanel");
var _useGridEditing = require("../hooks/features/editing/useGridEditing");
var _useGridRows = require("../hooks/features/rows/useGridRows");
var _useGridRowsPreProcessors = require("../hooks/features/rows/useGridRowsPreProcessors");
var _useGridParamsApi = require("../hooks/features/rows/useGridParamsApi");
var _useGridRowSelection = require("../hooks/features/rowSelection/useGridRowSelection");
var _useGridRowSelectionPreProcessors = require("../hooks/features/rowSelection/useGridRowSelectionPreProcessors");
var _useGridSorting = require("../hooks/features/sorting/useGridSorting");
var _useGridScroll = require("../hooks/features/scroll/useGridScroll");
var _useGridEvents = require("../hooks/features/events/useGridEvents");
var _useGridDimensions = require("../hooks/features/dimensions/useGridDimensions");
var _useGridRowsMeta = require("../hooks/features/rows/useGridRowsMeta");
var _useGridStatePersistence = require("../hooks/features/statePersistence/useGridStatePersistence");
var _useGridColumnSpanning = require("../hooks/features/columns/useGridColumnSpanning");
var _useGridColumnGrouping = require("../hooks/features/columnGrouping/useGridColumnGrouping");
const useDataGridComponent = (inputApiRef, props) => {
  const privateApiRef = (0, _useGridInitialization.useGridInitialization)(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  (0, _useGridRowSelectionPreProcessors.useGridRowSelectionPreProcessors)(privateApiRef, props);
  (0, _useGridRowsPreProcessors.useGridRowsPreProcessors)(privateApiRef);

  /**
   * Register all state initializers here.
   */
  (0, _useGridInitializeState.useGridInitializeState)(_useGridRowSelection.rowSelectionStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridColumns.columnsStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridRows.rowsStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridEditing.editingStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridFocus.focusStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridSorting.sortingStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridPreferencesPanel.preferencePanelStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridFilter.filterStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridDensity.densityStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridPagination.paginationStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridRowsMeta.rowsMetaStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridColumnMenu.columnMenuStateInitializer, privateApiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridColumnGrouping.columnGroupsStateInitializer, privateApiRef, props);
  (0, _useGridKeyboardNavigation.useGridKeyboardNavigation)(privateApiRef, props);
  (0, _useGridRowSelection.useGridRowSelection)(privateApiRef, props);
  (0, _useGridColumns.useGridColumns)(privateApiRef, props);
  (0, _useGridRows.useGridRows)(privateApiRef, props);
  (0, _useGridParamsApi.useGridParamsApi)(privateApiRef);
  (0, _useGridColumnSpanning.useGridColumnSpanning)(privateApiRef);
  (0, _useGridColumnGrouping.useGridColumnGrouping)(privateApiRef, props);
  (0, _useGridEditing.useGridEditing)(privateApiRef, props);
  (0, _useGridFocus.useGridFocus)(privateApiRef, props);
  (0, _useGridPreferencesPanel.useGridPreferencesPanel)(privateApiRef, props);
  (0, _useGridFilter.useGridFilter)(privateApiRef, props);
  (0, _useGridSorting.useGridSorting)(privateApiRef, props);
  (0, _useGridDensity.useGridDensity)(privateApiRef, props);
  (0, _useGridPagination.useGridPagination)(privateApiRef, props);
  (0, _useGridRowsMeta.useGridRowsMeta)(privateApiRef, props);
  (0, _useGridScroll.useGridScroll)(privateApiRef, props);
  (0, _useGridColumnMenu.useGridColumnMenu)(privateApiRef);
  (0, _useGridCsvExport.useGridCsvExport)(privateApiRef);
  (0, _useGridPrintExport.useGridPrintExport)(privateApiRef, props);
  (0, _useGridClipboard.useGridClipboard)(privateApiRef);
  (0, _useGridDimensions.useGridDimensions)(privateApiRef, props);
  (0, _useGridEvents.useGridEvents)(privateApiRef, props);
  (0, _useGridStatePersistence.useGridStatePersistence)(privateApiRef);
  return privateApiRef;
};
exports.useDataGridComponent = useDataGridComponent;