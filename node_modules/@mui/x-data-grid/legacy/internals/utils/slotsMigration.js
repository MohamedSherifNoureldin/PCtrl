import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
// TODO v7: This file exist only to simplify typing between
// components/componentsProps and slots/slotProps
// Should be deleted when components/componentsProps are removed

export var uncapitalizeObjectKeys = function uncapitalizeObjectKeys(capitalizedObject) {
  if (capitalizedObject === undefined) {
    return undefined;
  }
  return Object.keys(capitalizedObject).reduce(function (acc, key) {
    return _extends({}, acc, _defineProperty({}, "".concat(key.charAt(0).toLowerCase()).concat(key.slice(1)), capitalizedObject[key]));
  }, {});
};