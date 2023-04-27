"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridDensityValueSelector = exports.gridDensitySelector = exports.gridDensityFactorSelector = void 0;
var _createSelector = require("../../../utils/createSelector");
const gridDensitySelector = state => state.density;
exports.gridDensitySelector = gridDensitySelector;
const gridDensityValueSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.value);
exports.gridDensityValueSelector = gridDensityValueSelector;
const gridDensityFactorSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.factor);
exports.gridDensityFactorSelector = gridDensityFactorSelector;