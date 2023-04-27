import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toPropertyKey from "@babel/runtime/helpers/esm/toPropertyKey";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
export var GRID_DEFAULT_STRATEGY = 'none';
export var GRID_STRATEGIES_PROCESSORS = {
  rowTreeCreation: 'rowTree',
  filtering: 'rowTree',
  sorting: 'rowTree'
};
/**
 * Implements a variant of the Strategy Pattern (see https://en.wikipedia.org/wiki/Strategy_pattern)
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic that must only be applied if the right strategy is active.
 * For instance, the row grouping plugin has a custom filtering algorithm.
 * This algorithm must be applied by the filtering plugin if the row grouping is the current way of grouping rows,
 * but not if the tree data is the current way of grouping rows.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterStrategyProcessor` to register their processor.
 *   When the processor of the active strategy changes, it will fire `"activeStrategyProcessorChange"` to re-apply the processor.
 *
 * - `apiRef.current.setStrategyAvailability` to tell if their strategy can be used.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to apply the custom logic of the current strategy must use:
 *
 * - `apiRef.current.applyStrategyProcessor` to run the processor of the active strategy for a given processor name.
 *
 * - the "strategyAvailabilityChange" event to update something when the active strategy changes.
 *    Warning: Be careful not to apply the processor several times.
 *    For instance "rowsSet" is fired by `useGridRows` whenever the active strategy changes.
 *    So listening to both would most likely run your logic twice.
 *
 * - The "activeStrategyProcessorChange" event to update something when the processor of the active strategy changes.
 *
 * =====================================================================================================================
 *
 * Each processor name is part of a strategy group which can only have one active strategy at the time.
 * For now, there is only one strategy group named `rowTree` which customize
 * - row tree creation algorithm.
 * - sorting algorithm.
 * - filtering algorithm.
 */
export var useGridStrategyProcessing = function useGridStrategyProcessing(apiRef) {
  var availableStrategies = React.useRef(new Map());
  var strategiesCache = React.useRef({});
  var registerStrategyProcessor = React.useCallback(function (strategyName, processorName, processor) {
    var cleanup = function cleanup() {
      var _ref = strategiesCache.current[processorName],
        removedPreProcessor = _ref[strategyName],
        otherProcessors = _objectWithoutProperties(_ref, [strategyName].map(_toPropertyKey));
      strategiesCache.current[processorName] = otherProcessors;
    };
    if (!strategiesCache.current[processorName]) {
      strategiesCache.current[processorName] = {};
    }
    var groupPreProcessors = strategiesCache.current[processorName];
    var previousProcessor = groupPreProcessors[strategyName];
    groupPreProcessors[strategyName] = processor;
    if (!previousProcessor || previousProcessor === processor) {
      return cleanup;
    }
    if (strategyName === apiRef.current.getActiveStrategy(GRID_STRATEGIES_PROCESSORS[processorName])) {
      apiRef.current.publishEvent('activeStrategyProcessorChange', processorName);
    }
    return cleanup;
  }, [apiRef]);
  var applyStrategyProcessor = React.useCallback(function (processorName, params) {
    var activeStrategy = apiRef.current.getActiveStrategy(GRID_STRATEGIES_PROCESSORS[processorName]);
    if (activeStrategy == null) {
      throw new Error("Can't apply a strategy processor before defining an active strategy");
    }
    var groupCache = strategiesCache.current[processorName];
    if (!groupCache || !groupCache[activeStrategy]) {
      throw new Error("No processor found for processor \"".concat(processorName, "\" on strategy \"").concat(activeStrategy, "\""));
    }
    var processor = groupCache[activeStrategy];
    return processor(params);
  }, [apiRef]);
  var getActiveStrategy = React.useCallback(function (strategyGroup) {
    var _availableStrategyEnt;
    var strategyEntries = Array.from(availableStrategies.current.entries());
    var availableStrategyEntry = strategyEntries.find(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        strategy = _ref3[1];
      if (strategy.group !== strategyGroup) {
        return false;
      }
      return strategy.isAvailable();
    });
    return (_availableStrategyEnt = availableStrategyEntry == null ? void 0 : availableStrategyEntry[0]) != null ? _availableStrategyEnt : GRID_DEFAULT_STRATEGY;
  }, []);
  var setStrategyAvailability = React.useCallback(function (strategyGroup, strategyName, isAvailable) {
    availableStrategies.current.set(strategyName, {
      group: strategyGroup,
      isAvailable: isAvailable
    });
    apiRef.current.publishEvent('strategyAvailabilityChange');
  }, [apiRef]);
  var strategyProcessingApi = {
    registerStrategyProcessor: registerStrategyProcessor,
    applyStrategyProcessor: applyStrategyProcessor,
    getActiveStrategy: getActiveStrategy,
    setStrategyAvailability: setStrategyAvailability
  };
  useGridApiMethod(apiRef, strategyProcessingApi, 'private');
};