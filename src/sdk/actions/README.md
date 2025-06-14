# actions

## Action class

The `Action` class represents a single, atomic operation that can be executed and potentially rolled back. Each Action instance is designed to be used only once, ensuring that every execution is a unique, one-time operation.

-   **Execution:** The `Action` abstract class provides a static execute method that handles the lifecycle of an action, including its instantiation, execution, and optional registration with a Transaction. Direct execution of action is not allowed.
-   **Rollback:** Every `Action` instance must define a rollback method to undo the operation if necessary. However, direct invocation of rollback is restricted to trusted contexts, like a Transaction, to prevent improper use.

## Examples

### Definition

`Action` is abstract class defined in [index.ts](index.ts). It takes 2 generic arguments `Action<T, R>` where:

-   `T` is argument type parameter (it can be anything: number, string, object, etc.). However action can accept only one parameter for execute method.
-   `R` is what action should return

If we don't want action to take any parameters, use `void`.
If we don't want action to return anything, use `void`.

`Action` instance class constructor cannot take any parameters.

```typescript
class MyAction extends Action<void, void> {
    protected async execute(): Promise<void> {
        console.log('execute');
    }
    protected async rollback(): Promise<void> {
        console.log('rollback');
    }
}

class MyNumberAction extends Action<number, number> {
    protected async execute(
        args_0: number,
    ): Promise<number> {
        console.log(`execute with ${args_0}`);

        return args_0;
    }
    protected async rollback(): Promise<void> {
        console.log('rollback');
    }
}
```

### Invocation

```typescript
await Action.execute(MyAction); // no parameters and no return

const number = await Action.execute(MyNumberAction, 123); // action has been executed with number 123 and returned 123
```
