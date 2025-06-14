type UnknownToVoid<T> = unknown extends T ? void : T;

export type ExecuteArgs<T, V, N> =
    UnknownToVoid<T> extends void ? V : N;
