# transaction

## Transaction class

The `Transaction` class acts as a coordinator for multiple Action instances, ensuring that all registered actions can be safely rolled back if needed.

-   **Registration:** When an action is executed using `Action.execute`, it can register its rollback logic with a Transaction.
-   **Rollback Management**: The `Transaction` maintains a sequence of registered rollback operations and provides the ability to execute them, ensuring atomicity and consistency across multiple actions.

## Examples

For actions documentation, see [this](../actions/README.md).

```typescript
const transaction = new Transaction();

try {
    await Action.execute(MyAction, transaction); // 1
    await Action.execute(MyNumberAction, 123, transaction); // 2
    await Action.execute(MyAction, transaction); // 3

    console.log({
        isRolledBack: transaction.isRolledBack,
        rolledBackCount: transaction.rolledBackCount,
    }); // { isRolledBack: false, rolledBackCount: 0 }
} catch (error) {
    await transaction.rollback(); // if one of actions throw error, all actions will be rolled back in opposite order (from 3 to 1)

    console.log({
        isRolledBack: transaction.isRolledBack,
        rolledBackCount: transaction.rolledBackCount,
    }); // { isRolledBack: true, rolledBackCount: 3 }
}
```
