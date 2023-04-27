"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeFilterModel = exports.passFilterLogic = exports.mergeStateWithFilterModel = exports.cleanFilterItem = exports.buildAggregatedQuickFilterApplier = exports.buildAggregatedFilterItemsApplier = exports.buildAggregatedFilterApplier = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _models = require("../../../models");
var _gridFilterState = require("./gridFilterState");
var _warning = require("../../../utils/warning");
var _columns = require("../columns");
/**
 * Adds default values to the optional fields of a filter items.
 * @param {GridFilterItem} item The raw filter item.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @return {GridFilterItem} The clean filter item with an uniq ID and an always-defined operator.
 * TODO: Make the typing reflect the different between GridFilterInputItem and GridFilterItem.
 */
const cleanFilterItem = (item, apiRef) => {
  const cleanItem = (0, _extends2.default)({}, item);
  if (cleanItem.id == null) {
    cleanItem.id = Math.round(Math.random() * 1e5);
  }
  if (cleanItem.operator == null) {
    // Selects a default operator
    // We don't use `apiRef.current.getColumn` because it is not ready during state initialization
    const column = (0, _columns.gridColumnLookupSelector)(apiRef)[cleanItem.field];
    cleanItem.operator = column && column.filterOperators[0].value;
  }
  return cleanItem;
};
exports.cleanFilterItem = cleanFilterItem;
const filterModelDisableMultiColumnsFilteringWarning = (0, _warning.buildWarning)(['MUI: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.', 'If you are using the community version of the `DataGrid`, this prop is always `true`.'], 'error');
const filterModelMissingItemIdWarning = (0, _warning.buildWarning)('MUI: The `id` field is required on `filterModel.items` when you use multiple filters.', 'error');
const filterModelMissingItemOperatorWarning = (0, _warning.buildWarning)('MUI: The `operator` field is required on `filterModel.items`, one or more of your filtering item has no `operator` provided.', 'error');
const sanitizeFilterModel = (model, disableMultipleColumnsFiltering, apiRef) => {
  const hasSeveralItems = model.items.length > 1;
  let items;
  if (hasSeveralItems && disableMultipleColumnsFiltering) {
    filterModelDisableMultiColumnsFilteringWarning();
    items = [model.items[0]];
  } else {
    items = model.items;
  }
  const hasItemsWithoutIds = hasSeveralItems && items.some(item => item.id == null);
  const hasItemWithoutOperator = items.some(item => item.operator == null);
  if (hasItemsWithoutIds) {
    filterModelMissingItemIdWarning();
  }
  if (hasItemWithoutOperator) {
    filterModelMissingItemOperatorWarning();
  }
  if (hasItemWithoutOperator || hasItemsWithoutIds) {
    return (0, _extends2.default)({}, model, {
      items: items.map(item => cleanFilterItem(item, apiRef))
    });
  }
  if (model.items !== items) {
    return (0, _extends2.default)({}, model, {
      items
    });
  }
  return model;
};
exports.sanitizeFilterModel = sanitizeFilterModel;
const mergeStateWithFilterModel = (filterModel, disableMultipleColumnsFiltering, apiRef) => filteringState => (0, _extends2.default)({}, filteringState, {
  filterModel: sanitizeFilterModel(filterModel, disableMultipleColumnsFiltering, apiRef)
});
exports.mergeStateWithFilterModel = mergeStateWithFilterModel;
const getFilterCallbackFromItem = (filterItem, apiRef) => {
  if (!filterItem.field || !filterItem.operator) {
    return null;
  }
  const column = apiRef.current.getColumn(filterItem.field);
  if (!column) {
    return null;
  }
  let parsedValue;
  if (column.valueParser) {
    const parser = column.valueParser;
    parsedValue = Array.isArray(filterItem.value) ? filterItem.value?.map(x => parser(x)) : parser(filterItem.value);
  } else {
    parsedValue = filterItem.value;
  }
  const newFilterItem = (0, _extends2.default)({}, filterItem, {
    value: parsedValue
  });
  const filterOperators = column.filterOperators;
  if (!filterOperators?.length) {
    throw new Error(`MUI: No filter operators found for column '${column.field}'.`);
  }
  const filterOperator = filterOperators.find(operator => operator.value === newFilterItem.operator);
  if (!filterOperator) {
    throw new Error(`MUI: No filter operator found for column '${column.field}' and operator value '${newFilterItem.operator}'.`);
  }
  const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column);
  if (typeof applyFilterOnRow !== 'function') {
    return null;
  }
  const fn = rowId => {
    const cellParams = apiRef.current.getCellParams(rowId, newFilterItem.field);
    return applyFilterOnRow(cellParams);
  };
  return {
    fn,
    item: newFilterItem
  };
};

/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
const buildAggregatedFilterItemsApplier = (filterModel, apiRef) => {
  const {
    items
  } = filterModel;
  const appliers = items.map(item => getFilterCallbackFromItem(item, apiRef)).filter(callback => !!callback);
  if (appliers.length === 0) {
    return null;
  }
  return (rowId, shouldApplyFilter) => {
    const resultPerItemId = {};
    const filteredAppliers = shouldApplyFilter ? appliers.filter(applier => shouldApplyFilter(applier.item.field)) : appliers;
    filteredAppliers.forEach(applier => {
      resultPerItemId[applier.item.id] = applier.fn(rowId);
    });
    return resultPerItemId;
  };
};

/**
 * Generates a method to easily check if a row is matching the current quick filter.
 * @param {any[]} values The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
exports.buildAggregatedFilterItemsApplier = buildAggregatedFilterItemsApplier;
const buildAggregatedQuickFilterApplier = (filterModel, apiRef) => {
  const {
    quickFilterValues = []
  } = filterModel;
  if (quickFilterValues.length === 0) {
    return null;
  }
  const columnsFields = (0, _columns.gridColumnFieldsSelector)(apiRef);
  const appliersPerField = {};
  columnsFields.forEach(field => {
    const column = apiRef.current.getColumn(field);
    const getApplyQuickFilterFn = column?.getApplyQuickFilterFn;
    if (!getApplyQuickFilterFn) {
      return;
    }
    appliersPerField[field] = quickFilterValues.map(value => getApplyQuickFilterFn(value, column, apiRef));
  });

  // If some value does not have an applier we ignore them
  const sanitizedQuickFilterValues = quickFilterValues.filter((value, index) => Object.keys(appliersPerField).some(field => appliersPerField[field][index] != null));
  if (sanitizedQuickFilterValues.length === 0) {
    return null;
  }
  return (rowId, shouldApplyFilter) => {
    const usedCellParams = {};
    const fieldsToFilter = [];
    Object.keys(appliersPerField).forEach(field => {
      if (!shouldApplyFilter || shouldApplyFilter(field)) {
        usedCellParams[field] = apiRef.current.getCellParams(rowId, field);
        fieldsToFilter.push(field);
      }
    });
    const quickFilterValueResult = {};
    sanitizedQuickFilterValues.forEach((value, index) => {
      const isPassing = fieldsToFilter.some(field => {
        if (appliersPerField[field][index] == null) {
          return false;
        }
        return appliersPerField[field][index]?.(usedCellParams[field]);
      });
      quickFilterValueResult[value] = isPassing;
    });
    return quickFilterValueResult;
  };
};
exports.buildAggregatedQuickFilterApplier = buildAggregatedQuickFilterApplier;
const buildAggregatedFilterApplier = (filterModel, apiRef) => {
  const isRowMatchingFilterItems = buildAggregatedFilterItemsApplier(filterModel, apiRef);
  const isRowMatchingQuickFilter = buildAggregatedQuickFilterApplier(filterModel, apiRef);
  return (rowId, shouldApplyFilter) => ({
    passingFilterItems: isRowMatchingFilterItems && isRowMatchingFilterItems(rowId, shouldApplyFilter),
    passingQuickFilterValues: isRowMatchingQuickFilter && isRowMatchingQuickFilter(rowId, shouldApplyFilter)
  });
};
exports.buildAggregatedFilterApplier = buildAggregatedFilterApplier;
const passFilterLogic = (allFilterItemResults, allQuickFilterResults, filterModel, apiRef) => {
  const cleanedFilterItems = filterModel.items.filter(item => getFilterCallbackFromItem(item, apiRef) !== null);
  const cleanedAllFilterItemResults = allFilterItemResults.filter(result => result != null);
  const cleanedAllQuickFilterResults = allQuickFilterResults.filter(result => result != null);

  // Defaultize operators
  const quickFilterLogicOperator = filterModel.quickFilterLogicOperator ?? (0, _gridFilterState.getDefaultGridFilterModel)().quickFilterLogicOperator;
  const logicOperator = filterModel.logicOperator ?? (0, _gridFilterState.getDefaultGridFilterModel)().logicOperator;

  // get result for filter items model
  if (cleanedAllFilterItemResults.length > 0) {
    // Return true if the item pass with one of the rows
    const filterItemPredicate = item => {
      return cleanedAllFilterItemResults.some(filterItemResult => filterItemResult[item.id]);
    };
    if (logicOperator === _models.GridLogicOperator.And) {
      const passesAllFilters = cleanedFilterItems.every(filterItemPredicate);
      if (!passesAllFilters) {
        return false;
      }
    } else {
      const passesSomeFilters = cleanedFilterItems.some(filterItemPredicate);
      if (!passesSomeFilters) {
        return false;
      }
    }
  }

  // get result for quick filter model
  if (cleanedAllQuickFilterResults.length > 0 && filterModel.quickFilterValues != null) {
    // Return true if the item pass with one of the rows
    const quickFilterValuePredicate = value => {
      return cleanedAllQuickFilterResults.some(quickFilterValueResult => quickFilterValueResult[value]);
    };
    if (quickFilterLogicOperator === _models.GridLogicOperator.And) {
      const passesAllQuickFilterValues = filterModel.quickFilterValues.every(quickFilterValuePredicate);
      if (!passesAllQuickFilterValues) {
        return false;
      }
    } else {
      const passesSomeQuickFilterValues = filterModel.quickFilterValues.some(quickFilterValuePredicate);
      if (!passesSomeQuickFilterValues) {
        return false;
      }
    }
  }
  return true;
};
exports.passFilterLogic = passFilterLogic;