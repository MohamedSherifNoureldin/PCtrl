import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["item", "hasMultipleFilters", "deleteFilter", "applyFilterChanges", "multiFilterOperator", "showMultiFilterOperators", "disableMultiFilterOperator", "applyMultiFilterOperatorChanges", "focusElementRef", "logicOperators", "columnsSort", "filterColumns", "deleteIconProps", "logicOperatorInputProps", "operatorInputProps", "columnInputProps", "valueInputProps", "children"],
  _excluded2 = ["InputComponentProps"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useId as useId, unstable_capitalize as capitalize } from '@mui/utils';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { gridFilterableColumnDefinitionsSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridLogicOperator } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['filterForm'],
    deleteIcon: ['filterFormDeleteIcon'],
    logicOperatorInput: ['filterFormLogicOperatorInput'],
    columnInput: ['filterFormColumnInput'],
    operatorInput: ['filterFormOperatorInput'],
    valueInput: ['filterFormValueInput']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
var GridFilterFormRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterForm',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.filterForm;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return {
    display: 'flex',
    padding: theme.spacing(1)
  };
});
var FilterFormDeleteIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormDeleteIcon',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.filterFormDeleteIcon;
  }
})(function (_ref2) {
  var theme = _ref2.theme;
  return {
    flexShrink: 0,
    justifyContent: 'flex-end',
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.2)
  };
});
var FilterFormLogicOperatorInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormLogicOperatorInput',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.filterFormLogicOperatorInput;
  }
})({
  minWidth: 55,
  marginRight: 5,
  justifyContent: 'end'
});
var FilterFormColumnInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormColumnInput',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.filterFormColumnInput;
  }
})({
  width: 150
});
var FilterFormOperatorInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormOperatorInput',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.filterFormOperatorInput;
  }
})({
  width: 120
});
var FilterFormValueInput = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: function overridesResolver(_, styles) {
    return styles.filterFormValueInput;
  }
})({
  width: 190
});
var getLogicOperatorLocaleKey = function getLogicOperatorLocaleKey(logicOperator) {
  switch (logicOperator) {
    case GridLogicOperator.And:
      return 'filterPanelOperatorAnd';
    case GridLogicOperator.Or:
      return 'filterPanelOperatorOr';
    default:
      throw new Error('MUI: Invalid `logicOperator` property in the `GridFilterPanel`.');
  }
};
var getColumnLabel = function getColumnLabel(col) {
  return col.headerName || col.field;
};
var collator = new Intl.Collator();
var GridFilterForm = /*#__PURE__*/React.forwardRef(function GridFilterForm(props, ref) {
  var _rootProps$slotProps, _rootProps$slotProps2, _baseSelectProps$nati, _rootProps$slotProps3, _rootProps$slotProps4, _rootProps$slotProps5, _rootProps$slotProps6, _rootProps$slotProps7, _rootProps$slotProps8, _currentColumn$filter2;
  var item = props.item,
    hasMultipleFilters = props.hasMultipleFilters,
    deleteFilter = props.deleteFilter,
    applyFilterChanges = props.applyFilterChanges,
    multiFilterOperator = props.multiFilterOperator,
    showMultiFilterOperators = props.showMultiFilterOperators,
    disableMultiFilterOperator = props.disableMultiFilterOperator,
    applyMultiFilterOperatorChanges = props.applyMultiFilterOperatorChanges,
    focusElementRef = props.focusElementRef,
    _props$logicOperators = props.logicOperators,
    logicOperators = _props$logicOperators === void 0 ? [GridLogicOperator.And, GridLogicOperator.Or] : _props$logicOperators,
    columnsSort = props.columnsSort,
    filterColumns = props.filterColumns,
    _props$deleteIconProp = props.deleteIconProps,
    deleteIconProps = _props$deleteIconProp === void 0 ? {} : _props$deleteIconProp,
    _props$logicOperatorI = props.logicOperatorInputProps,
    logicOperatorInputProps = _props$logicOperatorI === void 0 ? {} : _props$logicOperatorI,
    _props$operatorInputP = props.operatorInputProps,
    operatorInputProps = _props$operatorInputP === void 0 ? {} : _props$operatorInputP,
    _props$columnInputPro = props.columnInputProps,
    columnInputProps = _props$columnInputPro === void 0 ? {} : _props$columnInputPro,
    _props$valueInputProp = props.valueInputProps,
    valueInputProps = _props$valueInputProp === void 0 ? {} : _props$valueInputProp,
    children = props.children,
    other = _objectWithoutProperties(props, _excluded);
  var apiRef = useGridApiContext();
  var filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
  var filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  var columnSelectId = useId();
  var columnSelectLabelId = useId();
  var operatorSelectId = useId();
  var operatorSelectLabelId = useId();
  var rootProps = useGridRootProps();
  var classes = useUtilityClasses(rootProps);
  var valueRef = React.useRef(null);
  var filterSelectorRef = React.useRef(null);
  var hasLogicOperatorColumn = hasMultipleFilters && logicOperators.length > 0;
  var baseFormControlProps = ((_rootProps$slotProps = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps.baseFormControl) || {};
  var baseSelectProps = ((_rootProps$slotProps2 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps2.baseSelect) || {};
  var isBaseSelectNative = (_baseSelectProps$nati = baseSelectProps.native) != null ? _baseSelectProps$nati : true;
  var baseInputLabelProps = ((_rootProps$slotProps3 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps3.baseInputLabel) || {};
  var baseSelectOptionProps = ((_rootProps$slotProps4 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps4.baseSelectOption) || {};
  var InputComponentProps = valueInputProps.InputComponentProps,
    valueInputPropsOther = _objectWithoutProperties(valueInputProps, _excluded2);
  var filteredColumns = React.useMemo(function () {
    if (filterColumns === undefined || typeof filterColumns !== 'function') {
      return filterableColumns;
    }
    var filteredFields = filterColumns({
      field: item.field,
      columns: filterableColumns,
      currentFilters: (filterModel == null ? void 0 : filterModel.items) || []
    });
    return filterableColumns.filter(function (column) {
      return filteredFields.includes(column.field);
    });
  }, [filterColumns, filterModel == null ? void 0 : filterModel.items, filterableColumns, item.field]);
  var sortedFilteredColumns = React.useMemo(function () {
    switch (columnsSort) {
      case 'asc':
        return filteredColumns.sort(function (a, b) {
          return collator.compare(getColumnLabel(a), getColumnLabel(b));
        });
      case 'desc':
        return filteredColumns.sort(function (a, b) {
          return -collator.compare(getColumnLabel(a), getColumnLabel(b));
        });
      default:
        return filteredColumns;
    }
  }, [filteredColumns, columnsSort]);
  var currentColumn = item.field ? apiRef.current.getColumn(item.field) : null;
  var currentOperator = React.useMemo(function () {
    var _currentColumn$filter;
    if (!item.operator || !currentColumn) {
      return null;
    }
    return (_currentColumn$filter = currentColumn.filterOperators) == null ? void 0 : _currentColumn$filter.find(function (operator) {
      return operator.value === item.operator;
    });
  }, [item, currentColumn]);
  var changeColumn = React.useCallback(function (event) {
    var field = event.target.value;
    var column = apiRef.current.getColumn(field);
    if (column.field === currentColumn.field) {
      // column did not change
      return;
    }

    // try to keep the same operator when column change
    var newOperator = column.filterOperators.find(function (operator) {
      return operator.value === item.operator;
    }) || column.filterOperators[0];

    // Erase filter value if the input component is modified
    var eraseItemValue = !newOperator.InputComponent || newOperator.InputComponent !== (currentOperator == null ? void 0 : currentOperator.InputComponent);
    applyFilterChanges(_extends({}, item, {
      field: field,
      operator: newOperator.value,
      value: eraseItemValue ? undefined : item.value
    }));
  }, [apiRef, applyFilterChanges, item, currentColumn, currentOperator]);
  var changeOperator = React.useCallback(function (event) {
    var operator = event.target.value;
    var newOperator = currentColumn == null ? void 0 : currentColumn.filterOperators.find(function (op) {
      return op.value === operator;
    });
    var eraseItemValue = !(newOperator != null && newOperator.InputComponent) || (newOperator == null ? void 0 : newOperator.InputComponent) !== (currentOperator == null ? void 0 : currentOperator.InputComponent);
    applyFilterChanges(_extends({}, item, {
      operator: operator,
      value: eraseItemValue ? undefined : item.value
    }));
  }, [applyFilterChanges, item, currentColumn, currentOperator]);
  var changeLogicOperator = React.useCallback(function (event) {
    var logicOperator = event.target.value === GridLogicOperator.And.toString() ? GridLogicOperator.And : GridLogicOperator.Or;
    applyMultiFilterOperatorChanges(logicOperator);
  }, [applyMultiFilterOperatorChanges]);
  var handleDeleteFilter = function handleDeleteFilter() {
    if (rootProps.disableMultipleColumnsFiltering) {
      if (item.value === undefined) {
        deleteFilter(item);
      } else {
        // TODO v6: simplify the behavior by always remove the filter form
        applyFilterChanges(_extends({}, item, {
          value: undefined
        }));
      }
    } else {
      deleteFilter(item);
    }
  };
  React.useImperativeHandle(focusElementRef, function () {
    return {
      focus: function focus() {
        if (currentOperator != null && currentOperator.InputComponent) {
          var _valueRef$current;
          valueRef == null ? void 0 : (_valueRef$current = valueRef.current) == null ? void 0 : _valueRef$current.focus();
        } else {
          filterSelectorRef.current.focus();
        }
      }
    };
  }, [currentOperator]);
  return /*#__PURE__*/_jsxs(GridFilterFormRoot, _extends({
    ref: ref,
    className: classes.root,
    "data-id": item.id,
    ownerState: rootProps
  }, other, {
    children: [/*#__PURE__*/_jsx(FilterFormDeleteIcon, _extends({
      variant: "standard",
      as: rootProps.slots.baseFormControl
    }, baseFormControlProps, deleteIconProps, {
      className: clsx(classes.deleteIcon, baseFormControlProps.className, deleteIconProps.className),
      ownerState: rootProps,
      children: /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
        "aria-label": apiRef.current.getLocaleText('filterPanelDeleteIconLabel'),
        title: apiRef.current.getLocaleText('filterPanelDeleteIconLabel'),
        onClick: handleDeleteFilter,
        size: "small"
      }, (_rootProps$slotProps5 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps5.baseIconButton, {
        children: /*#__PURE__*/_jsx(rootProps.slots.filterPanelDeleteIcon, {
          fontSize: "small"
        })
      }))
    })), /*#__PURE__*/_jsx(FilterFormLogicOperatorInput, _extends({
      variant: "standard",
      as: rootProps.slots.baseFormControl
    }, baseFormControlProps, logicOperatorInputProps, {
      sx: _extends({
        display: hasLogicOperatorColumn ? 'flex' : 'none',
        visibility: showMultiFilterOperators ? 'visible' : 'hidden'
      }, baseFormControlProps.sx || {}, logicOperatorInputProps.sx || {}),
      className: clsx(classes.logicOperatorInput, baseFormControlProps.className, logicOperatorInputProps.className),
      ownerState: rootProps,
      children: /*#__PURE__*/_jsx(rootProps.slots.baseSelect, _extends({
        inputProps: {
          'aria-label': apiRef.current.getLocaleText('filterPanelLogicOperator')
        },
        value: multiFilterOperator,
        onChange: changeLogicOperator,
        disabled: !!disableMultiFilterOperator || logicOperators.length === 1,
        native: isBaseSelectNative
      }, (_rootProps$slotProps6 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps6.baseSelect, {
        children: logicOperators.map(function (logicOperator) {
          return /*#__PURE__*/_createElement(rootProps.slots.baseSelectOption, _extends({}, baseSelectOptionProps, {
            native: isBaseSelectNative,
            key: logicOperator.toString(),
            value: logicOperator.toString()
          }), apiRef.current.getLocaleText(getLogicOperatorLocaleKey(logicOperator)));
        })
      }))
    })), /*#__PURE__*/_jsxs(FilterFormColumnInput, _extends({
      variant: "standard",
      as: rootProps.slots.baseFormControl
    }, baseFormControlProps, columnInputProps, {
      className: clsx(classes.columnInput, baseFormControlProps.className, columnInputProps.className),
      ownerState: rootProps,
      children: [/*#__PURE__*/_jsx(rootProps.slots.baseInputLabel, _extends({}, baseInputLabelProps, {
        htmlFor: columnSelectId,
        id: columnSelectLabelId,
        children: apiRef.current.getLocaleText('filterPanelColumns')
      })), /*#__PURE__*/_jsx(rootProps.slots.baseSelect, _extends({
        labelId: columnSelectLabelId,
        id: columnSelectId,
        label: apiRef.current.getLocaleText('filterPanelColumns'),
        value: item.field || '',
        onChange: changeColumn,
        native: isBaseSelectNative
      }, (_rootProps$slotProps7 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps7.baseSelect, {
        children: sortedFilteredColumns.map(function (col) {
          return /*#__PURE__*/_createElement(rootProps.slots.baseSelectOption, _extends({}, baseSelectOptionProps, {
            native: isBaseSelectNative,
            key: col.field,
            value: col.field
          }), getColumnLabel(col));
        })
      }))]
    })), /*#__PURE__*/_jsxs(FilterFormOperatorInput, _extends({
      variant: "standard",
      as: rootProps.slots.baseFormControl
    }, baseFormControlProps, operatorInputProps, {
      className: clsx(classes.operatorInput, baseFormControlProps.className, operatorInputProps.className),
      ownerState: rootProps,
      children: [/*#__PURE__*/_jsx(rootProps.slots.baseInputLabel, _extends({}, baseInputLabelProps, {
        htmlFor: operatorSelectId,
        id: operatorSelectLabelId,
        children: apiRef.current.getLocaleText('filterPanelOperator')
      })), /*#__PURE__*/_jsx(rootProps.slots.baseSelect, _extends({
        labelId: operatorSelectLabelId,
        label: apiRef.current.getLocaleText('filterPanelOperator'),
        id: operatorSelectId,
        value: item.operator,
        onChange: changeOperator,
        native: isBaseSelectNative,
        inputRef: filterSelectorRef
      }, (_rootProps$slotProps8 = rootProps.slotProps) == null ? void 0 : _rootProps$slotProps8.baseSelect, {
        children: currentColumn == null ? void 0 : (_currentColumn$filter2 = currentColumn.filterOperators) == null ? void 0 : _currentColumn$filter2.map(function (operator) {
          return /*#__PURE__*/_createElement(rootProps.slots.baseSelectOption, _extends({}, baseSelectOptionProps, {
            native: isBaseSelectNative,
            key: operator.value,
            value: operator.value
          }), operator.label || apiRef.current.getLocaleText("filterOperator".concat(capitalize(operator.value))));
        })
      }))]
    })), /*#__PURE__*/_jsx(FilterFormValueInput, _extends({
      variant: "standard",
      as: rootProps.slots.baseFormControl
    }, baseFormControlProps, valueInputPropsOther, {
      className: clsx(classes.valueInput, baseFormControlProps.className, valueInputPropsOther.className),
      ownerState: rootProps,
      children: currentOperator != null && currentOperator.InputComponent ? /*#__PURE__*/_jsx(currentOperator.InputComponent, _extends({
        apiRef: apiRef,
        item: item,
        applyValue: applyFilterChanges,
        focusElementRef: valueRef
      }, currentOperator.InputComponentProps, InputComponentProps)) : null
    }))]
  }));
});
process.env.NODE_ENV !== "production" ? GridFilterForm.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: PropTypes.func.isRequired,
  /**
   * Callback called when the logic operator is changed.
   * @param {GridLogicOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: PropTypes.func.isRequired,
  /**
   * @ignore - do not document.
   */
  children: PropTypes.node,
  /**
   * Props passed to the column input component.
   * @default {}
   */
  columnInputProps: PropTypes.any,
  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Callback called when the delete button is clicked.
   * @param {GridFilterItem} item The deleted [[GridFilterItem]].
   */
  deleteFilter: PropTypes.func.isRequired,
  /**
   * Props passed to the delete icon.
   * @default {}
   */
  deleteIconProps: PropTypes.any,
  /**
   * If `true`, disables the logic operator field but still renders it.
   */
  disableMultiFilterOperator: PropTypes.bool,
  /**
   * Allows to filter the columns displayed in the filter form.
   * @param {FilterColumnsArgs} args The columns of the grid and name of field.
   * @returns {GridColDef['field'][]} The filtered fields array.
   */
  filterColumns: PropTypes.func,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the el
   */
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * If `true`, the logic operator field is rendered.
   * The field will be invisible if `showMultiFilterOperators` is also `true`.
   */
  hasMultipleFilters: PropTypes.bool.isRequired,
  /**
   * The [[GridFilterItem]] representing this form.
   */
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired,
  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  logicOperatorInputProps: PropTypes.any,
  /**
   * Sets the available logic operators.
   * @default [GridLogicOperator.And, GridLogicOperator.Or]
   */
  logicOperators: PropTypes.arrayOf(PropTypes.oneOf(['and', 'or']).isRequired),
  /**
   * The current logic operator applied.
   */
  multiFilterOperator: PropTypes.oneOf(['and', 'or']),
  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps: PropTypes.any,
  /**
   * If `true`, the logic operator field is visible.
   */
  showMultiFilterOperators: PropTypes.bool,
  /**
   * Props passed to the value input component.
   * @default {}
   */
  valueInputProps: PropTypes.any
} : void 0;
export { GridFilterForm };