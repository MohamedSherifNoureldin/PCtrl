"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridColumnGroupsUnwrappedModelSelector = exports.gridColumnGroupsLookupSelector = exports.gridColumnGroupsHeaderStructureSelector = exports.gridColumnGroupsHeaderMaxDepthSelector = exports.gridColumnGroupingSelector = void 0;
var _createSelector = require("../../../utils/createSelector");
/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
const gridColumnGroupingSelector = state => state.columnGrouping;
exports.gridColumnGroupingSelector = gridColumnGroupingSelector;
const gridColumnGroupsUnwrappedModelSelector = (0, _createSelector.createSelector)(gridColumnGroupingSelector, columnGrouping => columnGrouping?.unwrappedGroupingModel ?? {});
exports.gridColumnGroupsUnwrappedModelSelector = gridColumnGroupsUnwrappedModelSelector;
const gridColumnGroupsLookupSelector = (0, _createSelector.createSelector)(gridColumnGroupingSelector, columnGrouping => columnGrouping?.lookup ?? {});
exports.gridColumnGroupsLookupSelector = gridColumnGroupsLookupSelector;
const gridColumnGroupsHeaderStructureSelector = (0, _createSelector.createSelector)(gridColumnGroupingSelector, columnGrouping => columnGrouping?.headerStructure ?? []);
exports.gridColumnGroupsHeaderStructureSelector = gridColumnGroupsHeaderStructureSelector;
const gridColumnGroupsHeaderMaxDepthSelector = (0, _createSelector.createSelector)(gridColumnGroupingSelector, columnGrouping => columnGrouping?.maxDepth ?? 0);
exports.gridColumnGroupsHeaderMaxDepthSelector = gridColumnGroupsHeaderMaxDepthSelector;