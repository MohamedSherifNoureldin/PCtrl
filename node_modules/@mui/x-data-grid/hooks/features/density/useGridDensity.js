import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';
export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;
const DENSITY_FACTORS = {
  compact: COMPACT_DENSITY_FACTOR,
  comfortable: COMFORTABLE_DENSITY_FACTOR,
  standard: 1
};
export const densityStateInitializer = (state, props) => _extends({}, state, {
  density: {
    value: props.density,
    factor: DENSITY_FACTORS[props.density]
  }
});
export const useGridDensity = (apiRef, props) => {
  const logger = useGridLogger(apiRef, 'useDensity');
  const setDensity = React.useCallback(newDensity => {
    logger.debug(`Set grid density to ${newDensity}`);
    apiRef.current.setState(state => {
      const currentDensityState = gridDensitySelector(state);
      const newDensityState = {
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
  React.useEffect(() => {
    apiRef.current.setDensity(props.density);
  }, [apiRef, props.density]);
  const densityApi = {
    setDensity
  };
  useGridApiMethod(apiRef, densityApi, 'public');
};