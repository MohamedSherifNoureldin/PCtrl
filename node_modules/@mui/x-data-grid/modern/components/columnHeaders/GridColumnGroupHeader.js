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
const useUtilityClasses = ownerState => {
  const {
    classes,
    headerAlign,
    isDragging,
    showColumnBorder,
    groupId
  } = ownerState;
  const slots = {
    root: ['columnHeader', headerAlign === 'left' && 'columnHeader--alignLeft', headerAlign === 'center' && 'columnHeader--alignCenter', headerAlign === 'right' && 'columnHeader--alignRight', isDragging && 'columnHeader--moving', showColumnBorder && 'columnHeader--showColumnBorder', showColumnBorder && 'columnHeader--withRightBorder', 'withBorderColor', groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer', 'withBorderColor'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnGroupHeader(props) {
  const {
    groupId,
    width,
    depth,
    maxDepth,
    fields,
    height,
    colIndex,
    hasFocus,
    tabIndex,
    isLastColumn
  } = props;
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef(null);
  const apiRef = useGridApiContext();
  const columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);
  const group = groupId ? columnGroupsLookup[groupId] : {};
  const {
    headerName = groupId ?? '',
    description = '',
    headerAlign = undefined
  } = group;
  let headerComponent;
  const render = groupId && columnGroupsLookup[groupId]?.renderHeaderGroup;
  const renderParams = React.useMemo(() => ({
    groupId,
    headerName,
    description,
    depth,
    maxDepth,
    fields,
    colIndex,
    isLastColumn
  }), [groupId, headerName, description, depth, maxDepth, fields, colIndex, isLastColumn]);
  if (groupId && render) {
    headerComponent = render(renderParams);
  }
  const showColumnBorder = rootProps.showColumnVerticalBorder;
  const ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showColumnBorder,
    headerAlign,
    depth,
    isDragging: false
  });
  const label = headerName ?? groupId;
  const id = useId();
  const elementId = groupId === null ? `empty-group-cell-${id}` : groupId;
  const classes = useUtilityClasses(ownerState);
  React.useLayoutEffect(() => {
    if (hasFocus) {
      const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
    }
  }, [apiRef, hasFocus]);
  const publish = React.useCallback(eventName => event => {
    // Ignore portal
    // See https://github.com/mui/mui-x/issues/1721
    if (!event.currentTarget.contains(event.target)) {
      return;
    }
    apiRef.current.publishEvent(eventName, renderParams, event);
  },
  // For now this is stupid, because renderParams change all the time.
  // Need to move it's computation in the api, such that for a given depth+columnField, I can get the group parameters
  [apiRef, renderParams]);
  const mouseEventsHandlers = React.useMemo(() => ({
    onKeyDown: publish('columnGroupHeaderKeyDown'),
    onFocus: publish('columnGroupHeaderFocus'),
    onBlur: publish('columnGroupHeaderBlur')
  }), [publish]);
  const headerClassName = typeof group.headerClassName === 'function' ? group.headerClassName(renderParams) : group.headerClassName;
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
    "data-fields": `|-${fields.join('-|-')}-|`
  }, mouseEventsHandlers));
}
export { GridColumnGroupHeader };