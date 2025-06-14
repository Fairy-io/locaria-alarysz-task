import { Transaction } from '../transaction';

export const isTransaction = (
    arg: any,
): arg is Transaction => {
    return arg instanceof Transaction;
};
