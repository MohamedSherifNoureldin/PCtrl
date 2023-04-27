export type UncapitalizeObjectKeys<T extends object> = {
    [K in keyof T as K extends string ? Uncapitalize<K> : K]: T[K];
};
export declare const uncapitalizeObjectKeys: <TInputType extends object>(capitalizedObject: TInputType) => UncapitalizeObjectKeys<TInputType> | undefined;
