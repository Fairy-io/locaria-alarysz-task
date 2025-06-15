# Customer Data Aggregation API

A REST API wrapper that aggregates customer data from FINANCERO (financial billing system) and ODERINO (order processing system) platforms, providing a unified interface for accessing customer information.

## 🚀 Features

-   Single endpoint for accessing aggregated customer data
-   Robust error handling with partial failure support
-   In-memory caching for frequently requested data
-   Modular architecture for easy extension
-   Automated deployment pipeline
-   Comprehensive test coverage

## 🛠️ Technical Stack

-   **Language**: TypeScript
-   **Runtime**: Bun
-   **Containerization**: Docker
-   **Deployment**: Google Cloud Run
-   **CI/CD**: Google Cloud Build
-   **Infrastructure**: Terraform (via separate infrastructure repository)
-   **Testing**: Bun test runner

## 🏗️ Architecture

The solution is built with modularity and scalability in mind:

1. **Core Components**:

    - REST API wrapper
    - Data aggregation service
    - Caching layer
    - Error handling system

2. **Deployment Architecture**:
    - Containerized application
    - Serverless deployment on Google Cloud Run
    - Automated CI/CD pipeline
    - Infrastructure as Code (Terraform)

## 📝 API Documentation

### Endpoint: GET /api/customers/{customer_id}/summary

Retrieves aggregated customer data from both FINANCERO and ODERINO systems.

#### Parameters

-   `customer_id` (path parameter): Unique identifier for the customer

#### Response

```json
{
    "customer_id": "string",
    "company_name": "string",
    "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string"
    },
    "billing_info": {
        "payment_terms": "string",
        "credit_limit": 1,
        "currency": "string"
    },
    "invoices": [
        {
            "invoice_id": "string",
            "amount": 1,
            "currency": "string",
            "status": "string",
            "due_date": "string"
        }
    ],
    "orders": [
        {
            "order_id": "string",
            "status": "string",
            "order_date": "string",
            "total_value": 1,
            "currency": "string",
            "vendor": "string",
            "jobs": [
                {
                    "job_id": "string",
                    "status": "string",
                    "completion_date": "string"
                }
            ],
            "delivery": {
                "delivery_status": "string",
                "delivery_date": "string",
                "tracking_number": "string",
                "carrier": "string"
            }
        }
    ]
}
```

## 🚀 Getting Started

### Prerequisites

-   Bun runtime
-   Docker
-   Google Cloud SDK (for deployment)

### Local Development

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
bun install
```

3. Run tests:

```bash
bun tests
```

4. Start the development server:

```bash
bun dev
```

### Deployment

The application is automatically deployed to Google Cloud Run through the CI/CD pipeline. The deployment process includes:

1. Building the Docker image
2. Running tests
3. Pushing to Google Artifact Registry
4. Deploying to Cloud Run

## 🔮 Future Improvements

Given more time and resources, here are the planned improvements:

1. **Error Handling Enhancement**

    - Implement status code-based error detection
    - Standardize error responses across all services
    - Add more descriptive error payloads

2. **SDK Optimization**

    - Refactor connection utility
    - Improve type safety
    - Add better documentation

3. **Observability**

    - Implement structured logging
    - Add distributed tracing
    - Set up monitoring and alerting

4. **Caching Strategy**

    - Migrate from in-memory to Redis
    - Implement cache invalidation

5. **Security Enhancements**

    - Implement Google Secret Manager integration
    - Add service-to-service authentication
    - Implement rate limiting

6. **Additional Features**

    - Add more endpoints for specific data queries
    - Implement real-time updates
    - Implement API versioning

7. **Type System Improvements**
    - Replace string-based status fields with proper enums
    - Implement proper date handling with ISO 8601 format
    - Create shared type definitions between services

## 📄 License

MIT

## 👨‍💻 Author

Adrian Larysz

## 🌐 Live Demo

You can explore the working API at [locaria-alarysz-task-dev.magicfe.net/docs](https://locaria-alarysz-task-dev.magicfe.net/docs). This is a fully functional deployment of the application, where you can:

-   Test the API endpoints
-   View the API documentation
-   See the actual response formats
-   Experiment with different customer IDs

## 🎯 Technical Decisions

### Framework Choice

I chose [Elysia](https://elysiajs.com/) as the HTTP framework because it provides excellent TypeScript support and is powered by [Bun](https://bun.sh/), one of the fastest JavaScript runtimes available. This combination ensures both type safety and high performance.

### Development Infrastructure

To accelerate development and maintain consistency, I leveraged my existing infrastructure:

1. **GitHub Template Repository**

    - Used my [bun-elysia-template](https://github.com/Fairy-io/bun-elysia-template) as a foundation
    - This template provides a standardized project structure and common utilities
    - Significantly reduced setup time while maintaining best practices

2. **Deployment Infrastructure**

    - Utilized my private infrastructure repository for deployment
    - Currently focused on Google Cloud Run for simplicity and cost-effectiveness
    - The deployment process is documented in the [bun-elysia-template](https://github.com/Fairy-io/bun-elysia-template?tab=readme-ov-file#deploying-application)
    - Areas for improvement:
        - Enhanced secret management
        - More sophisticated infrastructure patterns
        - Additional cloud services integration
        - Potentially use of Kubernetes

3. **Custom SDK**
    - Incorporated parts of my private SDK for testing and implementation
    - The goal of this SDK was to simplify testing process and speed up setting up external services connectors
    - While this accelerated development, I acknowledge its current limitations:
        - Some over-engineering in certain areas
        - Room for better modularization

These technical decisions were made to balance development speed with maintainability, while keeping the door open for future improvements and scaling.
