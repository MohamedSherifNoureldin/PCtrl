import { createSelector } from '../../../utils/createSelector';
/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export const gridColumnGroupingSelector = state => state.columnGrouping;
export const gridColumnGroupsUnwrappedModelSelector = createSelector(gridColumnGroupingSelector, columnGrouping => {
  var _columnGrouping$unwra;
  return (_columnGrouping$unwra = columnGrouping == null ? void 0 : columnGrouping.unwrappedGroupingModel) != null ? _columnGrouping$unwra : {};
});
export const gridColumnGroupsLookupSelector = createSelector(gridColumnGroupingSelector, columnGrouping => {
  var _columnGrouping$looku;
  return (_columnGrouping$looku = columnGrouping == null ? void 0 : columnGrouping.lookup) != null ? _columnGrouping$looku : {};
});
export const gridColumnGroupsHeaderStructureSelector = createSelector(gridColumnGroupingSelector, columnGrouping => {
  var _columnGrouping$heade;
  return (_columnGrouping$heade = columnGrouping == null ? void 0 : columnGrouping.headerStructure) != null ? _columnGrouping$heade : [];
});
export const gridColumnGroupsHeaderMaxDepthSelector = createSelector(gridColumnGroupingSelector, columnGrouping => {
  var _columnGrouping$maxDe;
  return (_columnGrouping$maxDe = columnGrouping == null ? void 0 : columnGrouping.maxDepth) != null ? _columnGrouping$maxDe : 0;
});