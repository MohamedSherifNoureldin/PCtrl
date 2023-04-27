import * as React from 'react';
import { GridFilterItem, GridFilterModel, GridRowId } from '../../../models';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridAggregatedFilterItemApplier, GridFilterItemResult, GridQuickFilterValueResult } from './gridFilterState';
type GridFilterItemApplierNotAggregated = (rowId: GridRowId, shouldApplyItem?: (field: string) => boolean) => GridFilterItemResult;
/**
 * Adds default values to the optional fields of a filter items.
 * @param {GridFilterItem} item The raw filter item.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @return {GridFilterItem} The clean filter item with an uniq ID and an always-defined operator.
 * TODO: Make the typing reflect the different between GridFilterInputItem and GridFilterItem.
 */
export declare const cleanFilterItem: (item: GridFilterItem, apiRef: React.MutableRefObject<GridApiCommunity>) => GridFilterItem;
export declare const sanitizeFilterModel: (model: GridFilterModel, disableMultipleColumnsFiltering: boolean, apiRef: React.MutableRefObject<GridApiCommunity>) => GridFilterModel;
export declare const mergeStateWithFilterModel: (filterModel: GridFilterModel, disableMultipleColumnsFiltering: boolean, apiRef: React.MutableRefObject<GridApiCommunity>) => (filteringState: GridStateCommunity['filter']) => GridStateCommunity['filter'];
/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export declare const buildAggregatedFilterItemsApplier: (filterModel: GridFilterModel, apiRef: React.MutableRefObject<GridApiCommunity>) => GridFilterItemApplierNotAggregated | null;
/**
 * Generates a method to easily check if a row is matching the current quick filter.
 * @param {any[]} values The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export declare const buildAggregatedQuickFilterApplier: (filterModel: GridFilterModel, apiRef: React.MutableRefObject<GridApiCommunity>) => GridFilterItemApplierNotAggregated | null;
export declare const buildAggregatedFilterApplier: (filterModel: GridFilterModel, apiRef: React.MutableRefObject<GridApiCommunity>) => GridAggregatedFilterItemApplier;
export declare const passFilterLogic: (allFilterItemResults: (null | GridFilterItemResult)[], allQuickFilterResults: (null | GridQuickFilterValueResult)[], filterModel: GridFilterModel, apiRef: React.MutableRefObject<GridApiCommunity>) => boolean;
export {};
