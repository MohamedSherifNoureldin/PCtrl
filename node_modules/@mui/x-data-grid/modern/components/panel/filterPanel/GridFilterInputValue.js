import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["item", "applyValue", "type", "apiRef", "focusElementRef"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
export const SUBMIT_FILTER_STROKE_TIME = 500;
function GridFilterInputValue(props) {
  const {
      item,
      applyValue,
      type,
      apiRef,
      focusElementRef
    } = props,
    others = _objectWithoutPropertiesLoose(props, _excluded);
  const filterTimeout = React.useRef();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();
  const onFilterChange = React.useCallback(event => {
    const {
      value
    } = event.target;
    clearTimeout(filterTimeout.current);
    setFilterValueState(String(value));
    setIsApplying(true);
    filterTimeout.current = setTimeout(() => {
      applyValue(_extends({}, item, {
        value
      }));
      setIsApplying(false);
    }, SUBMIT_FILTER_STROKE_TIME);
  }, [applyValue, item]);
  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);
  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);
  const InputProps = applying ? {
    endAdornment: /*#__PURE__*/_jsx(rootProps.slots.loadIcon, {})
  } : others.InputProps;
  return /*#__PURE__*/_jsx(rootProps.slots.baseTextField, _extends({
    id: id,
    label: apiRef.current.getLocaleText('filterPanelInputLabel'),
    placeholder: apiRef.current.getLocaleText('filterPanelInputPlaceholder'),
    value: filterValueState,
    onChange: onFilterChange,
    variant: "standard",
    type: type || 'text',
    InputProps: InputProps,
    InputLabelProps: {
      shrink: true
    },
    inputRef: focusElementRef
  }, others, rootProps.slotProps?.baseTextField));
}
process.env.NODE_ENV !== "production" ? GridFilterInputValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.func, PropTypes.object]),
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired
} : void 0;
export { GridFilterInputValue };