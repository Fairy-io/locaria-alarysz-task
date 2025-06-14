import { Transaction } from '../transaction';
import { isTransaction } from '../types/isTransaction';
import { ConnectionOptions } from './types';

type Connection = Record<
    string,
    (data?: any) => Promise<any>
>;

const handler = (
    functions: ConnectionOptions['functions'],
): ProxyHandler<Connection> => {
    const values: Record<string, any> = {};

    const setCounts: Record<string, number> = {};

    return {
        set(target, prop, value) {
            const key = prop.toString();
            values[key] = value;

            if (!setCounts[key]) {
                setCounts[key] = 0;
            }

            const internalSetCount = ++setCounts[key];

            const fn = async (
                data?: any,
                transaction?: Transaction,
            ) => {
                const { expectedResponse, expectedData } =
                    functions[key];

                const parsedData =
                    data && expectedData
                        ? expectedData.parse(data)
                        : undefined;

                const { requestData, requestTransaction } =
                    isTransaction(data)
                        ? {
                              requestData: undefined,
                              requestTransaction: data,
                          }
                        : {
                              requestData: parsedData,
                              requestTransaction:
                                  transaction,
                          };

                // in production environment we expect the function to be set only once
                // we are tracking setCount to detect if the function is being set more than once
                // if it is, then we are assuming tht function is mocked, so we are adding dummy transaction rollback
                if (
                    requestTransaction &&
                    internalSetCount > 1
                ) {
                    requestTransaction.register(
                        async () => {},
                    );
                }

                const response = await value(
                    requestData,
                    requestTransaction,
                );

                return expectedResponse.parse(response);
            };

            target[key] = new Proxy(fn, {
                get(_, functionProp) {
                    const value = values[key];

                    return value[functionProp.toString()];
                },
            });

            return true;
        },
    };
};

export const makeProxy = (
    connection: Connection,
    functions: ConnectionOptions['functions'],
) => {
    return new Proxy(connection, handler(functions));
};
