import { Mock } from 'vitest';

type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any
        ? K
        : never;
}[keyof T];

export type Mocked<T = Record<string, any>> = {
    [K in FunctionPropertyNames<T>]: T[K] extends (
        ...args: any[]
    ) => any
        ? Mock<
              (
                  ...args: Parameters<T[K]>
              ) => ReturnType<T[K]>
          >
        : never;
};

export const provide = <T extends Record<string, any>>(
    services: T,
) => {
    const store = new Map<string, any>();

    // Initialize the store with provided services
    Object.entries(services).forEach(([key, value]) => {
        store.set(key, value);
    });

    function inject<K extends keyof T>(key: K): T[K];
    function inject<K extends keyof T>(
        key: K,
        mockFn: () => Mock,
    ): Mocked<T[K]>;
    function inject<K extends keyof T>(
        key: K,
        mockFn?: () => Mock,
    ): T[K] | Mocked<T[K]> {
        const value = store.get(key as string);

        if (!mockFn) {
            return value;
        }

        const properties = [
            ...Object.getOwnPropertyNames(
                Object.getPrototypeOf(value),
            ),
            ...Object.keys(value),
        ];

        properties.forEach((methodKey) => {
            if (
                typeof value[methodKey] === 'function' &&
                ![
                    'constructor',
                    '__defineGetter__',
                    '__defineSetter__',
                    'hasOwnProperty',
                    '__lookupGetter__',
                    '__lookupSetter__',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'toString',
                    'valueOf',
                    '__proto__',
                    'toLocaleString',
                ].includes(methodKey)
            ) {
                // Create a new mock instance for each method
                value[methodKey] = mockFn();
            }
        });

        return value;
    }

    return inject;
};
