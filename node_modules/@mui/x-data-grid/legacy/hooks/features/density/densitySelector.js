import { createSelector } from '../../../utils/createSelector';
export var gridDensitySelector = function gridDensitySelector(state) {
  return state.density;
};
export var gridDensityValueSelector = createSelector(gridDensitySelector, function (density) {
  return density.value;
});
export var gridDensityFactorSelector = createSelector(gridDensitySelector, function (density) {
  return density.factor;
});