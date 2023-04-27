import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["colDef", "id", "hasFocus", "isEditable", "field", "value", "formattedValue", "row", "rowNode", "cellMode", "tabIndex", "position", "focusElementRef"];
import * as React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import { useTheme } from '@mui/material/styles';
import { unstable_useId as useId } from '@mui/utils';
import { gridClasses } from '../../constants/gridClasses';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const hasActions = colDef => typeof colDef.getActions === 'function';
function GridActionsCell(props) {
  const {
      colDef,
      id,
      hasFocus,
      tabIndex,
      position = 'bottom-end',
      focusElementRef
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const [focusedButtonIndex, setFocusedButtonIndex] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const rootRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const ignoreCallToFocus = React.useRef(false);
  const touchRippleRefs = React.useRef({});
  const theme = useTheme();
  const menuId = useId();
  const buttonId = useId();
  const rootProps = useGridRootProps();
  if (!hasActions(colDef)) {
    throw new Error('MUI: Missing the `getActions` property in the `GridColDef`.');
  }
  const options = colDef.getActions(apiRef.current.getRowParams(id));
  const iconButtons = options.filter(option => !option.props.showInMenu);
  const menuButtons = options.filter(option => option.props.showInMenu);
  const numberOfButtons = iconButtons.length + (menuButtons.length ? 1 : 0);
  React.useLayoutEffect(() => {
    if (!hasFocus) {
      Object.entries(touchRippleRefs.current).forEach(([index, ref]) => {
        ref?.stop({}, () => {
          delete touchRippleRefs.current[index];
        });
      });
    }
  }, [hasFocus]);
  React.useEffect(() => {
    if (focusedButtonIndex < 0 || !rootRef.current) {
      return;
    }
    if (focusedButtonIndex >= rootRef.current.children.length) {
      return;
    }
    const child = rootRef.current.children[focusedButtonIndex];
    child.focus({
      preventScroll: true
    });
  }, [focusedButtonIndex]);
  React.useEffect(() => {
    if (!hasFocus) {
      setFocusedButtonIndex(-1);
      ignoreCallToFocus.current = false;
    }
  }, [hasFocus]);
  React.useImperativeHandle(focusElementRef, () => ({
    focus() {
      // If ignoreCallToFocus is true, then one of the buttons was clicked and the focus is already set
      if (!ignoreCallToFocus.current) {
        setFocusedButtonIndex(0);
      }
    }
  }), []);
  React.useEffect(() => {
    if (focusedButtonIndex >= numberOfButtons) {
      setFocusedButtonIndex(numberOfButtons - 1);
    }
  }, [focusedButtonIndex, numberOfButtons]);
  const showMenu = () => {
    setOpen(true);
    setFocusedButtonIndex(numberOfButtons - 1);
    ignoreCallToFocus.current = true;
  };
  const hideMenu = () => {
    setOpen(false);
  };
  const handleTouchRippleRef = index => instance => {
    touchRippleRefs.current[index] = instance;
  };
  const handleButtonClick = (index, onClick) => event => {
    setFocusedButtonIndex(index);
    ignoreCallToFocus.current = true;
    if (onClick) {
      onClick(event);
    }
  };
  const handleRootKeyDown = event => {
    if (numberOfButtons <= 1) {
      return;
    }
    let newIndex = focusedButtonIndex;
    if (event.key === 'ArrowRight') {
      if (theme.direction === 'rtl') {
        newIndex -= 1;
      } else {
        newIndex += 1;
      }
    } else if (event.key === 'ArrowLeft') {
      if (theme.direction === 'rtl') {
        newIndex += 1;
      } else {
        newIndex -= 1;
      }
    }
    if (newIndex < 0 || newIndex >= numberOfButtons) {
      return; // We're already in the first or last item = do nothing and let the grid listen the event
    }

    if (newIndex !== focusedButtonIndex) {
      event.preventDefault(); // Prevent scrolling
      event.stopPropagation(); // Don't stop propagation for other keys, e.g. ArrowUp
      setFocusedButtonIndex(newIndex);
    }
  };
  const handleListKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (['Tab', 'Enter', 'Escape'].includes(event.key)) {
      hideMenu();
    }
  };
  return /*#__PURE__*/_jsxs("div", _extends({
    role: "menu",
    ref: rootRef,
    tabIndex: -1,
    className: gridClasses.actionsCell,
    onKeyDown: handleRootKeyDown
  }, other, {
    children: [iconButtons.map((button, index) => /*#__PURE__*/React.cloneElement(button, {
      key: index,
      touchRippleRef: handleTouchRippleRef(index),
      onClick: handleButtonClick(index, button.props.onClick),
      tabIndex: focusedButtonIndex === index ? tabIndex : -1
    })), menuButtons.length > 0 && buttonId && /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
      ref: buttonRef,
      id: buttonId,
      "aria-label": apiRef.current.getLocaleText('actionsCellMore'),
      "aria-controls": menuId,
      "aria-expanded": open ? 'true' : undefined,
      "aria-haspopup": "true",
      role: "menuitem",
      size: "small",
      onClick: showMenu,
      touchRippleRef: handleTouchRippleRef(buttonId),
      tabIndex: focusedButtonIndex === iconButtons.length ? tabIndex : -1
    }, rootProps.slotProps?.baseIconButton, {
      children: /*#__PURE__*/_jsx(rootProps.slots.moreActionsIcon, {
        fontSize: "small"
      })
    })), menuButtons.length > 0 && /*#__PURE__*/_jsx(GridMenu, {
      onClickAway: hideMenu,
      onClick: hideMenu,
      open: open,
      target: buttonRef.current,
      position: position,
      children: /*#__PURE__*/_jsx(MenuList, {
        id: menuId,
        className: gridClasses.menuList,
        onKeyDown: handleListKeyDown,
        "aria-labelledby": buttonId,
        variant: "menu",
        autoFocusItem: true,
        children: menuButtons.map((button, index) => /*#__PURE__*/React.cloneElement(button, {
          key: index
        }))
      })
    })]
  }));
}
process.env.NODE_ENV !== "production" ? GridActionsCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.shape({
      focus: PropTypes.func.isRequired
    })
  })]),
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  position: PropTypes.oneOf(['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  value: PropTypes.any
} : void 0;
export { GridActionsCell };
export const renderActionsCell = params => /*#__PURE__*/_jsx(GridActionsCell, _extends({}, params));