import * as React from 'react';
export function useGridApiMethod(privateApiRef, apiMethods, visibility) {
  const apiMethodsRef = React.useRef(apiMethods);
  const [apiMethodsNames] = React.useState(Object.keys(apiMethods));
  const installMethods = React.useCallback(() => {
    if (!privateApiRef.current) {
      return;
    }
    apiMethodsNames.forEach(methodName => {
      if (!privateApiRef.current.hasOwnProperty(methodName)) {
        privateApiRef.current.register(visibility, {
          [methodName]: (...args) => {
            const fn = apiMethodsRef.current[methodName];
            return fn(...args);
          }
        });
      }
    });
  }, [apiMethodsNames, privateApiRef, visibility]);
  React.useEffect(() => {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);
  React.useEffect(() => {
    installMethods();
  }, [installMethods]);
  installMethods();
}