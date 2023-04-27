"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridStatePersistence = void 0;
var React = _interopRequireWildcard(require("react"));
var _utils = require("../../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useGridStatePersistence = apiRef => {
  const exportState = React.useCallback((params = {}) => {
    const stateToExport = apiRef.current.unstable_applyPipeProcessors('exportState', {}, params);
    return stateToExport;
  }, [apiRef]);
  const restoreState = React.useCallback(stateToRestore => {
    const response = apiRef.current.unstable_applyPipeProcessors('restoreState', {
      callbacks: []
    }, {
      stateToRestore
    });
    response.callbacks.forEach(callback => {
      callback();
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  const statePersistenceApi = {
    exportState,
    restoreState
  };
  (0, _utils.useGridApiMethod)(apiRef, statePersistenceApi, 'public');
};
exports.useGridStatePersistence = useGridStatePersistence;