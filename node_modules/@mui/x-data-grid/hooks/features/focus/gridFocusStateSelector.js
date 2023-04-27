import { createSelector } from '../../../utils/createSelector';
export const gridFocusStateSelector = state => state.focus;
export const gridFocusCellSelector = createSelector(gridFocusStateSelector, focusState => focusState.cell);
export const gridFocusColumnHeaderSelector = createSelector(gridFocusStateSelector, focusState => focusState.columnHeader);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_gridFocusColumnGroupHeaderSelector = createSelector(gridFocusStateSelector, focusState => focusState.columnGroupHeader);
export const gridTabIndexStateSelector = state => state.tabIndex;
export const gridTabIndexCellSelector = createSelector(gridTabIndexStateSelector, state => state.cell);
export const gridTabIndexColumnHeaderSelector = createSelector(gridTabIndexStateSelector, state => state.columnHeader);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_gridTabIndexColumnGroupHeaderSelector = createSelector(gridTabIndexStateSelector, state => state.columnGroupHeader);