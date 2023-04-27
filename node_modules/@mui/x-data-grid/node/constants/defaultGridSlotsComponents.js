"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATA_GRID_DEFAULT_SLOTS_COMPONENTS = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _components = require("../components");
var _GridColumnHeaders = require("../components/GridColumnHeaders");
var _GridColumnMenu = require("../components/menu/columnMenu/GridColumnMenu");
var _GridNoResultsOverlay = require("../components/GridNoResultsOverlay");
var _material = _interopRequireDefault(require("../material"));
const DATA_GRID_DEFAULT_SLOTS_COMPONENTS = (0, _extends2.default)({}, _material.default, {
  Cell: _components.GridCell,
  SkeletonCell: _components.GridSkeletonCell,
  ColumnHeaderFilterIconButton: _components.GridColumnHeaderFilterIconButton,
  ColumnMenu: _GridColumnMenu.GridColumnMenu,
  ColumnHeaders: _GridColumnHeaders.GridColumnHeaders,
  Footer: _components.GridFooter,
  Toolbar: null,
  PreferencesPanel: _components.GridPreferencesPanel,
  LoadingOverlay: _components.GridLoadingOverlay,
  NoResultsOverlay: _GridNoResultsOverlay.GridNoResultsOverlay,
  NoRowsOverlay: _components.GridNoRowsOverlay,
  Pagination: _components.GridPagination,
  FilterPanel: _components.GridFilterPanel,
  ColumnsPanel: _components.GridColumnsPanel,
  Panel: _components.GridPanel,
  Row: _components.GridRow
});
exports.DATA_GRID_DEFAULT_SLOTS_COMPONENTS = DATA_GRID_DEFAULT_SLOTS_COMPONENTS;