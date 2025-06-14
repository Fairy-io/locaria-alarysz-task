import { Transaction } from '../transaction';
import { ExecuteArgs } from '../types/ExecuteArgs';
import { isTransaction } from '../types/isTransaction';

export abstract class Action<T, R> {
    protected abstract execute(
        ...args: ExecuteArgs<T, [], [T]>
    ): Promise<R>;

    protected abstract rollback(): Promise<void>;

    static async execute<K, L, T extends K, R extends L>(
        Action: new () => Action<K, L>,
        ...args: ExecuteArgs<
            T,
            [Transaction?],
            [T, Transaction?]
        >
    ): Promise<R> {
        const action = new Action();

        const [arg0, arg1] = args;

        let transaction: Transaction | undefined =
            undefined;
        let result: any = undefined;
        let error: any = undefined;

        try {
            if (isTransaction(arg0)) {
                transaction = arg0;

                result = await (action.execute as any)();
            } else {
                transaction = arg1;

                result = await (action.execute as any)(
                    arg0,
                );
            }
        } catch (err) {
            error = err;
        }

        if (isTransaction(transaction)) {
            transaction.register(() => action.rollback());
        }

        if (error) {
            throw error;
        }

        return result;
    }
}
