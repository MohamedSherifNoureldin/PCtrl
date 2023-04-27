import { GridRowId } from '../../../../models';
import { GridCellParams } from '../../../../models/params/gridCellParams';
import { GridStateColDef } from '../../../../models/colDef/gridColDef';
interface BuildCSVOptions {
    columns: GridStateColDef[];
    rowIds: GridRowId[];
    getCellParams: (id: GridRowId, field: string) => GridCellParams;
    delimiterCharacter: string;
    includeHeaders: boolean;
}
export declare function buildCSV(options: BuildCSVOptions): string;
export {};
