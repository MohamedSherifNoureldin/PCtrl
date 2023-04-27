import { fiFI as fiFICore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var fiFIGrid = {
  // Root
  noRowsLabel: 'Ei rivejä',
  noResultsOverlayLabel: 'Ei tuloksia.',
  // Density selector toolbar button text
  toolbarDensity: 'Tiiveys',
  toolbarDensityLabel: 'Tiiveys',
  toolbarDensityCompact: 'Kompakti',
  toolbarDensityStandard: 'Vakio',
  toolbarDensityComfortable: 'Mukava',
  // Columns selector toolbar button text
  toolbarColumns: 'Sarakkeet',
  toolbarColumnsLabel: 'Valitse sarakkeet',
  // Filters toolbar button text
  toolbarFilters: 'Suodattimet',
  toolbarFiltersLabel: 'Näytä suodattimet',
  toolbarFiltersTooltipHide: 'Piilota suodattimet',
  toolbarFiltersTooltipShow: 'Näytä suodattimet',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " aktiivista suodatinta") : "".concat(count, " aktiivinen suodatin");
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Hae…',
  toolbarQuickFilterLabel: 'Hae',
  toolbarQuickFilterDeleteIconLabel: 'Tyhjennä',
  // Export selector toolbar button text
  toolbarExport: 'Vie',
  toolbarExportLabel: 'Vie',
  toolbarExportCSV: 'Lataa CSV-muodossa',
  toolbarExportPrint: 'Tulosta',
  toolbarExportExcel: 'Lataa Excel-muodossa',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Etsi sarake',
  columnsPanelTextFieldPlaceholder: 'Sarakkeen otsikko',
  columnsPanelDragIconLabel: 'Järjestä sarake uudelleen',
  columnsPanelShowAllButton: 'Näytä kaikki',
  columnsPanelHideAllButton: 'Piilota kaikki',
  // Filter panel text
  filterPanelAddFilter: 'Lisää suodatin',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Poista',
  filterPanelLogicOperator: 'Logiikkaoperaattori',
  filterPanelOperator: 'Operaattorit',
  filterPanelOperatorAnd: 'Ja',
  filterPanelOperatorOr: 'Tai',
  filterPanelColumns: 'Sarakkeet',
  filterPanelInputLabel: 'Arvo',
  filterPanelInputPlaceholder: 'Suodattimen arvo',
  // Filter operators text
  filterOperatorContains: 'sisältää',
  filterOperatorEquals: 'on yhtä suuri',
  filterOperatorStartsWith: 'alkaa',
  filterOperatorEndsWith: 'päättyy',
  filterOperatorIs: 'on',
  filterOperatorNot: 'ei ole',
  filterOperatorAfter: 'on jälkeen',
  filterOperatorOnOrAfter: 'on sama tai jälkeen',
  filterOperatorBefore: 'on ennen',
  filterOperatorOnOrBefore: 'on sama tai ennen',
  filterOperatorIsEmpty: 'on tyhjä',
  filterOperatorIsNotEmpty: 'ei ole tyhjä',
  filterOperatorIsAnyOf: 'mikä tahansa seuraavista',
  // Filter values text
  filterValueAny: 'mikä tahansa',
  filterValueTrue: 'tosi',
  filterValueFalse: 'epätosi',
  // Column menu text
  columnMenuLabel: 'Valikko',
  columnMenuShowColumns: 'Näytä sarakkeet',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Suodata',
  columnMenuHideColumn: 'Piilota',
  columnMenuUnsort: 'Poista järjestys',
  columnMenuSortAsc: 'Järjestä nousevasti',
  columnMenuSortDesc: 'Järjestä laskevasti',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return count !== 1 ? "".concat(count, " aktiivista suodatinta") : "".concat(count, " aktiivinen suodatin");
  },
  columnHeaderFiltersLabel: 'Näytä suodattimet',
  columnHeaderSortIconLabel: 'Järjestä',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return count !== 1 ? "".concat(count.toLocaleString(), " rivi\xE4 valittu") : "".concat(count.toLocaleString(), " rivi valittu");
  },
  // Total row amount footer text
  footerTotalRows: 'Rivejä yhteensä:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " / ").concat(totalCount.toLocaleString());
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Valintaruutu',
  checkboxSelectionSelectAllRows: 'Valitse kaikki rivit',
  checkboxSelectionUnselectAllRows: 'Poista kaikkien rivien valinta',
  checkboxSelectionSelectRow: 'Valitse rivi',
  checkboxSelectionUnselectRow: 'Poista rivin valinta',
  // Boolean cell text
  booleanCellTrueLabel: 'tosi',
  booleanCellFalseLabel: 'epätosi',
  // Actions cell more text
  actionsCellMore: 'lisää',
  // Column pinning text
  pinToLeft: 'Kiinnitä vasemmalle',
  pinToRight: 'Kiinnitä oikealle',
  unpin: 'Irrota kiinnitys',
  // Tree Data
  treeDataGroupingHeaderName: 'Ryhmä',
  treeDataExpand: 'Laajenna',
  treeDataCollapse: 'Supista',
  // Grouping columns
  groupingColumnHeaderName: 'Ryhmä',
  groupColumn: function groupColumn(name) {
    return "Ryhmittelyperuste ".concat(name);
  },
  unGroupColumn: function unGroupColumn(name) {
    return "Poista ryhmittelyperuste ".concat(name);
  },
  // Master/detail
  detailPanelToggle: 'Yksityiskohtapaneelin vaihto',
  expandDetailPanel: 'Laajenna',
  collapseDetailPanel: 'Tiivistä',
  // Row reordering text
  rowReorderingHeaderName: 'Rivien uudelleenjärjestely',
  // Aggregation
  aggregationMenuItemHeader: 'Koostaminen',
  aggregationFunctionLabelSum: 'summa',
  aggregationFunctionLabelAvg: 'ka.',
  aggregationFunctionLabelMin: 'min.',
  aggregationFunctionLabelMax: 'maks.',
  aggregationFunctionLabelSize: 'koko'
};
export var fiFI = getGridLocalization(fiFIGrid, fiFICore);