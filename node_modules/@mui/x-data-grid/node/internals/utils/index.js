"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _computeSlots = require("./computeSlots");
Object.keys(_computeSlots).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _computeSlots[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _computeSlots[key];
    }
  });
});
var _slotsMigration = require("./slotsMigration");
Object.keys(_slotsMigration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _slotsMigration[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _slotsMigration[key];
    }
  });
});