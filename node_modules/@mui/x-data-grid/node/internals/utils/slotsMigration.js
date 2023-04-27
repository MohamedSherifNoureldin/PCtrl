"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uncapitalizeObjectKeys = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
// TODO v7: This file exist only to simplify typing between
// components/componentsProps and slots/slotProps
// Should be deleted when components/componentsProps are removed

const uncapitalizeObjectKeys = capitalizedObject => {
  if (capitalizedObject === undefined) {
    return undefined;
  }
  return Object.keys(capitalizedObject).reduce((acc, key) => (0, _extends2.default)({}, acc, {
    [`${key.charAt(0).toLowerCase()}${key.slice(1)}`]: capitalizedObject[key]
  }), {});
};
exports.uncapitalizeObjectKeys = uncapitalizeObjectKeys;