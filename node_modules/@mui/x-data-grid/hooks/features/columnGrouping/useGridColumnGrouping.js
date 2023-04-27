import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["groupId", "children"];
import * as React from 'react';
import { isLeaf } from '../../../models/gridColumnGrouping';
import { gridColumnGroupsLookupSelector, gridColumnGroupsUnwrappedModelSelector } from './gridColumnGroupsSelector';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { getColumnGroupsHeaderStructure, unwrapGroupingColumnModel } from './gridColumnGroupsUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { gridColumnFieldsSelector,
// GridColumnsState,
gridVisibleColumnFieldsSelector } from '../columns';
import { useGridSelector } from '../../utils/useGridSelector';
const createGroupLookup = columnGroupingModel => {
  let groupLookup = {};
  columnGroupingModel.forEach(node => {
    if (isLeaf(node)) {
      return;
    }
    const {
        groupId,
        children
      } = node,
      other = _objectWithoutPropertiesLoose(node, _excluded);
    if (!groupId) {
      throw new Error('MUI: An element of the columnGroupingModel does not have either `field` or `groupId`.');
    }
    if (!children) {
      console.warn(`MUI: group groupId=${groupId} has no children.`);
    }
    const groupParam = _extends({}, other, {
      groupId
    });
    const subTreeLookup = createGroupLookup(children);
    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(`MUI: The groupId ${groupId} is used multiple times in the columnGroupingModel.`);
    }
    groupLookup = _extends({}, groupLookup, subTreeLookup, {
      [groupId]: groupParam
    });
  });
  return _extends({}, groupLookup);
};
export const columnGroupsStateInitializer = (state, props, apiRef) => {
  var _props$experimentalFe, _props$columnGrouping, _props$columnGrouping2;
  if (!((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.columnGrouping)) {
    return state;
  }
  const columnFields = gridColumnFieldsSelector(apiRef);
  const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
  const groupLookup = createGroupLookup((_props$columnGrouping = props.columnGroupingModel) != null ? _props$columnGrouping : []);
  const unwrappedGroupingModel = unwrapGroupingColumnModel((_props$columnGrouping2 = props.columnGroupingModel) != null ? _props$columnGrouping2 : []);
  const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(columnFields, unwrappedGroupingModel);
  const maxDepth = visibleColumnFields.length === 0 ? 0 : Math.max(...visibleColumnFields.map(field => {
    var _unwrappedGroupingMod, _unwrappedGroupingMod2;
    return (_unwrappedGroupingMod = (_unwrappedGroupingMod2 = unwrappedGroupingModel[field]) == null ? void 0 : _unwrappedGroupingMod2.length) != null ? _unwrappedGroupingMod : 0;
  }));
  return _extends({}, state, {
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
export const useGridColumnGrouping = (apiRef, props) => {
  var _props$experimentalFe3;
  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback(field => {
    var _unwrappedGroupingMod3;
    const unwrappedGroupingModel = gridColumnGroupsUnwrappedModelSelector(apiRef);
    return (_unwrappedGroupingMod3 = unwrappedGroupingModel[field]) != null ? _unwrappedGroupingMod3 : [];
  }, [apiRef]);
  const getAllGroupDetails = React.useCallback(() => {
    const columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);
    return columnGroupLookup;
  }, [apiRef]);
  const columnGroupingApi = {
    unstable_getColumnGroupPath: getColumnGroupPath,
    unstable_getAllGroupDetails: getAllGroupDetails
  };
  useGridApiMethod(apiRef, columnGroupingApi, 'public');
  const handleColumnIndexChange = React.useCallback(() => {
    var _props$columnGrouping3;
    const unwrappedGroupingModel = unwrapGroupingColumnModel((_props$columnGrouping3 = props.columnGroupingModel) != null ? _props$columnGrouping3 : []);
    apiRef.current.setState(state => {
      var _state$columns$ordere, _state$columns;
      const orderedFields = (_state$columns$ordere = (_state$columns = state.columns) == null ? void 0 : _state$columns.orderedFields) != null ? _state$columns$ordere : [];
      const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(orderedFields, unwrappedGroupingModel);
      return _extends({}, state, {
        columnGrouping: _extends({}, state.columnGrouping, {
          headerStructure: columnGroupsHeaderStructure
        })
      });
    });
  }, [apiRef, props.columnGroupingModel]);
  useGridApiEventHandler(apiRef, 'columnIndexChange', handleColumnIndexChange);
  const columnFields = useGridSelector(apiRef, gridColumnFieldsSelector);
  const visibleColumnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  /**
   * EFFECTS
   */
  React.useEffect(() => {
    var _props$experimentalFe2, _props$columnGrouping4, _props$columnGrouping5;
    if (!((_props$experimentalFe2 = props.experimentalFeatures) != null && _props$experimentalFe2.columnGrouping)) {
      return;
    }
    const groupLookup = createGroupLookup((_props$columnGrouping4 = props.columnGroupingModel) != null ? _props$columnGrouping4 : []);
    const unwrappedGroupingModel = unwrapGroupingColumnModel((_props$columnGrouping5 = props.columnGroupingModel) != null ? _props$columnGrouping5 : []);
    const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(columnFields, unwrappedGroupingModel);
    const maxDepth = visibleColumnFields.length === 0 ? 0 : Math.max(...visibleColumnFields.map(field => {
      var _unwrappedGroupingMod4, _unwrappedGroupingMod5;
      return (_unwrappedGroupingMod4 = (_unwrappedGroupingMod5 = unwrappedGroupingModel[field]) == null ? void 0 : _unwrappedGroupingMod5.length) != null ? _unwrappedGroupingMod4 : 0;
    }));
    apiRef.current.setState(state => {
      return _extends({}, state, {
        columnGrouping: {
          lookup: groupLookup,
          unwrappedGroupingModel,
          headerStructure: columnGroupsHeaderStructure,
          maxDepth
        }
      });
    });
  }, [apiRef, columnFields, visibleColumnFields, props.columnGroupingModel, (_props$experimentalFe3 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe3.columnGrouping]);
};