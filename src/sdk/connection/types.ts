import { z } from 'zod';
import { KyInstance } from 'ky';
import { ExecuteArgs } from '../types/ExecuteArgs';
import { Action } from '../actions';
import { Transaction } from '../transaction';

type Data<T extends z.ZodObject<any> | undefined> =
    T extends z.ZodObject<any> ? z.infer<T> : void;

export type ConnectionAction<T> = new () => Action<
    {
        ky: KyInstance;
        endpoint: string;
        searchParams: URLSearchParams;
        data: Partial<T>;
    },
    any
>;

export type ConnectionFunction = {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    expectedResponse: z.ZodObject<any> | z.ZodVoid;
    expectedData?: z.ZodObject<any>;
    action?: ConnectionAction<
        Data<ConnectionFunction['expectedData']>
    >;
};

export type ConnectionOptions = {
    baseUrl: string;
    functions: {
        [key: string]: ConnectionFunction;
    };
};

type ExpectedData<
    T extends ConnectionOptions,
    K extends keyof T['functions'],
> = Data<T['functions'][K]['expectedData']>;

type ExpectedResponse<
    T extends ConnectionOptions,
    K extends keyof T['functions'],
> = z.infer<T['functions'][K]['expectedResponse']>;

export type Connection<T extends ConnectionOptions> = {
    [key in keyof T['functions']]: (
        ...args: ExecuteArgs<
            ExpectedData<T, key>,
            [Transaction?],
            [ExpectedData<T, key>, Transaction?]
        >
    ) => Promise<ExpectedResponse<T, key>>;
};

export type CallFuction = (
    endpoint: string,
    searchParams: URLSearchParams,
    data?: any,
) => Promise<any>;
