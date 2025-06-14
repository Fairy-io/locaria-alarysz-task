import { Transaction } from '../transaction';
import { KyInstance } from 'ky';
import { makeCall } from './makeCall';
import { getEndpoint } from './getEndpoint';
import { createSearchParams } from './createSearchParams';
import { ConnectionAction } from './types';

export const createConnectionFunction = (
    ky: KyInstance,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    action?: ConnectionAction<Partial<Record<string, any>>>,
) => {
    return (data?: any, transaction?: Transaction) => {
        const actualEndpoint = getEndpoint(endpoint, data);

        const urlSearchParams = createSearchParams(
            method,
            data,
        );

        const call = makeCall(
            ky,
            method,
            action,
            transaction,
        );

        return call(actualEndpoint, urlSearchParams, data);
    };
};
