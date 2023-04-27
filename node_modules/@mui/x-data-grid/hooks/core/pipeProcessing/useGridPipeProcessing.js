import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
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
export const useGridPipeProcessing = apiRef => {
  const processorsCache = React.useRef({});
  const runAppliers = React.useCallback(groupCache => {
    if (!groupCache) {
      return;
    }
    Object.values(groupCache.appliers).forEach(callback => {
      callback();
    });
  }, []);
  const registerPipeProcessor = React.useCallback((group, id, processor) => {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: new Map(),
        appliers: {}
      };
    }
    const groupCache = processorsCache.current[group];
    const oldProcessor = groupCache.processors.get(id);
    if (oldProcessor !== processor) {
      groupCache.processors.set(id, processor);
      runAppliers(groupCache);
    }
    return () => {
      processorsCache.current[group].processors.set(id, null);
    };
  }, [runAppliers]);
  const registerPipeApplier = React.useCallback((group, id, applier) => {
    if (!processorsCache.current[group]) {
      processorsCache.current[group] = {
        processors: new Map(),
        appliers: {}
      };
    }
    processorsCache.current[group].appliers[id] = applier;
    return () => {
      const _appliers = processorsCache.current[group].appliers,
        otherAppliers = _objectWithoutPropertiesLoose(_appliers, [id].map(_toPropertyKey));
      processorsCache.current[group].appliers = otherAppliers;
    };
  }, []);
  const requestPipeProcessorsApplication = React.useCallback(group => {
    const groupCache = processorsCache.current[group];
    runAppliers(groupCache);
  }, [runAppliers]);
  const applyPipeProcessors = React.useCallback((...args) => {
    const [group, value, context] = args;
    if (!processorsCache.current[group]) {
      return value;
    }
    const preProcessors = Array.from(processorsCache.current[group].processors.values());
    return preProcessors.reduce((acc, preProcessor) => {
      if (!preProcessor) {
        return acc;
      }
      return preProcessor(acc, context);
    }, value);
  }, []);
  const preProcessingPrivateApi = {
    registerPipeProcessor,
    registerPipeApplier,
    requestPipeProcessorsApplication
  };
  const preProcessingPublicApi = {
    unstable_applyPipeProcessors: applyPipeProcessors
  };
  useGridApiMethod(apiRef, preProcessingPrivateApi, 'private');
  useGridApiMethod(apiRef, preProcessingPublicApi, 'public');
};