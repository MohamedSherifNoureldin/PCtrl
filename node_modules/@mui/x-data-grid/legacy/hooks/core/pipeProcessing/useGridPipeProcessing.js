import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toPropertyKey from "@babel/runtime/helpers/esm/toPropertyKey";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
/**
 * Implement the Pipeline Pattern
 *
 * More information and detailed example in (TODO add link to technical doc when ready)
 *
 * Some plugins contains custom logic to enrich data provided by other plugins or components.
 * For instance, the row grouping plugin needs to add / remove the grouping columns when the grid columns are updated.
 *
 * =====================================================================================================================
 *
 * The plugin containing the custom logic must use:
 *
 * - `useGridRegisterPipeProcessor` to register their processor.
 *
 * - `apiRef.current.requestPipeProcessorsApplication` to imperatively re-apply a group.
 *   This method should be used in last resort.
 *   Most of the time, the application should be triggered by an update on the deps of the processor.
 *
 * =====================================================================================================================
 *
 * The plugin or component that needs to enrich its data must use:
 *
 * - `apiRef.current.unstable_applyPipeProcessors` to run in chain all the processors of a given group.
 *
 * - `useGridRegisterPipeApplier` to re-apply the whole pipe when requested.
 *   The applier will be called when:
 *   * a processor is registered.
 *   * `apiRef.current.requestPipeProcessorsApplication` is called for the given group.
 */
export var useGridPipeProcessing = function useGridPipeProcessing(apiRef) {
  var processorsCache = React.useRef({});
  var runAppliers = React.useCallback(function (groupCache) {
    if (!groupCache) {
      return;
    }
    Object.values(groupCache.appliers).forEach(function (callback) {
      callback();
    });
  }, []);
  var registerPipeProcessor = React.useCallback(function (group, id, processor) {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: new Map(),
        appliers: {}
      };
    }
    var groupCache = processorsCache.current[group];
    var oldProcessor = groupCache.processors.get(id);
    if (oldProcessor !== processor) {
      groupCache.processors.set(id, processor);
      runAppliers(groupCache);
    }
    return function () {
      processorsCache.current[group].processors.set(id, null);
    };
  }, [runAppliers]);
  var registerPipeApplier = React.useCallback(function (group, id, applier) {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: new Map(),
        appliers: {}
      };
    }
    processorsCache.current[group].appliers[id] = applier;
    return function () {
      var _appliers = processorsCache.current[group].appliers,
        removedGroupApplier = _appliers[id],
        otherAppliers = _objectWithoutProperties(_appliers, [id].map(_toPropertyKey));
      processorsCache.current[group].appliers = otherAppliers;
    };
  }, []);
  var requestPipeProcessorsApplication = React.useCallback(function (group) {
    var groupCache = processorsCache.current[group];
    runAppliers(groupCache);
  }, [runAppliers]);
  var applyPipeProcessors = React.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var _ref = args,
      _ref2 = _slicedToArray(_ref, 3),
      group = _ref2[0],
      value = _ref2[1],
      context = _ref2[2];
    if (!processorsCache.current[group]) {
      return value;
    }
    var preProcessors = Array.from(processorsCache.current[group].processors.values());
    return preProcessors.reduce(function (acc, preProcessor) {
      if (!preProcessor) {
        return acc;
      }
      return preProcessor(acc, context);
    }, value);
  }, []);
  var preProcessingPrivateApi = {
    registerPipeProcessor: registerPipeProcessor,
    registerPipeApplier: registerPipeApplier,
    requestPipeProcessorsApplication: requestPipeProcessorsApplication
  };
  var preProcessingPublicApi = {
    unstable_applyPipeProcessors: applyPipeProcessors
  };
  useGridApiMethod(apiRef, preProcessingPrivateApi, 'private');
  useGridApiMethod(apiRef, preProcessingPublicApi, 'public');
};