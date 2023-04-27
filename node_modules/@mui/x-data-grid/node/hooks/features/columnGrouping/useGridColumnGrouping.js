"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridColumnGrouping = exports.columnGroupsStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _gridColumnGrouping = require("../../../models/gridColumnGrouping");
var _gridColumnGroupsSelector = require("./gridColumnGroupsSelector");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _gridColumnGroupsUtils = require("./gridColumnGroupsUtils");
var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");
var _columns = require("../columns");
var _useGridSelector = require("../../utils/useGridSelector");
const _excluded = ["groupId", "children"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const createGroupLookup = columnGroupingModel => {
  let groupLookup = {};
  columnGroupingModel.forEach(node => {
    if ((0, _gridColumnGrouping.isLeaf)(node)) {
      return;
    }
    const {
        groupId,
        children
      } = node,
      other = (0, _objectWithoutPropertiesLoose2.default)(node, _excluded);
    if (!groupId) {
      throw new Error('MUI: An element of the columnGroupingModel does not have either `field` or `groupId`.');
    }
    if (!children) {
      console.warn(`MUI: group groupId=${groupId} has no children.`);
    }
    const groupParam = (0, _extends2.default)({}, other, {
      groupId
    });
    const subTreeLookup = createGroupLookup(children);
    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(`MUI: The groupId ${groupId} is used multiple times in the columnGroupingModel.`);
    }
    groupLookup = (0, _extends2.default)({}, groupLookup, subTreeLookup, {
      [groupId]: groupParam
    });
  });
  return (0, _extends2.default)({}, groupLookup);
};
const columnGroupsStateInitializer = (state, props, apiRef) => {
  if (!props.experimentalFeatures?.columnGrouping) {
    return state;
  }
  const columnFields = (0, _columns.gridColumnFieldsSelector)(apiRef);
  const visibleColumnFields = (0, _columns.gridVisibleColumnFieldsSelector)(apiRef);
  const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
  const unwrappedGroupingModel = (0, _gridColumnGroupsUtils.unwrapGroupingColumnModel)(props.columnGroupingModel ?? []);
  const columnGroupsHeaderStructure = (0, _gridColumnGroupsUtils.getColumnGroupsHeaderStructure)(columnFields, unwrappedGroupingModel);
  const maxDepth = visibleColumnFields.length === 0 ? 0 : Math.max(...visibleColumnFields.map(field => unwrappedGroupingModel[field]?.length ?? 0));
  return (0, _extends2.default)({}, state, {
    columnGrouping: {
      lookup: groupLookup,
      unwrappedGroupingModel,
      headerStructure: columnGroupsHeaderStructure,
      maxDepth
    }
  });
};

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
exports.columnGroupsStateInitializer = columnGroupsStateInitializer;
const useGridColumnGrouping = (apiRef, props) => {
  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback(field => {
    const unwrappedGroupingModel = (0, _gridColumnGroupsSelector.gridColumnGroupsUnwrappedModelSelector)(apiRef);
    return unwrappedGroupingModel[field] ?? [];
  }, [apiRef]);
  const getAllGroupDetails = React.useCallback(() => {
    const columnGroupLookup = (0, _gridColumnGroupsSelector.gridColumnGroupsLookupSelector)(apiRef);
    return columnGroupLookup;
  }, [apiRef]);
  const columnGroupingApi = {
    unstable_getColumnGroupPath: getColumnGroupPath,
    unstable_getAllGroupDetails: getAllGroupDetails
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, columnGroupingApi, 'public');
  const handleColumnIndexChange = React.useCallback(() => {
    const unwrappedGroupingModel = (0, _gridColumnGroupsUtils.unwrapGroupingColumnModel)(props.columnGroupingModel ?? []);
    apiRef.current.setState(state => {
      const orderedFields = state.columns?.orderedFields ?? [];
      const columnGroupsHeaderStructure = (0, _gridColumnGroupsUtils.getColumnGroupsHeaderStructure)(orderedFields, unwrappedGroupingModel);
      return (0, _extends2.default)({}, state, {
        columnGrouping: (0, _extends2.default)({}, state.columnGrouping, {
          headerStructure: columnGroupsHeaderStructure
        })
      });
    });
  }, [apiRef, props.columnGroupingModel]);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnIndexChange', handleColumnIndexChange);
  const columnFields = (0, _useGridSelector.useGridSelector)(apiRef, _columns.gridColumnFieldsSelector);
  const visibleColumnFields = (0, _useGridSelector.useGridSelector)(apiRef, _columns.gridVisibleColumnFieldsSelector);
  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (!props.experimentalFeatures?.columnGrouping) {
      return;
    }
    const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
    const unwrappedGroupingModel = (0, _gridColumnGroupsUtils.unwrapGroupingColumnModel)(props.columnGroupingModel ?? []);
    const columnGroupsHeaderStructure = (0, _gridColumnGroupsUtils.getColumnGroupsHeaderStructure)(columnFields, unwrappedGroupingModel);
    const maxDepth = visibleColumnFields.length === 0 ? 0 : Math.max(...visibleColumnFields.map(field => unwrappedGroupingModel[field]?.length ?? 0));
    apiRef.current.setState(state => {
      return (0, _extends2.default)({}, state, {
        columnGrouping: {
          lookup: groupLookup,
          unwrappedGroupingModel,
          headerStructure: columnGroupsHeaderStructure,
          maxDepth
        }
      });
    });
  }, [apiRef, columnFields, visibleColumnFields, props.columnGroupingModel, props.experimentalFeatures?.columnGrouping]);
};
exports.useGridColumnGrouping = useGridColumnGrouping;