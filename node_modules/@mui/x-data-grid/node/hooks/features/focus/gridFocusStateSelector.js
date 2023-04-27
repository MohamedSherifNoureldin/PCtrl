"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unstable_gridTabIndexColumnGroupHeaderSelector = exports.unstable_gridFocusColumnGroupHeaderSelector = exports.gridTabIndexStateSelector = exports.gridTabIndexColumnHeaderSelector = exports.gridTabIndexCellSelector = exports.gridFocusStateSelector = exports.gridFocusColumnHeaderSelector = exports.gridFocusCellSelector = void 0;
var _createSelector = require("../../../utils/createSelector");
const gridFocusStateSelector = state => state.focus;
exports.gridFocusStateSelector = gridFocusStateSelector;
const gridFocusCellSelector = (0, _createSelector.createSelector)(gridFocusStateSelector, focusState => focusState.cell);
exports.gridFocusCellSelector = gridFocusCellSelector;
const gridFocusColumnHeaderSelector = (0, _createSelector.createSelector)(gridFocusStateSelector, focusState => focusState.columnHeader);

// eslint-disable-next-line @typescript-eslint/naming-convention
exports.gridFocusColumnHeaderSelector = gridFocusColumnHeaderSelector;
const unstable_gridFocusColumnGroupHeaderSelector = (0, _createSelector.createSelector)(gridFocusStateSelector, focusState => focusState.columnGroupHeader);
exports.unstable_gridFocusColumnGroupHeaderSelector = unstable_gridFocusColumnGroupHeaderSelector;
const gridTabIndexStateSelector = state => state.tabIndex;
exports.gridTabIndexStateSelector = gridTabIndexStateSelector;
const gridTabIndexCellSelector = (0, _createSelector.createSelector)(gridTabIndexStateSelector, state => state.cell);
exports.gridTabIndexCellSelector = gridTabIndexCellSelector;
const gridTabIndexColumnHeaderSelector = (0, _createSelector.createSelector)(gridTabIndexStateSelector, state => state.columnHeader);

// eslint-disable-next-line @typescript-eslint/naming-convention
exports.gridTabIndexColumnHeaderSelector = gridTabIndexColumnHeaderSelector;
const unstable_gridTabIndexColumnGroupHeaderSelector = (0, _createSelector.createSelector)(gridTabIndexStateSelector, state => state.columnGroupHeader);
exports.unstable_gridTabIndexColumnGroupHeaderSelector = unstable_gridTabIndexColumnGroupHeaderSelector;