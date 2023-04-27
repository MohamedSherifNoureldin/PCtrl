"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridRowSelectionPreProcessors = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _pipeProcessing = require("../../core/pipeProcessing");
var _constants = require("../../../constants");
var _colDef = require("../../../colDef");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  return React.useMemo(() => {
    const slots = {
      cellCheckbox: ['cellCheckbox'],
      columnHeaderCheckbox: ['columnHeaderCheckbox']
    };
    return (0, _utils.unstable_composeClasses)(slots, _constants.getDataGridUtilityClass, classes);
  }, [classes]);
};
const useGridRowSelectionPreProcessors = (apiRef, props) => {
  const ownerState = {
    classes: props.classes
  };
  const classes = useUtilityClasses(ownerState);
  const updateSelectionColumn = React.useCallback(columnsState => {
    const selectionColumn = (0, _extends2.default)({}, _colDef.GRID_CHECKBOX_SELECTION_COL_DEF, {
      cellClassName: classes.cellCheckbox,
      headerClassName: classes.columnHeaderCheckbox,
      headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName')
    });
    const shouldHaveSelectionColumn = props.checkboxSelection;
    const haveSelectionColumn = columnsState.lookup[_colDef.GRID_CHECKBOX_SELECTION_FIELD] != null;
    if (shouldHaveSelectionColumn && !haveSelectionColumn) {
      columnsState.lookup[_colDef.GRID_CHECKBOX_SELECTION_FIELD] = selectionColumn;
      columnsState.orderedFields = [_colDef.GRID_CHECKBOX_SELECTION_FIELD, ...columnsState.orderedFields];
    } else if (!shouldHaveSelectionColumn && haveSelectionColumn) {
      delete columnsState.lookup[_colDef.GRID_CHECKBOX_SELECTION_FIELD];
      columnsState.orderedFields = columnsState.orderedFields.filter(field => field !== _colDef.GRID_CHECKBOX_SELECTION_FIELD);
    } else if (shouldHaveSelectionColumn && haveSelectionColumn) {
      columnsState.lookup[_colDef.GRID_CHECKBOX_SELECTION_FIELD] = (0, _extends2.default)({}, selectionColumn, columnsState.lookup[_colDef.GRID_CHECKBOX_SELECTION_FIELD]);
    }
    return columnsState;
  }, [apiRef, classes, props.checkboxSelection]);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'hydrateColumns', updateSelectionColumn);
};
exports.useGridRowSelectionPreProcessors = useGridRowSelectionPreProcessors;