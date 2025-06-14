import ky from 'ky';
import { Connection, ConnectionOptions } from './types';
import { makeProxy } from './makeProxy';
import { createConnectionFunction } from './createConnectionFunction';

export const createConnection = <
    T extends ConnectionOptions,
>(
    options: T,
): Connection<T> => {
    const { baseUrl, functions } = options;

    const client = ky.create({
        prefixUrl: baseUrl,
    });

    const connection = {} as Record<
        string,
        (data?: any) => Promise<any>
    >;

    const proxy = makeProxy(connection, functions);

    for (const [key, value] of Object.entries(functions)) {
        proxy[key] = createConnectionFunction(
            client,
            value.endpoint,
            value.method,
            value.action,
        );
    }

    return proxy as Connection<T>;
};
