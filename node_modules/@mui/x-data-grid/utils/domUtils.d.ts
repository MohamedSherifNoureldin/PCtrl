import { GridRowId } from '../models/gridRows';
export declare function isOverflown(element: Element): boolean;
export declare function findParentElementFromClassName(elem: Element, className: string): Element | null;
export declare function getRowEl(cell?: Element | null): HTMLElement | null;
export declare function isGridCellRoot(elem: Element | null): boolean;
export declare function isGridHeaderCellRoot(elem: Element | null): boolean;
export declare function getGridColumnHeaderElement(root: Element, field: string): HTMLDivElement | null;
export declare function getGridRowElement(root: Element, id: GridRowId): HTMLDivElement | null;
export declare function getGridCellElement(root: Element, { id, field }: {
    id: GridRowId;
    field: string;
}): HTMLDivElement | null;
