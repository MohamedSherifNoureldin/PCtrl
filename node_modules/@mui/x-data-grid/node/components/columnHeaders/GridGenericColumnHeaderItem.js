"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridGenericColumnHeaderItem = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _utils = require("@mui/utils");
var _useGridPrivateApiContext = require("../../hooks/utils/useGridPrivateApiContext");
var _GridColumnHeaderTitle = require("./GridColumnHeaderTitle");
var _GridColumnHeaderSeparator = require("./GridColumnHeaderSeparator");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["classes", "columnMenuOpen", "colIndex", "height", "isResizing", "sortDirection", "hasFocus", "tabIndex", "separatorSide", "isDraggable", "headerComponent", "description", "elementId", "width", "columnMenuIconButton", "columnMenu", "columnTitleIconButtons", "headerClassName", "label", "resizable", "draggableContainerProps", "columnHeaderSeparatorProps"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const GridGenericColumnHeaderItem = /*#__PURE__*/React.forwardRef(function GridGenericColumnHeaderItem(props, ref) {
  const {
      classes,
      columnMenuOpen,
      colIndex,
      height,
      isResizing,
      sortDirection,
      hasFocus,
      tabIndex,
      separatorSide,
      isDraggable,
      headerComponent,
      description,
      width,
      columnMenuIconButton = null,
      columnMenu = null,
      columnTitleIconButtons = null,
      headerClassName,
      label,
      resizable,
      draggableContainerProps,
      columnHeaderSeparatorProps
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const headerCellRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const handleRef = (0, _utils.unstable_useForkRef)(headerCellRef, ref);
  let ariaSort = 'none';
  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }
  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;
    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
    ref: handleRef,
    className: (0, _clsx.default)(classes.root, headerClassName),
    style: {
      height,
      width,
      minWidth: width,
      maxWidth: width
    },
    role: "columnheader",
    tabIndex: tabIndex,
    "aria-colindex": colIndex + 1,
    "aria-sort": ariaSort,
    "aria-label": headerComponent == null ? label : undefined
  }, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
      className: classes.draggableContainer,
      draggable: isDraggable
    }, draggableContainerProps, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.titleContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.titleContainerContent,
          children: headerComponent !== undefined ? headerComponent : /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderTitle.GridColumnHeaderTitle, {
            label: label,
            description: description,
            columnWidth: width
          })
        }), columnTitleIconButtons]
      }), columnMenuIconButton]
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderSeparator.GridColumnHeaderSeparator, (0, _extends2.default)({
      resizable: !rootProps.disableColumnResize && !!resizable,
      resizing: isResizing,
      height: height,
      side: separatorSide
    }, columnHeaderSeparatorProps)), columnMenu]
  }));
});
exports.GridGenericColumnHeaderItem = GridGenericColumnHeaderItem;