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
  if (!props.experimentalFeatures?.columnGrouping) {
    return state;
  }
  const columnFields = gridColumnFieldsSelector(apiRef);
  const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
  const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
  const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel ?? []);
  const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(columnFields, unwrappedGroupingModel);
  const maxDepth = visibleColumnFields.length === 0 ? 0 : Math.max(...visibleColumnFields.map(field => unwrappedGroupingModel[field]?.length ?? 0));
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
  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback(field => {
    const unwrappedGroupingModel = gridColumnGroupsUnwrappedModelSelector(apiRef);
    return unwrappedGroupingModel[field] ?? [];
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
    const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel ?? []);
    apiRef.current.setState(state => {
      const orderedFields = state.columns?.orderedFields ?? [];
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
    if (!props.experimentalFeatures?.columnGrouping) {
      return;
    }
    const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
    const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel ?? []);
    const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(columnFields, unwrappedGroupingModel);
    const maxDepth = visibleColumnFields.length === 0 ? 0 : Math.max(...visibleColumnFields.map(field => unwrappedGroupingModel[field]?.length ?? 0));
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
  }, [apiRef, columnFields, visibleColumnFields, props.columnGroupingModel, props.experimentalFeatures?.columnGrouping]);
};