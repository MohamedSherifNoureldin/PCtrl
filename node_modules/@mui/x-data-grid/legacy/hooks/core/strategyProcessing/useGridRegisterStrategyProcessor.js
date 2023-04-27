import * as React from 'react';
import { useFirstRender } from '../../utils/useFirstRender';
export var useGridRegisterStrategyProcessor = function useGridRegisterStrategyProcessor(apiRef, strategyName, group, processor) {
  var registerPreProcessor = React.useCallback(function () {
    apiRef.current.registerStrategyProcessor(strategyName, group, processor);
  }, [apiRef, processor, group, strategyName]);
  useFirstRender(function () {
    registerPreProcessor();
  });
  var isFirstRender = React.useRef(true);
  React.useEffect(function () {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      registerPreProcessor();
    }
  }, [registerPreProcessor]);
};