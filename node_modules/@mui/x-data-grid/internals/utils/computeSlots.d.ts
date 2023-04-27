import { UncapitalizeObjectKeys } from './slotsMigration';
export declare function computeSlots<SlotComponents extends object>({ defaultSlots, slots, components, }: {
    defaultSlots: UncapitalizeObjectKeys<SlotComponents>;
    slots?: UncapitalizeObjectKeys<Partial<SlotComponents>>;
    components?: Partial<SlotComponents>;
}): UncapitalizeObjectKeys<SlotComponents>;
