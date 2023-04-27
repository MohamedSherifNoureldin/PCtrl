import { roRO as roROCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var roROGrid = {
  // Root
  noRowsLabel: 'Lipsă date',
  noResultsOverlayLabel: 'Nu au fost găsite rezultate.',
  // Density selector toolbar button text
  toolbarDensity: 'Înălțime rând',
  toolbarDensityLabel: 'Înălțime rând',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Lat',
  // Columns selector toolbar button text
  toolbarColumns: 'Coloane',
  toolbarColumnsLabel: 'Afișează selecție coloane',
  // Filters toolbar button text
  toolbarFilters: 'Filtru',
  toolbarFiltersLabel: 'Afișează filtru',
  toolbarFiltersTooltipHide: 'Ascunde filtru',
  toolbarFiltersTooltipShow: 'Afișează filtru',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " filtru activ") : "".concat(count, " filtru activ");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Căutare…',
  toolbarQuickFilterLabel: 'Căutare',
  toolbarQuickFilterDeleteIconLabel: 'Ștergere',
  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Download în format CSV',
  toolbarExportPrint: 'Printare',
  toolbarExportExcel: 'Download în format Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Găsește coloana',
  columnsPanelTextFieldPlaceholder: 'Titlu coloană',
  columnsPanelDragIconLabel: 'Resortare coloană',
  columnsPanelShowAllButton: 'Afișează tot',
  columnsPanelHideAllButton: 'Ascunde tot',
  // Filter panel text
  filterPanelAddFilter: 'Adăugare filtru',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Ștergere',
  filterPanelLogicOperator: 'Operatori logici',
  filterPanelOperator: 'Operatori',
  filterPanelOperatorAnd: 'Și',
  filterPanelOperatorOr: 'Sau',
  filterPanelColumns: 'Coloane',
  filterPanelInputLabel: 'Valoare',
  filterPanelInputPlaceholder: 'Filtrare valoare',
  // Filter operators text
  filterOperatorContains: 'conține',
  filterOperatorEquals: 'este egal cu',
  filterOperatorStartsWith: 'începe cu',
  filterOperatorEndsWith: 'se termină cu',
  filterOperatorIs: 'este',
  filterOperatorNot: 'nu este',
  filterOperatorAfter: 'este după',
  filterOperatorOnOrAfter: 'este la sau după',
  filterOperatorBefore: 'este înainte de',
  filterOperatorOnOrBefore: 'este la sau înainte de',
  filterOperatorIsEmpty: 'este gol',
  filterOperatorIsNotEmpty: 'nu este gol',
  filterOperatorIsAnyOf: 'este una din valori',
  // Filter values text
  filterValueAny: 'Aleatoriu',
  filterValueTrue: 'Da',
  filterValueFalse: 'Nu',
  // Column menu text
  columnMenuLabel: 'Meniu',
  columnMenuShowColumns: 'Afișează toate coloanele',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Filtru',
  columnMenuHideColumn: 'Ascunde',
  columnMenuUnsort: 'Dezactivare sortare',
  columnMenuSortAsc: 'Sortează crescător',
  columnMenuSortDesc: 'Sortează descrescător',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " filtru activ") : "".concat(count, " filtru activ");
  },
  columnHeaderFiltersLabel: 'Afișează filtru',
  columnHeaderSortIconLabel: 'Sortare',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count !== 1 ? "".concat(count.toLocaleString(), " \xCEnregistr\u0103ri selectate") : "".concat(count.toLocaleString(), " \xCEnregistrare selectat\u0103");
  },
  // Total row amount footer text
  footerTotalRows: 'Total:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " din ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox Selecție',
  checkboxSelectionSelectAllRows: 'Selectare toate rândurile',
  checkboxSelectionUnselectAllRows: 'Deselectare toate rândurile',
  checkboxSelectionSelectRow: 'Selectare rând',
  checkboxSelectionUnselectRow: 'Deselectare rând',
  // Boolean cell text
  booleanCellTrueLabel: 'Da',
  booleanCellFalseLabel: 'Nu',
  // Actions cell more text
  actionsCellMore: 'Mai multe',
  // Column pinning text
  pinToLeft: 'Fixare în stânga',
  pinToRight: 'Fixare în dreapta',
  unpin: 'Anulare fixare',
  // Tree Data
  treeDataGroupingHeaderName: 'Grup',
  treeDataExpand: 'Afișare copii',
  treeDataCollapse: 'Ascundere copii',
  // Grouping columns
  groupingColumnHeaderName: 'Grupare',
  groupColumn: function groupColumn(name) {
    return "Grupare dup\u0103 ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "Anulare Grupare dup\u0103 ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'Comutare panou detalii',
  expandDetailPanel: 'Extindere',
  collapseDetailPanel: 'Restrângere',
  // Row reordering text
  rowReorderingHeaderName: 'Reordonare rânduri'

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export var roRO = getGridLocalization(roROGrid, roROCore);