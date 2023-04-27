import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';
export var COMPACT_DENSITY_FACTOR = 0.7;
export var COMFORTABLE_DENSITY_FACTOR = 1.3;
var DENSITY_FACTORS = {
  compact: COMPACT_DENSITY_FACTOR,
  comfortable: COMFORTABLE_DENSITY_FACTOR,
  standard: 1
};
export var densityStateInitializer = function densityStateInitializer(state, props) {
  return _extends({}, state, {
    density: {
      value: props.density,
      factor: DENSITY_FACTORS[props.density]
    }
  });
};
export var useGridDensity = function useGridDensity(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useDensity');
  var setDensity = React.useCallback(function (newDensity) {
    logger.debug("Set grid density to ".concat(newDensity));
    apiRef.current.setState(function (state) {
      var currentDensityState = gridDensitySelector(state);
      var newDensityState = {
        value: newDensity,
        factor: DENSITY_FACTORS[newDensity]
      };
      if (isDeepEqual(currentDensityState, newDensityState)) {
        return state;
      }
      return _extends({}, state, {
        density: newDensityState
      });
    });
    apiRef.current.forceUpdate();
  }, [logger, apiRef]);
  React.useEffect(function () {
    apiRef.current.setDensity(props.density);
  }, [apiRef, props.density]);
  var densityApi = {
    setDensity: setDensity
  };
  useGridApiMethod(apiRef, densityApi, 'public');
};