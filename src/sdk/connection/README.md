# Connection

A type-safe HTTP client wrapper that provides automatic validation, transaction support, and easy mocking capabilities.

## Features

-   Type-safe API endpoints with request/response validation using Zod schemas
-   Built-in transaction support for rollback operations
-   Easy mocking for testing
-   URL parameter interpolation
-   Automatic query parameter handling
-   Custom action support for complex operations

## Usage

### Basic Setup

```typescript
import { createConnection } from 'fairy-io';
import { z } from 'zod';

const connection = createConnection({
    baseUrl: 'https://api.example.com',
    functions: {
        getUser: {
            endpoint: 'users/:id',
            method: 'GET',
            expectedResponse: z.object({
                id: z.string(),
                name: z.string(),
            }),
            expectedData: z.object({
                id: z.string(),
            }),
        },
        createUser: {
            endpoint: 'users',
            method: 'POST',
            expectedResponse: z.object({
                id: z.string(),
                name: z.string(),
            }),
            expectedData: z.object({
                name: z.string(),
            }),
        },
    },
});
```

### Making Requests

```typescript
// GET request
const user = await connection.getUser({ id: '123' });

// POST request
const newUser = await connection.createUser({
    name: 'John Doe',
});
```

### URL Parameters

Endpoints can contain URL parameters prefixed with `:`. These parameters will be interpolated from the request data:

```typescript
// For endpoint 'users/:id'
await connection.getUser({ id: '123' }); // Makes request to 'users/123'
```

### Query Parameters

For GET and DELETE requests, non-URL parameters are automatically converted to query parameters:

```typescript
await connection.getUsers({
    type: 'admin',
    active: true,
}); // Makes request to 'users?type=admin&active=true'
```

### Transaction Support

The connection supports transactions for rollback operations. Note that transactions only work with endpoints that have custom actions defined, since actions provide the rollback functionality:

```typescript
import { Transaction } from 'fairy-io';

const transaction = new Transaction();

try {
    // Transaction will only work if createUser has a custom action defined
    await connection.createUser(
        { name: 'John' },
        transaction,
    );
    // Transaction will only work if createPost has a custom action defined
    await connection.createPost(
        { title: 'Hello' },
        transaction,
    );
} catch (error) {
    await transaction.rollback(); // Rolls back all operations that had actions
}
```

For an endpoint to support transactions, it must have a custom action that implements the rollback logic:

```typescript
class CreateUserAction extends Action<
    {
        ky: KyInstance;
        endpoint: string;
        searchParams: URLSearchParams;
        data: {
            name?: string;
        };
    },
    { id: string; name: string }
> {
    private userId: string | undefined;
    private ky: KyInstance | undefined;

    protected async execute({
        ky,
        endpoint,
        searchParams,
        data,
    }) {
        const response = await ky
            .post(endpoint, {
                json: data,
                searchParams,
            })
            .json();
        this.userId = response.id; // Store ID for potential rollback
        this.ky = ky; // Store ky instance for potential rollback
        return response;
    }

    protected async rollback() {
        if (this.userId && this.ky) {
            await this.ky.delete(`users/${this.userId}`);
        }
    }
}
```

### Custom Actions

You can define custom actions for complex operations:

```typescript
class CreateUserAction extends Action<
    {
        ky: KyInstance;
        endpoint: string;
        searchParams: URLSearchParams;
        data: {
            name?: string;
        };
    },
    { id: string; name: string }
> {
    protected async execute({
        ky,
        endpoint,
        searchParams,
        data,
    }) {
        return ky
            .post(endpoint, {
                json: data,
                searchParams,
            })
            .json();
    }

    protected async rollback() {
        // Cleanup logic here
    }
}

const connection = createConnection({
    baseUrl: 'https://api.example.com',
    functions: {
        createUser: {
            endpoint: 'users',
            method: 'POST',
            expectedResponse: userSchema,
            expectedData: userSchema,
            action: CreateUserAction,
        },
    },
});
```

### Testing with Mocks

The connection can be easily mocked using the dependency injection system:

```typescript
import { inject } from '../di';
import { vi } from 'vitest';

const connection = inject('connection', vi.fn);

// Mock specific endpoints
connection.getUser.mockResolvedValue({
    id: '123',
    name: 'John Doe',
});

// Use in tests
const response = await connection.getUser({ id: '123' });
expect(response).toEqual({
    id: '123',
    name: 'John Doe',
});
```

## API Reference

### createConnection Options

```typescript
type ConnectionOptions = {
    baseUrl: string;
    functions: {
        [key: string]: {
            endpoint: string;
            method: 'GET' | 'POST' | 'PUT' | 'DELETE';
            expectedResponse: z.ZodSchema;
            expectedData?: z.ZodSchema;
            action?: typeof Action;
        };
    };
};
```

-   `baseUrl`: The base URL for all API requests
-   `functions`: Object defining the available API endpoints
    -   `endpoint`: URL path with optional parameters (e.g., 'users/:id')
    -   `method`: HTTP method
    -   `expectedResponse`: Zod schema for response validation
    -   `expectedData`: Zod schema for request data validation (optional)
    -   `action`: Custom Action class for complex operations (optional)
