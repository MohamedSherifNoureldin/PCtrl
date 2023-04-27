import { createSelector } from '../../../utils/createSelector';
/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export var gridColumnGroupingSelector = function gridColumnGroupingSelector(state) {
  return state.columnGrouping;
};
export var gridColumnGroupsUnwrappedModelSelector = createSelector(gridColumnGroupingSelector, function (columnGrouping) {
  var _columnGrouping$unwra;
  return (_columnGrouping$unwra = columnGrouping == null ? void 0 : columnGrouping.unwrappedGroupingModel) != null ? _columnGrouping$unwra : {};
});
export var gridColumnGroupsLookupSelector = createSelector(gridColumnGroupingSelector, function (columnGrouping) {
  var _columnGrouping$looku;
  return (_columnGrouping$looku = columnGrouping == null ? void 0 : columnGrouping.lookup) != null ? _columnGrouping$looku : {};
});
export var gridColumnGroupsHeaderStructureSelector = createSelector(gridColumnGroupingSelector, function (columnGrouping) {
  var _columnGrouping$heade;
  return (_columnGrouping$heade = columnGrouping == null ? void 0 : columnGrouping.headerStructure) != null ? _columnGrouping$heade : [];
});
export var gridColumnGroupsHeaderMaxDepthSelector = createSelector(gridColumnGroupingSelector, function (columnGrouping) {
  var _columnGrouping$maxDe;
  return (_columnGrouping$maxDe = columnGrouping == null ? void 0 : columnGrouping.maxDepth) != null ? _columnGrouping$maxDe : 0;
});