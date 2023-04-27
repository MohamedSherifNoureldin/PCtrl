import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
export function useGridApiMethod(privateApiRef, apiMethods, visibility) {
  var apiMethodsRef = React.useRef(apiMethods);
  var _React$useState = React.useState(Object.keys(apiMethods)),
    _React$useState2 = _slicedToArray(_React$useState, 1),
    apiMethodsNames = _React$useState2[0];
  var installMethods = React.useCallback(function () {
    if (!privateApiRef.current) {
      return;
    }
    apiMethodsNames.forEach(function (methodName) {
      if (!privateApiRef.current.hasOwnProperty(methodName)) {
        privateApiRef.current.register(visibility, _defineProperty({}, methodName, function () {
          var fn = apiMethodsRef.current[methodName];
          return fn.apply(void 0, arguments);
        }));
      }
    });
  }, [apiMethodsNames, privateApiRef, visibility]);
  React.useEffect(function () {
    apiMethodsRef.current = apiMethods;
  }, [apiMethods]);
  React.useEffect(function () {
    installMethods();
  }, [installMethods]);
  installMethods();
}