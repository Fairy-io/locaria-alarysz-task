import { KyInstance } from 'ky';
import { CallFuction } from './types';
import { ConnectionAction } from './types';
import { Action } from '../actions';
import { Transaction } from '../transaction';

const makeGetCall =
    (ky: KyInstance): CallFuction =>
    (endpoint, searchParams) =>
        ky.get(endpoint, { searchParams }).json();

const makePostCall =
    (ky: KyInstance): CallFuction =>
    (endpoint, searchParams, data) =>
        ky
            .post(endpoint, {
                json: data,
                searchParams,
            })
            .json();

const makePutCall =
    (ky: KyInstance): CallFuction =>
    (endpoint, searchParams, data) =>
        ky
            .put(endpoint, {
                json: data,
                searchParams,
            })
            .json();

const makeDeleteCall =
    (ky: KyInstance): CallFuction =>
    async (endpoint, searchParams) => {
        const response = await ky.delete(endpoint, {
            searchParams,
        });

        const data =
            response.status === 204
                ? undefined
                : await response.json();

        return data;
    };

const makeActionCall =
    (
        ky: KyInstance,
        action: ConnectionAction<
            Partial<Record<string, any>>
        >,
        transaction?: Transaction,
    ): CallFuction =>
    (endpoint, searchParams, data) =>
        Action.execute(
            action,
            {
                ky,
                endpoint,
                searchParams,
                data,
            },
            transaction,
        );

export const makeCall = (
    ky: KyInstance,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    action?: ConnectionAction<Partial<Record<string, any>>>,
    transaction?: Transaction,
) => {
    if (action) {
        return makeActionCall(ky, action, transaction);
    }

    switch (method) {
        case 'GET':
            return makeGetCall(ky);
        case 'POST':
            return makePostCall(ky);
        case 'PUT':
            return makePutCall(ky);
        case 'DELETE':
            return makeDeleteCall(ky);
    }
};
