import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { getDataGridUtilityClass } from '../../../constants';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_CHECKBOX_SELECTION_FIELD } from '../../../colDef';
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  return React.useMemo(function () {
    var slots = {
      cellCheckbox: ['cellCheckbox'],
      columnHeaderCheckbox: ['columnHeaderCheckbox']
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};
export var useGridRowSelectionPreProcessors = function useGridRowSelectionPreProcessors(apiRef, props) {
  var ownerState = {
    classes: props.classes
  };
  var classes = useUtilityClasses(ownerState);
  var updateSelectionColumn = React.useCallback(function (columnsState) {
    var selectionColumn = _extends({}, GRID_CHECKBOX_SELECTION_COL_DEF, {
      cellClassName: classes.cellCheckbox,
      headerClassName: classes.columnHeaderCheckbox,
      headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName')
    });
    var shouldHaveSelectionColumn = props.checkboxSelection;
    var haveSelectionColumn = columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] != null;
    if (shouldHaveSelectionColumn && !haveSelectionColumn) {
      columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = selectionColumn;
      columnsState.orderedFields = [GRID_CHECKBOX_SELECTION_FIELD].concat(_toConsumableArray(columnsState.orderedFields));
    } else if (!shouldHaveSelectionColumn && haveSelectionColumn) {
      delete columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD];
      columnsState.orderedFields = columnsState.orderedFields.filter(function (field) {
        return field !== GRID_CHECKBOX_SELECTION_FIELD;
      });
    } else if (shouldHaveSelectionColumn && haveSelectionColumn) {
      columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = _extends({}, selectionColumn, columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD]);
    }
    return columnsState;
  }, [apiRef, classes, props.checkboxSelection]);
  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
};