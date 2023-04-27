import _extends from "@babel/runtime/helpers/esm/extends";
// TODO v7: This file exist only to simplify typing between
// components/componentsProps and slots/slotProps
// Should be deleted when components/componentsProps are removed

export const uncapitalizeObjectKeys = capitalizedObject => {
  if (capitalizedObject === undefined) {
    return undefined;
  }
  return Object.keys(capitalizedObject).reduce((acc, key) => _extends({}, acc, {
    [`${key.charAt(0).toLowerCase()}${key.slice(1)}`]: capitalizedObject[key]
  }), {});
};