import { z } from 'zod';

export type InferErrorMap<
    T extends { [key: string]: z.ZodObject<any> },
> = {
    [K in keyof T]: z.infer<T[K]>;
};
