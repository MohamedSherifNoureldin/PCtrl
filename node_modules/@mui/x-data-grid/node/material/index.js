"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _Switch = _interopRequireDefault(require("@mui/material/Switch"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Popper = _interopRequireDefault(require("@mui/material/Popper"));
var _InputLabel = _interopRequireDefault(require("@mui/material/InputLabel"));
var _GridColumnUnsortedIcon = require("./icons/GridColumnUnsortedIcon");
var _icons = require("./icons");
var _MUISelectOption = _interopRequireDefault(require("./components/MUISelectOption"));
const iconSlots = {
  BooleanCellTrueIcon: _icons.GridCheckIcon,
  BooleanCellFalseIcon: _icons.GridCloseIcon,
  ColumnMenuIcon: _icons.GridTripleDotsVerticalIcon,
  OpenFilterButtonIcon: _icons.GridFilterListIcon,
  FilterPanelDeleteIcon: _icons.GridCloseIcon,
  ColumnFilteredIcon: _icons.GridFilterAltIcon,
  ColumnSelectorIcon: _icons.GridColumnIcon,
  ColumnUnsortedIcon: _GridColumnUnsortedIcon.GridColumnUnsortedIcon,
  ColumnSortedAscendingIcon: _icons.GridArrowUpwardIcon,
  ColumnSortedDescendingIcon: _icons.GridArrowDownwardIcon,
  ColumnResizeIcon: _icons.GridSeparatorIcon,
  DensityCompactIcon: _icons.GridViewHeadlineIcon,
  DensityStandardIcon: _icons.GridTableRowsIcon,
  DensityComfortableIcon: _icons.GridViewStreamIcon,
  ExportIcon: _icons.GridSaveAltIcon,
  MoreActionsIcon: _icons.GridMoreVertIcon,
  TreeDataCollapseIcon: _icons.GridExpandMoreIcon,
  TreeDataExpandIcon: _icons.GridKeyboardArrowRight,
  GroupingCriteriaCollapseIcon: _icons.GridExpandMoreIcon,
  GroupingCriteriaExpandIcon: _icons.GridKeyboardArrowRight,
  DetailPanelExpandIcon: _icons.GridAddIcon,
  DetailPanelCollapseIcon: _icons.GridRemoveIcon,
  RowReorderIcon: _icons.GridDragIcon,
  QuickFilterIcon: _icons.GridSearchIcon,
  QuickFilterClearIcon: _icons.GridCloseIcon,
  ColumnMenuHideIcon: _icons.GridVisibilityOffIcon,
  ColumnMenuSortAscendingIcon: _icons.GridArrowUpwardIcon,
  ColumnMenuSortDescendingIcon: _icons.GridArrowDownwardIcon,
  ColumnMenuFilterIcon: _icons.GridFilterAltIcon,
  ColumnMenuManageColumnsIcon: _icons.GridViewColumnIcon,
  ColumnMenuClearIcon: _icons.GridClearIcon,
  LoadIcon: _icons.GridLoadIcon,
  FilterPanelAddIcon: _icons.GridAddIcon,
  FilterPanelRemoveAllIcon: _icons.GridDeleteForeverIcon,
  ColumnReorderIcon: _icons.GridDragIcon
};
const materialSlots = (0, _extends2.default)({}, iconSlots, {
  BaseCheckbox: _Checkbox.default,
  BaseTextField: _TextField.default,
  BaseFormControl: _FormControl.default,
  BaseSelect: _Select.default,
  BaseSwitch: _Switch.default,
  BaseButton: _Button.default,
  BaseIconButton: _IconButton.default,
  BaseTooltip: _Tooltip.default,
  BasePopper: _Popper.default,
  BaseInputLabel: _InputLabel.default,
  BaseSelectOption: _MUISelectOption.default
});
var _default = materialSlots;
exports.default = _default;