import { createSelector } from '../../../utils/createSelector';
export const gridDensitySelector = state => state.density;
export const gridDensityValueSelector = createSelector(gridDensitySelector, density => density.value);
export const gridDensityFactorSelector = createSelector(gridDensitySelector, density => density.factor);