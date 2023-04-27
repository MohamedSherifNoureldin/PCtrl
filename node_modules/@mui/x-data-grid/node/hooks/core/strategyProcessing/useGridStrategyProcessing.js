"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridStrategyProcessing = exports.GRID_STRATEGIES_PROCESSORS = exports.GRID_DEFAULT_STRATEGY = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _toPropertyKey2 = _interopRequireDefault(require("@babel/runtime/helpers/toPropertyKey"));
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../../utils/useGridApiMethod");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GRID_DEFAULT_STRATEGY = 'none';
exports.GRID_DEFAULT_STRATEGY = GRID_DEFAULT_STRATEGY;
const GRID_STRATEGIES_PROCESSORS = {
  rowTreeCreation: 'rowTree',
  filtering: 'rowTree',
  sorting: 'rowTree'
};
exports.GRID_STRATEGIES_PROCESSORS = GRID_STRATEGIES_PROCESSORS;
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
const useGridStrategyProcessing = apiRef => {
  const availableStrategies = React.useRef(new Map());
  const strategiesCache = React.useRef({});
  const registerStrategyProcessor = React.useCallback((strategyName, processorName, processor) => {
    const cleanup = () => {
      const _ref = strategiesCache.current[processorName],
        otherProcessors = (0, _objectWithoutPropertiesLoose2.default)(_ref, [strategyName].map(_toPropertyKey2.default));
      strategiesCache.current[processorName] = otherProcessors;
    };
    if (!strategiesCache.current[processorName]) {
      strategiesCache.current[processorName] = {};
    }
    const groupPreProcessors = strategiesCache.current[processorName];
    const previousProcessor = groupPreProcessors[strategyName];
    groupPreProcessors[strategyName] = processor;
    if (!previousProcessor || previousProcessor === processor) {
      return cleanup;
    }
    if (strategyName === apiRef.current.getActiveStrategy(GRID_STRATEGIES_PROCESSORS[processorName])) {
      apiRef.current.publishEvent('activeStrategyProcessorChange', processorName);
    }
    return cleanup;
  }, [apiRef]);
  const applyStrategyProcessor = React.useCallback((processorName, params) => {
    const activeStrategy = apiRef.current.getActiveStrategy(GRID_STRATEGIES_PROCESSORS[processorName]);
    if (activeStrategy == null) {
      throw new Error("Can't apply a strategy processor before defining an active strategy");
    }
    const groupCache = strategiesCache.current[processorName];
    if (!groupCache || !groupCache[activeStrategy]) {
      throw new Error(`No processor found for processor "${processorName}" on strategy "${activeStrategy}"`);
    }
    const processor = groupCache[activeStrategy];
    return processor(params);
  }, [apiRef]);
  const getActiveStrategy = React.useCallback(strategyGroup => {
    const strategyEntries = Array.from(availableStrategies.current.entries());
    const availableStrategyEntry = strategyEntries.find(([, strategy]) => {
      if (strategy.group !== strategyGroup) {
        return false;
      }
      return strategy.isAvailable();
    });
    return availableStrategyEntry?.[0] ?? GRID_DEFAULT_STRATEGY;
  }, []);
  const setStrategyAvailability = React.useCallback((strategyGroup, strategyName, isAvailable) => {
    availableStrategies.current.set(strategyName, {
      group: strategyGroup,
      isAvailable
    });
    apiRef.current.publishEvent('strategyAvailabilityChange');
  }, [apiRef]);
  const strategyProcessingApi = {
    registerStrategyProcessor,
    applyStrategyProcessor,
    getActiveStrategy,
    setStrategyAvailability
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, strategyProcessingApi, 'private');
};
exports.useGridStrategyProcessing = useGridStrategyProcessing;