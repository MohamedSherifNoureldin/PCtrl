import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import { GRID_DEFAULT_STRATEGY, useGridRegisterStrategyProcessor } from '../../core/strategyProcessing';
import { buildRootGroup, GRID_ROOT_GROUP_ID } from './gridRowsUtils';
var createFlatRowTree = function createFlatRowTree(rows) {
  var tree = _defineProperty({}, GRID_ROOT_GROUP_ID, _extends({}, buildRootGroup(), {
    children: rows
  }));
  for (var i = 0; i < rows.length; i += 1) {
    var rowId = rows[i];
    tree[rowId] = {
      id: rowId,
      depth: 0,
      parent: GRID_ROOT_GROUP_ID,
      type: 'leaf',
      groupingKey: null
    };
  }
  return {
    groupingName: GRID_DEFAULT_STRATEGY,
    tree: tree,
    treeDepths: {
      0: rows.length
    },
    dataRowIds: rows
  };
};
var updateFlatRowTree = function updateFlatRowTree(_ref) {
  var previousTree = _ref.previousTree,
    actions = _ref.actions;
  var tree = _extends({}, previousTree);
  var idsToRemoveFromRootGroup = {};
  for (var i = 0; i < actions.remove.length; i += 1) {
    var idToDelete = actions.remove[i];
    idsToRemoveFromRootGroup[idToDelete] = true;
    delete tree[idToDelete];
  }
  for (var _i = 0; _i < actions.insert.length; _i += 1) {
    var idToInsert = actions.insert[_i];
    tree[idToInsert] = {
      id: idToInsert,
      depth: 0,
      parent: GRID_ROOT_GROUP_ID,
      type: 'leaf',
      groupingKey: null
    };
  }

  // TODO rows v6: Support row unpinning

  var rootGroup = tree[GRID_ROOT_GROUP_ID];
  var rootGroupChildren = [].concat(_toConsumableArray(rootGroup.children), _toConsumableArray(actions.insert));
  if (Object.values(idsToRemoveFromRootGroup).length) {
    rootGroupChildren = rootGroupChildren.filter(function (id) {
      return !idsToRemoveFromRootGroup[id];
    });
  }
  tree[GRID_ROOT_GROUP_ID] = _extends({}, rootGroup, {
    children: rootGroupChildren
  });
  return {
    groupingName: GRID_DEFAULT_STRATEGY,
    tree: tree,
    treeDepths: {
      0: rootGroupChildren.length
    },
    dataRowIds: rootGroupChildren
  };
};
var flatRowTreeCreationMethod = function flatRowTreeCreationMethod(params) {
  if (params.updates.type === 'full') {
    return createFlatRowTree(params.updates.rows);
  }
  return updateFlatRowTree({
    previousTree: params.previousTree,
    actions: params.updates.actions
  });
};
export var useGridRowsPreProcessors = function useGridRowsPreProcessors(apiRef) {
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'rowTreeCreation', flatRowTreeCreationMethod);
};