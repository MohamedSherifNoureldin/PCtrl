import _extends from "@babel/runtime/helpers/esm/extends";
import { GridLogicOperator } from '../../../models';
import { getDefaultGridFilterModel } from './gridFilterState';
import { buildWarning } from '../../../utils/warning';
import { gridColumnFieldsSelector, gridColumnLookupSelector } from '../columns';
/**
 * Adds default values to the optional fields of a filter items.
 * @param {GridFilterItem} item The raw filter item.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @return {GridFilterItem} The clean filter item with an uniq ID and an always-defined operator.
 * TODO: Make the typing reflect the different between GridFilterInputItem and GridFilterItem.
 */
export var cleanFilterItem = function cleanFilterItem(item, apiRef) {
  var cleanItem = _extends({}, item);
  if (cleanItem.id == null) {
    cleanItem.id = Math.round(Math.random() * 1e5);
  }
  if (cleanItem.operator == null) {
    // Selects a default operator
    // We don't use `apiRef.current.getColumn` because it is not ready during state initialization
    var column = gridColumnLookupSelector(apiRef)[cleanItem.field];
    cleanItem.operator = column && column.filterOperators[0].value;
  }
  return cleanItem;
};
var filterModelDisableMultiColumnsFilteringWarning = buildWarning(['MUI: The `filterModel` can only contain a single item when the `disableMultipleColumnsFiltering` prop is set to `true`.', 'If you are using the community version of the `DataGrid`, this prop is always `true`.'], 'error');
var filterModelMissingItemIdWarning = buildWarning('MUI: The `id` field is required on `filterModel.items` when you use multiple filters.', 'error');
var filterModelMissingItemOperatorWarning = buildWarning('MUI: The `operator` field is required on `filterModel.items`, one or more of your filtering item has no `operator` provided.', 'error');
export var sanitizeFilterModel = function sanitizeFilterModel(model, disableMultipleColumnsFiltering, apiRef) {
  var hasSeveralItems = model.items.length > 1;
  var items;
  if (hasSeveralItems && disableMultipleColumnsFiltering) {
    filterModelDisableMultiColumnsFilteringWarning();
    items = [model.items[0]];
  } else {
    items = model.items;
  }
  var hasItemsWithoutIds = hasSeveralItems && items.some(function (item) {
    return item.id == null;
  });
  var hasItemWithoutOperator = items.some(function (item) {
    return item.operator == null;
  });
  if (hasItemsWithoutIds) {
    filterModelMissingItemIdWarning();
  }
  if (hasItemWithoutOperator) {
    filterModelMissingItemOperatorWarning();
  }
  if (hasItemWithoutOperator || hasItemsWithoutIds) {
    return _extends({}, model, {
      items: items.map(function (item) {
        return cleanFilterItem(item, apiRef);
      })
    });
  }
  if (model.items !== items) {
    return _extends({}, model, {
      items: items
    });
  }
  return model;
};
export var mergeStateWithFilterModel = function mergeStateWithFilterModel(filterModel, disableMultipleColumnsFiltering, apiRef) {
  return function (filteringState) {
    return _extends({}, filteringState, {
      filterModel: sanitizeFilterModel(filterModel, disableMultipleColumnsFiltering, apiRef)
    });
  };
};
var getFilterCallbackFromItem = function getFilterCallbackFromItem(filterItem, apiRef) {
  if (!filterItem.field || !filterItem.operator) {
    return null;
  }
  var column = apiRef.current.getColumn(filterItem.field);
  if (!column) {
    return null;
  }
  var parsedValue;
  if (column.valueParser) {
    var _filterItem$value;
    var parser = column.valueParser;
    parsedValue = Array.isArray(filterItem.value) ? (_filterItem$value = filterItem.value) == null ? void 0 : _filterItem$value.map(function (x) {
      return parser(x);
    }) : parser(filterItem.value);
  } else {
    parsedValue = filterItem.value;
  }
  var newFilterItem = _extends({}, filterItem, {
    value: parsedValue
  });
  var filterOperators = column.filterOperators;
  if (!(filterOperators != null && filterOperators.length)) {
    throw new Error("MUI: No filter operators found for column '".concat(column.field, "'."));
  }
  var filterOperator = filterOperators.find(function (operator) {
    return operator.value === newFilterItem.operator;
  });
  if (!filterOperator) {
    throw new Error("MUI: No filter operator found for column '".concat(column.field, "' and operator value '").concat(newFilterItem.operator, "'."));
  }
  var applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column);
  if (typeof applyFilterOnRow !== 'function') {
    return null;
  }
  var fn = function fn(rowId) {
    var cellParams = apiRef.current.getCellParams(rowId, newFilterItem.field);
    return applyFilterOnRow(cellParams);
  };
  return {
    fn: fn,
    item: newFilterItem
  };
};

/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {React.MutableRefObject<GridApiCommunity>} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export var buildAggregatedFilterItemsApplier = function buildAggregatedFilterItemsApplier(filterModel, apiRef) {
  var items = filterModel.items;
  var appliers = items.map(function (item) {
    return getFilterCallbackFromItem(item, apiRef);
  }).filter(function (callback) {
    return !!callback;
  });
  if (appliers.length === 0) {
    return null;
  }
  return function (rowId, shouldApplyFilter) {
    var resultPerItemId = {};
    var filteredAppliers = shouldApplyFilter ? appliers.filter(function (applier) {
      return shouldApplyFilter(applier.item.field);
    }) : appliers;
    filteredAppliers.forEach(function (applier) {
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
export var buildAggregatedQuickFilterApplier = function buildAggregatedQuickFilterApplier(filterModel, apiRef) {
  var _filterModel$quickFil = filterModel.quickFilterValues,
    quickFilterValues = _filterModel$quickFil === void 0 ? [] : _filterModel$quickFil;
  if (quickFilterValues.length === 0) {
    return null;
  }
  var columnsFields = gridColumnFieldsSelector(apiRef);
  var appliersPerField = {};
  columnsFields.forEach(function (field) {
    var column = apiRef.current.getColumn(field);
    var getApplyQuickFilterFn = column == null ? void 0 : column.getApplyQuickFilterFn;
    if (!getApplyQuickFilterFn) {
      return;
    }
    appliersPerField[field] = quickFilterValues.map(function (value) {
      return getApplyQuickFilterFn(value, column, apiRef);
    });
  });

  // If some value does not have an applier we ignore them
  var sanitizedQuickFilterValues = quickFilterValues.filter(function (value, index) {
    return Object.keys(appliersPerField).some(function (field) {
      return appliersPerField[field][index] != null;
    });
  });
  if (sanitizedQuickFilterValues.length === 0) {
    return null;
  }
  return function (rowId, shouldApplyFilter) {
    var usedCellParams = {};
    var fieldsToFilter = [];
    Object.keys(appliersPerField).forEach(function (field) {
      if (!shouldApplyFilter || shouldApplyFilter(field)) {
        usedCellParams[field] = apiRef.current.getCellParams(rowId, field);
        fieldsToFilter.push(field);
      }
    });
    var quickFilterValueResult = {};
    sanitizedQuickFilterValues.forEach(function (value, index) {
      var isPassing = fieldsToFilter.some(function (field) {
        var _appliersPerField$fie, _appliersPerField$fie2;
        if (appliersPerField[field][index] == null) {
          return false;
        }
        return (_appliersPerField$fie = (_appliersPerField$fie2 = appliersPerField[field])[index]) == null ? void 0 : _appliersPerField$fie.call(_appliersPerField$fie2, usedCellParams[field]);
      });
      quickFilterValueResult[value] = isPassing;
    });
    return quickFilterValueResult;
  };
};
export var buildAggregatedFilterApplier = function buildAggregatedFilterApplier(filterModel, apiRef) {
  var isRowMatchingFilterItems = buildAggregatedFilterItemsApplier(filterModel, apiRef);
  var isRowMatchingQuickFilter = buildAggregatedQuickFilterApplier(filterModel, apiRef);
  return function (rowId, shouldApplyFilter) {
    return {
      passingFilterItems: isRowMatchingFilterItems && isRowMatchingFilterItems(rowId, shouldApplyFilter),
      passingQuickFilterValues: isRowMatchingQuickFilter && isRowMatchingQuickFilter(rowId, shouldApplyFilter)
    };
  };
};
export var passFilterLogic = function passFilterLogic(allFilterItemResults, allQuickFilterResults, filterModel, apiRef) {
  var _filterModel$quickFil2, _filterModel$logicOpe;
  var cleanedFilterItems = filterModel.items.filter(function (item) {
    return getFilterCallbackFromItem(item, apiRef) !== null;
  });
  var cleanedAllFilterItemResults = allFilterItemResults.filter(function (result) {
    return result != null;
  });
  var cleanedAllQuickFilterResults = allQuickFilterResults.filter(function (result) {
    return result != null;
  });

  // Defaultize operators
  var quickFilterLogicOperator = (_filterModel$quickFil2 = filterModel.quickFilterLogicOperator) != null ? _filterModel$quickFil2 : getDefaultGridFilterModel().quickFilterLogicOperator;
  var logicOperator = (_filterModel$logicOpe = filterModel.logicOperator) != null ? _filterModel$logicOpe : getDefaultGridFilterModel().logicOperator;

  // get result for filter items model
  if (cleanedAllFilterItemResults.length > 0) {
    // Return true if the item pass with one of the rows
    var filterItemPredicate = function filterItemPredicate(item) {
      return cleanedAllFilterItemResults.some(function (filterItemResult) {
        return filterItemResult[item.id];
      });
    };
    if (logicOperator === GridLogicOperator.And) {
      var passesAllFilters = cleanedFilterItems.every(filterItemPredicate);
      if (!passesAllFilters) {
        return false;
      }
    } else {
      var passesSomeFilters = cleanedFilterItems.some(filterItemPredicate);
      if (!passesSomeFilters) {
        return false;
      }
    }
  }

  // get result for quick filter model
  if (cleanedAllQuickFilterResults.length > 0 && filterModel.quickFilterValues != null) {
    // Return true if the item pass with one of the rows
    var quickFilterValuePredicate = function quickFilterValuePredicate(value) {
      return cleanedAllQuickFilterResults.some(function (quickFilterValueResult) {
        return quickFilterValueResult[value];
      });
    };
    if (quickFilterLogicOperator === GridLogicOperator.And) {
      var passesAllQuickFilterValues = filterModel.quickFilterValues.every(quickFilterValuePredicate);
      if (!passesAllQuickFilterValues) {
        return false;
      }
    } else {
      var passesSomeQuickFilterValues = filterModel.quickFilterValues.some(quickFilterValuePredicate);
      if (!passesSomeQuickFilterValues) {
        return false;
      }
    }
  }
  return true;
};