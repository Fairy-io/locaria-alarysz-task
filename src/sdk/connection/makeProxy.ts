import { HTTPError } from 'ky';
import { Result } from '../result';
import { Transaction } from '../transaction';
import { isTransaction } from '../types/isTransaction';
import { ConnectionOptions } from './types';

type Connection = Record<
    string,
    (data?: any) => Promise<any>
>;

const parseJsonError = (
    errorData: any,
    errorMap: ConnectionOptions['functions'][string]['errorMap'],
) => {
    if (!errorMap) {
        return;
    }

    for (const [key, schema] of Object.entries(errorMap)) {
        try {
            const parsedError = schema.parse(errorData);
            const result = new Result();
            result.error(key, parsedError);
            return result;
        } catch {
            continue;
        }
    }
};

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
                const {
                    expectedResponse,
                    expectedData,
                    errorMap,
                } = functions[key];

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

                try {
                    const response = await value(
                        requestData,
                        requestTransaction,
                    );

                    if (response instanceof Result) {
                        return response;
                    }

                    const parsedResponse =
                        expectedResponse.parse(response);

                    if (errorMap) {
                        const result = new Result();
                        result.ok(parsedResponse);
                        return result;
                    }

                    return parsedResponse;
                } catch (error) {
                    if (
                        errorMap &&
                        error instanceof HTTPError
                    ) {
                        const errorData =
                            await error.response.json();

                        const parsedErrorResult =
                            parseJsonError(
                                errorData,
                                errorMap,
                            );

                        if (parsedErrorResult) {
                            return parsedErrorResult;
                        }

                        throw new Error(
                            JSON.stringify(errorData),
                        );
                    }

                    throw error;
                }
            };

            target[key] = new Proxy(fn, {
                get(_, functionProp) {
                    const value = values[key];

                    const result =
                        value[functionProp.toString()];

                    return typeof result === 'function'
                        ? result.bind(value)
                        : result;
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
