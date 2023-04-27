"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridPipeProcessing = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _toPropertyKey2 = _interopRequireDefault(require("@babel/runtime/helpers/toPropertyKey"));
var React = _interopRequireWildcard(require("react"));
var _useGridApiMethod = require("../../utils/useGridApiMethod");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
const useGridPipeProcessing = apiRef => {
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
        otherAppliers = (0, _objectWithoutPropertiesLoose2.default)(_appliers, [id].map(_toPropertyKey2.default));
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
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, preProcessingPrivateApi, 'private');
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, preProcessingPublicApi, 'public');
};
exports.useGridPipeProcessing = useGridPipeProcessing;