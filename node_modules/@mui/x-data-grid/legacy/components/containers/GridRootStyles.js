import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { alpha, styled, darken, lighten } from '@mui/material/styles';
import { gridClasses } from '../../constants/gridClasses';
function getBorderColor(theme) {
  if (theme.vars) {
    return theme.vars.palette.TableCell.border;
  }
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}
export var GridRootStyles = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    return [_defineProperty({}, "&.".concat(gridClasses.autoHeight), styles.autoHeight), _defineProperty({}, "&.".concat(gridClasses.aggregationColumnHeader), styles.aggregationColumnHeader), _defineProperty({}, "&.".concat(gridClasses['aggregationColumnHeader--alignLeft']), styles['aggregationColumnHeader--alignLeft']), _defineProperty({}, "&.".concat(gridClasses['aggregationColumnHeader--alignCenter']), styles['aggregationColumnHeader--alignCenter']), _defineProperty({}, "&.".concat(gridClasses['aggregationColumnHeader--alignRight']), styles['aggregationColumnHeader--alignRight']), _defineProperty({}, "&.".concat(gridClasses.aggregationColumnHeaderLabel), styles.aggregationColumnHeaderLabel), _defineProperty({}, "&.".concat(gridClasses['root--disableUserSelection'], " .").concat(gridClasses.cell), styles['root--disableUserSelection']), _defineProperty({}, "& .".concat(gridClasses.editBooleanCell), styles.editBooleanCell), _defineProperty({}, "& .".concat(gridClasses['cell--editing']), styles['cell--editing']), _defineProperty({}, "& .".concat(gridClasses['cell--textCenter']), styles['cell--textCenter']), _defineProperty({}, "& .".concat(gridClasses['cell--textLeft']), styles['cell--textLeft']), _defineProperty({}, "& .".concat(gridClasses['cell--textRight']), styles['cell--textRight']), // TODO v6: Remove
    _defineProperty({}, "& .".concat(gridClasses['cell--withRenderer']), styles['cell--withRenderer']), _defineProperty({}, "& .".concat(gridClasses.cell), styles.cell), _defineProperty({}, "& .".concat(gridClasses['cell--rangeTop']), styles['cell--rangeTop']), _defineProperty({}, "& .".concat(gridClasses['cell--rangeBottom']), styles['cell--rangeBottom']), _defineProperty({}, "& .".concat(gridClasses['cell--rangeLeft']), styles['cell--rangeLeft']), _defineProperty({}, "& .".concat(gridClasses['cell--rangeRight']), styles['cell--rangeRight']), _defineProperty({}, "& .".concat(gridClasses.cellContent), styles.cellContent), _defineProperty({}, "& .".concat(gridClasses.cellCheckbox), styles.cellCheckbox), _defineProperty({}, "& .".concat(gridClasses.cellSkeleton), styles.cellSkeleton), _defineProperty({}, "& .".concat(gridClasses.checkboxInput), styles.checkboxInput), _defineProperty({}, "& .".concat(gridClasses['columnHeader--alignCenter']), styles['columnHeader--alignCenter']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--alignLeft']), styles['columnHeader--alignLeft']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--alignRight']), styles['columnHeader--alignRight']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--dragging']), styles['columnHeader--dragging']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--moving']), styles['columnHeader--moving']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--numeric']), styles['columnHeader--numeric']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--sortable']), styles['columnHeader--sortable']), _defineProperty({}, "& .".concat(gridClasses['columnHeader--sorted']), styles['columnHeader--sorted']), _defineProperty({}, "& .".concat(gridClasses.columnHeader), styles.columnHeader), _defineProperty({}, "& .".concat(gridClasses.columnHeaderCheckbox), styles.columnHeaderCheckbox), _defineProperty({}, "& .".concat(gridClasses.columnHeaderDraggableContainer), styles.columnHeaderDraggableContainer), _defineProperty({}, "& .".concat(gridClasses.columnHeaderTitleContainer), styles.columnHeaderTitleContainer), _defineProperty({}, "& .".concat(gridClasses['columnSeparator--resizable']), styles['columnSeparator--resizable']), _defineProperty({}, "& .".concat(gridClasses['columnSeparator--resizing']), styles['columnSeparator--resizing']), _defineProperty({}, "& .".concat(gridClasses.columnSeparator), styles.columnSeparator), _defineProperty({}, "& .".concat(gridClasses.filterIcon), styles.filterIcon), _defineProperty({}, "& .".concat(gridClasses.iconSeparator), styles.iconSeparator), _defineProperty({}, "& .".concat(gridClasses.menuIcon), styles.menuIcon), _defineProperty({}, "& .".concat(gridClasses.menuIconButton), styles.menuIconButton), _defineProperty({}, "& .".concat(gridClasses.menuOpen), styles.menuOpen), _defineProperty({}, "& .".concat(gridClasses.menuList), styles.menuList), _defineProperty({}, "& .".concat(gridClasses['row--editable']), styles['row--editable']), _defineProperty({}, "& .".concat(gridClasses['row--editing']), styles['row--editing']), _defineProperty({}, "& .".concat(gridClasses['row--dragging']), styles['row--dragging']), _defineProperty({}, "& .".concat(gridClasses.row), styles.row), _defineProperty({}, "& .".concat(gridClasses.rowReorderCellPlaceholder), styles.rowReorderCellPlaceholder), _defineProperty({}, "& .".concat(gridClasses.rowReorderCell), styles.rowReorderCell), _defineProperty({}, "& .".concat(gridClasses['rowReorderCell--draggable']), styles['rowReorderCell--draggable']), _defineProperty({}, "& .".concat(gridClasses.sortIcon), styles.sortIcon), _defineProperty({}, "& .".concat(gridClasses.withBorderColor), styles.withBorderColor), _defineProperty({}, "& .".concat(gridClasses.treeDataGroupingCell), styles.treeDataGroupingCell), _defineProperty({}, "& .".concat(gridClasses.treeDataGroupingCellToggle), styles.treeDataGroupingCellToggle), _defineProperty({}, "& .".concat(gridClasses.detailPanelToggleCell), styles.detailPanelToggleCell), _defineProperty({}, "& .".concat(gridClasses['detailPanelToggleCell--expanded']), styles['detailPanelToggleCell--expanded']), styles.root];
  }
})(function (_ref57) {
  var _$concat2, _$concat3, _extends2;
  var theme = _ref57.theme;
  var borderColor = getBorderColor(theme);
  var radius = theme.shape.borderRadius;
  var gridStyle = _extends({
    '--unstable_DataGrid-radius': typeof radius === 'number' ? "".concat(radius, "px") : radius,
    '--unstable_DataGrid-headWeight': theme.typography.fontWeightMedium,
    '--unstable_DataGrid-overlayBackground': theme.vars ? "rgba(".concat(theme.vars.palette.background.defaultChannel, " / ").concat(theme.vars.palette.action.disabledOpacity, ")") : alpha(theme.palette.background.default, theme.palette.action.disabledOpacity),
    flex: 1,
    boxSizing: 'border-box',
    position: 'relative',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: borderColor,
    borderRadius: 'var(--unstable_DataGrid-radius)',
    color: (theme.vars || theme).palette.text.primary
  }, theme.typography.body2, (_extends2 = {
    outline: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowAnchor: 'none'
  }, _defineProperty(_extends2, "&.".concat(gridClasses.autoHeight), _defineProperty({
    height: 'auto'
  }, "& .".concat(gridClasses['row--lastVisible'], " .").concat(gridClasses.cell), {
    borderBottomColor: 'transparent'
  })), _defineProperty(_extends2, "& .".concat(gridClasses['virtualScrollerContent--overflowed'], " .").concat(gridClasses['row--lastVisible'], " .").concat(gridClasses.cell), {
    borderBottomColor: 'transparent'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader, ", & .").concat(gridClasses.cell), {
    WebkitTapHighlightColor: 'transparent',
    lineHeight: null,
    padding: '0 10px',
    boxSizing: 'border-box'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader, ":focus-within, & .").concat(gridClasses.cell, ":focus-within"), {
    outline: "solid ".concat(theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / 0.5)") : alpha(theme.palette.primary.main, 0.5), " 1px"),
    outlineWidth: 1,
    outlineOffset: -1
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader, ":focus, & .").concat(gridClasses.cell, ":focus"), {
    outline: "solid ".concat(theme.palette.primary.main, " 1px")
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeaderCheckbox, ", & .").concat(gridClasses.cellCheckbox), {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader), {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--sorted'], " .").concat(gridClasses.iconButtonContainer, ", & .").concat(gridClasses['columnHeader--filtered'], " .").concat(gridClasses.iconButtonContainer), {
    visibility: 'visible',
    width: 'auto'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader, ":not(.").concat(gridClasses['columnHeader--sorted'], ") .").concat(gridClasses.sortIcon), {
    opacity: 0,
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.shorter
    })
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader, ":not(.").concat(gridClasses['columnHeader--sorted'], "):hover .").concat(gridClasses.sortIcon), {
    opacity: 0.5
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeaderTitleContainer), {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeaderTitleContainerContent), {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--filledGroup'], " .").concat(gridClasses.columnHeaderTitleContainer), {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    boxSizing: 'border-box'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--filledGroup'], ".").concat(gridClasses['columnHeader--showColumnBorder'], " .").concat(gridClasses.columnHeaderTitleContainer), {
    borderBottom: "none"
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--filledGroup'], ".").concat(gridClasses['columnHeader--showColumnBorder']), {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    boxSizing: 'border-box'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.sortIcon, ", & .").concat(gridClasses.filterIcon), {
    fontSize: 'inherit'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--sortable']), {
    cursor: 'pointer'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--alignCenter'], " .").concat(gridClasses.columnHeaderTitleContainer), {
    justifyContent: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--alignRight'], " .").concat(gridClasses.columnHeaderDraggableContainer, ", & .").concat(gridClasses['columnHeader--alignRight'], " .").concat(gridClasses.columnHeaderTitleContainer), {
    flexDirection: 'row-reverse'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--alignCenter'], " .").concat(gridClasses.menuIcon, ", & .").concat(gridClasses['columnHeader--alignRight'], " .").concat(gridClasses.menuIcon), {
    marginRight: 'auto',
    marginLeft: -6
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--alignRight'], " .").concat(gridClasses.menuIcon, ", & .").concat(gridClasses['columnHeader--alignRight'], " .").concat(gridClasses.menuIcon), {
    marginRight: 'auto',
    marginLeft: -10
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--moving']), {
    backgroundColor: (theme.vars || theme).palette.action.hover
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnSeparator), {
    visibility: 'hidden',
    position: 'absolute',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: borderColor
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeaders, ":hover .").concat(gridClasses.columnSeparator, ", .").concat(gridClasses['columnSeparator--resizing']), {
    visibility: 'visible',
    width: 'auto'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnSeparator--sideLeft']), {
    left: -12
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnSeparator--sideRight']), {
    right: -12
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnSeparator--resizable']), (_$concat2 = {
    cursor: 'col-resize',
    touchAction: 'none',
    '&:hover': {
      color: (theme.vars || theme).palette.text.primary,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        color: borderColor
      }
    }
  }, _defineProperty(_$concat2, "&.".concat(gridClasses['columnSeparator--resizing']), {
    color: (theme.vars || theme).palette.text.primary
  }), _defineProperty(_$concat2, '& svg', {
    pointerEvents: 'none'
  }), _$concat2)), _defineProperty(_extends2, "& .".concat(gridClasses.iconSeparator), {
    color: 'inherit'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.menuIcon), {
    width: 0,
    visibility: 'hidden',
    fontSize: 20,
    marginRight: -10,
    display: 'flex',
    alignItems: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeader, ":hover"), (_$concat3 = {}, _defineProperty(_$concat3, "& .".concat(gridClasses.iconButtonContainer), {
    visibility: 'visible',
    width: 'auto'
  }), _defineProperty(_$concat3, "& .".concat(gridClasses.menuIcon), {
    width: 'auto',
    visibility: 'visible'
  }), _$concat3)), _defineProperty(_extends2, ".".concat(gridClasses.menuOpen), {
    visibility: 'visible',
    width: 'auto'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.row), {
    display: 'flex',
    width: 'fit-content',
    breakInside: 'avoid',
    // Avoid the row to be broken in two different print pages.
    '&:hover, &.Mui-hovered': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    '&.Mui-selected': {
      backgroundColor: theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity, ")") : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity + theme.palette.action.hoverOpacity, ")") : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity, ")") : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        }
      }
    }
  }), _defineProperty(_extends2, "& .".concat(gridClasses.cell), {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid',
    '&.Mui-selected': {
      backgroundColor: theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity, ")") : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity + theme.palette.action.hoverOpacity, ")") : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.vars ? "rgba(".concat(theme.vars.palette.primary.mainChannel, " / ").concat(theme.vars.palette.action.selectedOpacity, ")") : alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        }
      }
    }
  }), _defineProperty(_extends2, "&.".concat(gridClasses['root--disableUserSelection'], " .").concat(gridClasses.cell), {
    userSelect: 'none'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.row, ":not(.").concat(gridClasses['row--dynamicHeight'], ") > .").concat(gridClasses.cell), {
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.cellContent), {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.cell, ".").concat(gridClasses['cell--editing']), {
    padding: 1,
    display: 'flex',
    boxShadow: theme.shadows[2],
    backgroundColor: (theme.vars || theme).palette.background.paper,
    '&:focus-within': {
      outline: "solid ".concat((theme.vars || theme).palette.primary.main, " 1px"),
      outlineOffset: '-1px'
    }
  }), _defineProperty(_extends2, "& .".concat(gridClasses['row--editing']), {
    boxShadow: theme.shadows[2]
  }), _defineProperty(_extends2, "& .".concat(gridClasses['row--editing'], " .").concat(gridClasses.cell), {
    boxShadow: theme.shadows[0],
    backgroundColor: (theme.vars || theme).palette.background.paper
  }), _defineProperty(_extends2, "& .".concat(gridClasses.editBooleanCell), {
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.booleanCell, "[data-value=\"true\"]"), {
    color: (theme.vars || theme).palette.text.secondary
  }), _defineProperty(_extends2, "& .".concat(gridClasses.booleanCell, "[data-value=\"false\"]"), {
    color: (theme.vars || theme).palette.text.disabled
  }), _defineProperty(_extends2, "& .".concat(gridClasses.actionsCell), {
    display: 'inline-flex',
    alignItems: 'center',
    gridGap: theme.spacing(1)
  }), _defineProperty(_extends2, "& .".concat(gridClasses.rowReorderCell), {
    display: 'inline-flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: (theme.vars || theme).palette.action.disabledOpacity
  }), _defineProperty(_extends2, "& .".concat(gridClasses['rowReorderCell--draggable']), {
    cursor: 'move',
    opacity: 1
  }), _defineProperty(_extends2, "& .".concat(gridClasses.rowReorderCellContainer), {
    padding: 0,
    alignItems: 'stretch'
  }), _defineProperty(_extends2, ".".concat(gridClasses.withBorderColor), {
    borderColor: borderColor
  }), _defineProperty(_extends2, "& .".concat(gridClasses['cell--withRightBorder']), {
    borderRightWidth: '1px',
    borderRightStyle: 'solid'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--withRightBorder']), {
    borderRightWidth: '1px',
    borderRightStyle: 'solid'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['cell--textLeft']), {
    justifyContent: 'flex-start'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['cell--textRight']), {
    justifyContent: 'flex-end'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['cell--textCenter']), {
    justifyContent: 'center'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.columnHeaderDraggableContainer), {
    display: 'flex',
    width: '100%',
    height: '100%'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.rowReorderCellPlaceholder), {
    display: 'none'
  }), _defineProperty(_extends2, "& .".concat(gridClasses['columnHeader--dragging'], ", & .").concat(gridClasses['row--dragging']), {
    background: (theme.vars || theme).palette.background.paper,
    padding: '0 12px',
    borderRadius: 'var(--unstable_DataGrid-radius)',
    opacity: (theme.vars || theme).palette.action.disabledOpacity
  }), _defineProperty(_extends2, "& .".concat(gridClasses['row--dragging']), _defineProperty({
    background: (theme.vars || theme).palette.background.paper,
    padding: '0 12px',
    borderRadius: 'var(--unstable_DataGrid-radius)',
    opacity: (theme.vars || theme).palette.action.disabledOpacity
  }, "& .".concat(gridClasses.rowReorderCellPlaceholder), {
    display: 'flex'
  })), _defineProperty(_extends2, "& .".concat(gridClasses.treeDataGroupingCell), {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.treeDataGroupingCellToggle), {
    flex: '0 0 28px',
    alignSelf: 'stretch',
    marginRight: theme.spacing(2)
  }), _defineProperty(_extends2, "& .".concat(gridClasses.groupingCriteriaCell), {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  }), _defineProperty(_extends2, "& .".concat(gridClasses.groupingCriteriaCellToggle), {
    flex: '0 0 28px',
    alignSelf: 'stretch',
    marginRight: theme.spacing(2)
  }), _extends2));
  return gridStyle;
});