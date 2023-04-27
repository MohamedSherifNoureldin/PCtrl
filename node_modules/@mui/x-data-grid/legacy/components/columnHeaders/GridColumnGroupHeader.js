import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_useId as useId, unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridColumnGroupsLookupSelector } from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    headerAlign = ownerState.headerAlign,
    isDragging = ownerState.isDragging,
    showColumnBorder = ownerState.showColumnBorder,
    groupId = ownerState.groupId;
  var slots = {
    root: ['columnHeader', headerAlign === 'left' && 'columnHeader--alignLeft', headerAlign === 'center' && 'columnHeader--alignCenter', headerAlign === 'right' && 'columnHeader--alignRight', isDragging && 'columnHeader--moving', showColumnBorder && 'columnHeader--showColumnBorder', showColumnBorder && 'columnHeader--withRightBorder', 'withBorderColor', groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer', 'withBorderColor'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnGroupHeader(props) {
  var _columnGroupsLookup$g;
  var groupId = props.groupId,
    width = props.width,
    depth = props.depth,
    maxDepth = props.maxDepth,
    fields = props.fields,
    height = props.height,
    colIndex = props.colIndex,
    hasFocus = props.hasFocus,
    tabIndex = props.tabIndex,
    isLastColumn = props.isLastColumn;
  var rootProps = useGridRootProps();
  var headerCellRef = React.useRef(null);
  var apiRef = useGridApiContext();
  var columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);
  var group = groupId ? columnGroupsLookup[groupId] : {};
  var _group$headerName = group.headerName,
    headerName = _group$headerName === void 0 ? groupId != null ? groupId : '' : _group$headerName,
    _group$description = group.description,
    description = _group$description === void 0 ? '' : _group$description,
    _group$headerAlign = group.headerAlign,
    headerAlign = _group$headerAlign === void 0 ? undefined : _group$headerAlign;
  var headerComponent;
  var render = groupId && ((_columnGroupsLookup$g = columnGroupsLookup[groupId]) == null ? void 0 : _columnGroupsLookup$g.renderHeaderGroup);
  var renderParams = React.useMemo(function () {
    return {
      groupId: groupId,
      headerName: headerName,
      description: description,
      depth: depth,
      maxDepth: maxDepth,
      fields: fields,
      colIndex: colIndex,
      isLastColumn: isLastColumn
    };
  }, [groupId, headerName, description, depth, maxDepth, fields, colIndex, isLastColumn]);
  if (groupId && render) {
    headerComponent = render(renderParams);
  }
  var showColumnBorder = rootProps.showColumnVerticalBorder;
  var ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showColumnBorder: showColumnBorder,
    headerAlign: headerAlign,
    depth: depth,
    isDragging: false
  });
  var label = headerName != null ? headerName : groupId;
  var id = useId();
  var elementId = groupId === null ? "empty-group-cell-".concat(id) : groupId;
  var classes = useUtilityClasses(ownerState);
  React.useLayoutEffect(function () {
    if (hasFocus) {
      var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      var elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus == null ? void 0 : elementToFocus.focus();
    }
  }, [apiRef, hasFocus]);
  var publish = React.useCallback(function (eventName) {
    return function (event) {
      // Ignore portal
      // See https://github.com/mui/mui-x/issues/1721
      if (!event.currentTarget.contains(event.target)) {
        return;
      }
      apiRef.current.publishEvent(eventName, renderParams, event);
    };
  },
  // For now this is stupid, because renderParams change all the time.
  // Need to move it's computation in the api, such that for a given depth+columnField, I can get the group parameters
  [apiRef, renderParams]);
  var mouseEventsHandlers = React.useMemo(function () {
    return {
      onKeyDown: publish('columnGroupHeaderKeyDown'),
      onFocus: publish('columnGroupHeaderFocus'),
      onBlur: publish('columnGroupHeaderBlur')
    };
  }, [publish]);
  var headerClassName = typeof group.headerClassName === 'function' ? group.headerClassName(renderParams) : group.headerClassName;
  return /*#__PURE__*/_jsx(GridGenericColumnHeaderItem, _extends({
    ref: headerCellRef,
    classes: classes,
    columnMenuOpen: false,
    colIndex: colIndex,
    height: height,
    isResizing: false,
    sortDirection: null,
    hasFocus: false,
    tabIndex: tabIndex,
    isDraggable: false,
    headerComponent: headerComponent,
    headerClassName: headerClassName,
    description: description,
    elementId: elementId,
    width: width,
    columnMenuIconButton: null,
    columnTitleIconButtons: null,
    resizable: false,
    label: label,
    "aria-colspan": fields.length
    // The fields are wrapped between |-...-| to avoid confusion between fields "id" and "id2" when using selector data-fields~=
    ,
    "data-fields": "|-".concat(fields.join('-|-'), "-|")
  }, mouseEventsHandlers));
}
export { GridColumnGroupHeader };