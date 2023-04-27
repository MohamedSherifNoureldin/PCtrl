"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridSignature = void 0;
exports.createUseGridApiEventHandler = createUseGridApiEventHandler;
exports.useGridApiEventHandler = exports.unstable_resetCleanupTracking = void 0;
exports.useGridApiOptionHandler = useGridApiOptionHandler;
var React = _interopRequireWildcard(require("react"));
var _TimerBasedCleanupTracking = require("../../utils/cleanupTracking/TimerBasedCleanupTracking");
var _FinalizationRegistryBasedCleanupTracking = require("../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Signal to the underlying logic what version of the public component API
 * of the data grid is exposed.
 */
var GridSignature = /*#__PURE__*/function (GridSignature) {
  GridSignature["DataGrid"] = "DataGrid";
  GridSignature["DataGridPro"] = "DataGridPro";
  return GridSignature;
}(GridSignature || {});
exports.GridSignature = GridSignature;
// We use class to make it easier to detect in heap snapshots by name
class ObjectToBeRetainedByReact {}

// Based on https://github.com/Bnaya/use-dispose-uncommitted/blob/main/src/finalization-registry-based-impl.ts
// Check https://github.com/facebook/react/issues/15317 to get more information
function createUseGridApiEventHandler(registryContainer) {
  let cleanupTokensCounter = 0;
  return function useGridApiEventHandler(apiRef, eventName, handler, options) {
    if (registryContainer.registry === null) {
      registryContainer.registry = typeof FinalizationRegistry !== 'undefined' ? new _FinalizationRegistryBasedCleanupTracking.FinalizationRegistryBasedCleanupTracking() : new _TimerBasedCleanupTracking.TimerBasedCleanupTracking();
    }
    const [objectRetainedByReact] = React.useState(new ObjectToBeRetainedByReact());
    const subscription = React.useRef(null);
    const handlerRef = React.useRef();
    handlerRef.current = handler;
    const cleanupTokenRef = React.useRef(null);
    if (!subscription.current && handlerRef.current) {
      const enhancedHandler = (params, event, details) => {
        if (!event.defaultMuiPrevented) {
          handlerRef.current?.(params, event, details);
        }
      };
      subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
      cleanupTokensCounter += 1;
      cleanupTokenRef.current = {
        cleanupToken: cleanupTokensCounter
      };
      registryContainer.registry.register(objectRetainedByReact,
      // The callback below will be called once this reference stops being retained
      () => {
        subscription.current?.();
        subscription.current = null;
        cleanupTokenRef.current = null;
      }, cleanupTokenRef.current);
    } else if (!handlerRef.current && subscription.current) {
      subscription.current();
      subscription.current = null;
      if (cleanupTokenRef.current) {
        registryContainer.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
    }
    React.useEffect(() => {
      if (!subscription.current && handlerRef.current) {
        const enhancedHandler = (params, event, details) => {
          if (!event.defaultMuiPrevented) {
            handlerRef.current?.(params, event, details);
          }
        };
        subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
      }
      if (cleanupTokenRef.current && registryContainer.registry) {
        // If the effect was called, it means that this render was committed
        // so we can trust the cleanup function to remove the listener.
        registryContainer.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
      return () => {
        subscription.current?.();
        subscription.current = null;
      };
    }, [apiRef, eventName, options]);
  };
}
const registryContainer = {
  registry: null
};

// TODO: move to @mui/x-data-grid/internals
// eslint-disable-next-line @typescript-eslint/naming-convention
const unstable_resetCleanupTracking = () => {
  registryContainer.registry?.reset();
  registryContainer.registry = null;
};
exports.unstable_resetCleanupTracking = unstable_resetCleanupTracking;
const useGridApiEventHandler = createUseGridApiEventHandler(registryContainer);
exports.useGridApiEventHandler = useGridApiEventHandler;
const optionsSubscriberOptions = {
  isFirst: true
};
function useGridApiOptionHandler(apiRef, eventName, handler) {
  // Validate that only one per event name?
  useGridApiEventHandler(apiRef, eventName, handler, optionsSubscriberOptions);
}