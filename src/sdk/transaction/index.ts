type RollbackAction = () => Promise<void>;

export class Transaction {
    private actions: RollbackAction[] = [];
    public rolledBackCount = 0;

    get isRolledBack() {
        return (
            this.rolledBackCount === this.actions.length &&
            this.actions.length > 0
        );
    }

    register(action: RollbackAction) {
        if (this.isRolledBack) {
            throw new Error(
                'Transaction already completed',
            );
        }

        this.actions.unshift(action);
    }

    async rollback(): Promise<void> {
        if (this.isRolledBack) {
            throw new Error(
                'Transaction already completed',
            );
        }

        for (const action of this.actions) {
            await action();

            this.rolledBackCount++;
        }
    }
}
