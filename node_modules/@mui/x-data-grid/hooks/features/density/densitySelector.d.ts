import { GridStateCommunity } from '../../../models/gridStateCommunity';
export declare const gridDensitySelector: (state: GridStateCommunity) => import("./densityState").GridDensityState;
export declare const gridDensityValueSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, import("../../..").GridDensity>;
export declare const gridDensityFactorSelector: import("../../../utils/createSelector").OutputSelector<GridStateCommunity, number>;
