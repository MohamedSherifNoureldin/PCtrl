import * as React from 'react';
export var useGridInitializeState = function useGridInitializeState(initializer, privateApiRef, props) {
  var isInitialized = React.useRef(false);
  if (!isInitialized.current) {
    privateApiRef.current.state = initializer(privateApiRef.current.state, props, privateApiRef);
    isInitialized.current = true;
  }
};