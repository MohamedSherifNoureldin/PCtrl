import { createSelector } from '../../../utils/createSelector';
/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export const gridColumnGroupingSelector = state => state.columnGrouping;
export const gridColumnGroupsUnwrappedModelSelector = createSelector(gridColumnGroupingSelector, columnGrouping => columnGrouping?.unwrappedGroupingModel ?? {});
export const gridColumnGroupsLookupSelector = createSelector(gridColumnGroupingSelector, columnGrouping => columnGrouping?.lookup ?? {});
export const gridColumnGroupsHeaderStructureSelector = createSelector(gridColumnGroupingSelector, columnGrouping => columnGrouping?.headerStructure ?? []);
export const gridColumnGroupsHeaderMaxDepthSelector = createSelector(gridColumnGroupingSelector, columnGrouping => columnGrouping?.maxDepth ?? 0);