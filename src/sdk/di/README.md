# di

Dependency injection system designed for simplifying testing

## The way it works

```ts
// di.ts
import { provide } from 'fairy-io';

// Define your services
const inject = provide({
    SomeService: new SomeService(),
    SomeOtherService: new SomeOtherService(),
});

// controller.ts
import { inject } from '../di';

const SomeOtherService = inject('SomeOtherService');
const SomeService = inject('SomeService');

// controller.spec.ts
import { mock } from 'bun:test';
import { inject } from '../src/di';

inject('SomeOtherService', mock).someMethod.mockReturnValue(
    1,
); // mocking

// someOtherService.spec.ts
import { mock } from 'bun:test';
import { inject } from '../src/di';

inject('SomeService', mock).someMethod.mockReturnValue(1); // mocking
```
