import * as React from 'react';
import { useGridApiMethod } from '../../utils';
export var useGridStatePersistence = function useGridStatePersistence(apiRef) {
  var exportState = React.useCallback(function () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var stateToExport = apiRef.current.unstable_applyPipeProcessors('exportState', {}, params);
    return stateToExport;
  }, [apiRef]);
  var restoreState = React.useCallback(function (stateToRestore) {
    var response = apiRef.current.unstable_applyPipeProcessors('restoreState', {
      callbacks: []
    }, {
      stateToRestore: stateToRestore
    });
    response.callbacks.forEach(function (callback) {
      callback();
    });
    apiRef.current.forceUpdate();
  }, [apiRef]);
  var statePersistenceApi = {
    exportState: exportState,
    restoreState: restoreState
  };
  useGridApiMethod(apiRef, statePersistenceApi, 'public');
};