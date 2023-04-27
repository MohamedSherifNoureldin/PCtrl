import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { isLeaf } from '../../../models/gridColumnGrouping';
import { isDeepEqual } from '../../../utils/utils';
// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
var recurrentUnwrapGroupingColumnModel = function recurrentUnwrapGroupingColumnModel(columnGroupNode, parents, unwrappedGroupingModelToComplete) {
  if (isLeaf(columnGroupNode)) {
    if (unwrappedGroupingModelToComplete[columnGroupNode.field] !== undefined) {
      throw new Error(["MUI: columnGroupingModel contains duplicated field", "column field ".concat(columnGroupNode.field, " occurs two times in the grouping model:"), "- ".concat(unwrappedGroupingModelToComplete[columnGroupNode.field].join(' > ')), "- ".concat(parents.join(' > '))].join('\n'));
    }
    unwrappedGroupingModelToComplete[columnGroupNode.field] = parents;
    return;
  }
  var groupId = columnGroupNode.groupId,
    children = columnGroupNode.children;
  children.forEach(function (child) {
    recurrentUnwrapGroupingColumnModel(child, [].concat(_toConsumableArray(parents), [groupId]), unwrappedGroupingModelToComplete);
  });
};

/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */
export var unwrapGroupingColumnModel = function unwrapGroupingColumnModel(columnGroupingModel) {
  if (!columnGroupingModel) {
    return {};
  }
  var unwrappedSubTree = {};
  columnGroupingModel.forEach(function (columnGroupNode) {
    recurrentUnwrapGroupingColumnModel(columnGroupNode, [], unwrappedSubTree);
  });
  return unwrappedSubTree;
};
export var getColumnGroupsHeaderStructure = function getColumnGroupsHeaderStructure(orderedColumns, unwrappedGroupingModel) {
  var getParents = function getParents(field) {
    var _unwrappedGroupingMod;
    return (_unwrappedGroupingMod = unwrappedGroupingModel[field]) != null ? _unwrappedGroupingMod : [];
  };
  var groupingHeaderStructure = [];
  var maxDepth = Math.max.apply(Math, _toConsumableArray(orderedColumns.map(function (field) {
    return getParents(field).length;
  })));
  var haveSameParents = function haveSameParents(field1, field2, depth) {
    return isDeepEqual(getParents(field1).slice(0, depth + 1), getParents(field2).slice(0, depth + 1));
  };
  var _loop = function _loop(depth) {
    var depthStructure = orderedColumns.reduce(function (structure, newField) {
      var _getParents$depth;
      var groupId = (_getParents$depth = getParents(newField)[depth]) != null ? _getParents$depth : null;
      if (structure.length === 0) {
        return [{
          columnFields: [newField],
          groupId: groupId
        }];
      }
      var lastGroup = structure[structure.length - 1];
      var prevField = lastGroup.columnFields[lastGroup.columnFields.length - 1];
      var prevGroupId = lastGroup.groupId;
      if (prevGroupId !== groupId || !haveSameParents(prevField, newField, depth)) {
        // It's a new group
        return [].concat(_toConsumableArray(structure), [{
          columnFields: [newField],
          groupId: groupId
        }]);
      }

      // It extends the previous group
      return [].concat(_toConsumableArray(structure.slice(0, structure.length - 1)), [{
        columnFields: [].concat(_toConsumableArray(lastGroup.columnFields), [newField]),
        groupId: groupId
      }]);
    }, []);
    groupingHeaderStructure.push(depthStructure);
  };
  for (var depth = 0; depth < maxDepth; depth += 1) {
    _loop(depth);
  }
  return groupingHeaderStructure;
};