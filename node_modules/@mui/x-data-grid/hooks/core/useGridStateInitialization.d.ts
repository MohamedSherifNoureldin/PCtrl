import * as React from 'react';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
export declare const useGridStateInitialization: <PrivateApi extends GridPrivateApiCommon>(apiRef: React.MutableRefObject<PrivateApi>, props: Pick<DataGridProcessedProps, 'signature'>) => void;
