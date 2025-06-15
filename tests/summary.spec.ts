import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    mock,
} from 'bun:test';
import { createApp } from '../src/createApp';
import { Mocked } from '../src/sdk/di';
import {
    FinanceroProvider,
    GetCustomerBillingInfoSchema,
    GetCustomerInvoicesSchema,
} from '../src/providers/financero.provider';
import {
    GetCustomerOrdersSchema,
    GetOrderDeliveryDetailsSchema,
    GetOrderDetailsSchema,
    GetOrderJobsSchema,
    OderinoProvider,
} from '../src/providers/oderino.provider';
import { createInject } from '../src/plugins/di';
import { Result } from '../src/sdk/result';
import { InferErrorMap } from '../src/sdk/types/InferErrorMap';
import { NotFoundErrorSchema } from '../src/models/api/external';
import { GetCustomerAddressSchema } from '../src/providers/financero.provider';
import z from 'zod';

describe('GET /api/customers/:customer_id/summary', () => {
    let app: ReturnType<typeof createApp>;
    let financeroProvider: Mocked<
        ReturnType<typeof FinanceroProvider>
    >;
    let oderinoProvider: Mocked<
        ReturnType<typeof OderinoProvider>
    >;

    beforeAll(() => {
        const inject = createInject();

        financeroProvider = inject(
            'FinanceroProvider',
            mock as any,
        );

        oderinoProvider = inject(
            'OderinoProvider',
            mock as any,
        );

        app = createApp(inject);
    });

    afterEach(() => {
        financeroProvider.getCustomerAddress.mockReset();
        financeroProvider.getCustomerBillingInfo.mockReset();
        financeroProvider.getCustomerInvoices.mockReset();
        oderinoProvider.getCustomerOrders.mockReset();
        oderinoProvider.getOrderDetails.mockReset();
        oderinoProvider.getOrderJobs.mockReset();
        oderinoProvider.getOrderDeliveryDetails.mockReset();
    });

    it('returns correct summary and calls external apis', async () => {
        const getCustomerAddressResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerAddressSchema>
        >();
        getCustomerAddressResult.ok({
            customer_id: '12345',
            company_name: 'ABC Corp',
            address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA',
            },
        });

        const getCustomerBillingInfoResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerBillingInfoSchema>
        >();
        getCustomerBillingInfoResult.ok({
            customer_id: '12345',
            payment_terms: 'Net 30',
            credit_limit: 10000,
            currency: 'USD',
        });

        const getCustomerInvoicesResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerInvoicesSchema>
        >();
        getCustomerInvoicesResult.ok({
            customer_id: '12345',
            invoices: [
                {
                    invoice_id: 'INV-001',
                    amount: 5000,
                    currency: 'USD',
                    status: 'Paid',
                    due_date: '2024-12-31',
                },
                {
                    invoice_id: 'INV-002',
                    amount: 3000,
                    currency: 'USD',
                    status: 'Pending',
                    due_date: '2024-11-30',
                },
            ],
        });

        const getCustomerOrdersResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerOrdersSchema>
        >();
        getCustomerOrdersResult.ok({
            customer_id: '12345',
            orders: [
                {
                    order_id: 'ORD-001',
                    status: 'Delivered',
                },
                {
                    order_id: 'ORD-002',
                    status: 'In Progress',
                },
            ],
        });

        const getOrderDetailsResult1 = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetOrderDetailsSchema>
        >();
        getOrderDetailsResult1.ok({
            order_id: 'ORD-001',
            status: 'Delivered',
            order_date: '2024-11-01',
            total_value: 2000,
            currency: 'USD',
            vendor: 'Vendor A',
        });

        const getOrderDetailsResult2 = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetOrderDetailsSchema>
        >();
        getOrderDetailsResult2.ok({
            order_id: 'ORD-002',
            status: 'In Progress',
            order_date: '2024-11-05',
            total_value: 5000,
            currency: 'USD',
            vendor: 'Vendor B',
        });

        const getOrderJobsResult1 = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetOrderJobsSchema>
        >();
        getOrderJobsResult1.ok({
            order_id: 'ORD-001',
            jobs: [
                {
                    job_id: 'JOB-001',
                    status: 'Completed',
                    completion_date: '2024-11-05',
                },
                {
                    job_id: 'JOB-002',
                    status: 'In Progress',
                },
            ],
        });

        const getOrderJobsResult2 = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetOrderJobsSchema>
        >();
        getOrderJobsResult2.error('notFound', {
            error: 'Not found',
        });

        const getOrderDeliveryDetailsResult1 = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetOrderDeliveryDetailsSchema>
        >();
        getOrderDeliveryDetailsResult1.ok({
            order_id: 'ORD-001',
            delivery_status: 'Delivered',
            delivery_date: '2024-11-10',
            tracking_number: 'TRK123456789',
            carrier: 'DHL',
        });

        const getOrderDeliveryDetailsResult2 = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetOrderDeliveryDetailsSchema>
        >();
        getOrderDeliveryDetailsResult2.error('notFound', {
            error: 'No delivery details found for order',
        });

        financeroProvider.getCustomerAddress.mockResolvedValue(
            getCustomerAddressResult,
        );
        financeroProvider.getCustomerBillingInfo.mockResolvedValue(
            getCustomerBillingInfoResult,
        );
        financeroProvider.getCustomerInvoices.mockResolvedValue(
            getCustomerInvoicesResult,
        );

        oderinoProvider.getCustomerOrders.mockResolvedValue(
            getCustomerOrdersResult,
        );
        oderinoProvider.getOrderJobs.mockResolvedValueOnce(
            getOrderJobsResult1,
        );
        oderinoProvider.getOrderJobs.mockResolvedValueOnce(
            getOrderJobsResult2,
        );
        oderinoProvider.getOrderDetails.mockResolvedValueOnce(
            getOrderDetailsResult1,
        );
        oderinoProvider.getOrderDetails.mockResolvedValueOnce(
            getOrderDetailsResult2,
        );
        oderinoProvider.getOrderDeliveryDetails.mockResolvedValueOnce(
            getOrderDeliveryDetailsResult1,
        );
        oderinoProvider.getOrderDeliveryDetails.mockResolvedValueOnce(
            getOrderDeliveryDetailsResult2,
        );

        const response = await app.handle(
            new Request(
                'http://localhost/api/customers/12345/summary',
                {
                    method: 'get',
                },
            ),
        );

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            customer_id: '12345',
            company_name: 'ABC Corp',
            address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA',
            },
            billing_info: {
                payment_terms: 'Net 30',
                credit_limit: 10000,
                currency: 'USD',
            },
            invoices: [
                {
                    invoice_id: 'INV-001',
                    amount: 5000,
                    currency: 'USD',
                    status: 'Paid',
                    due_date: '2024-12-31',
                },
                {
                    invoice_id: 'INV-002',
                    amount: 3000,
                    currency: 'USD',
                    status: 'Pending',
                    due_date: '2024-11-30',
                },
            ],
            orders: [
                {
                    order_id: 'ORD-001',
                    status: 'Delivered',
                    order_date: '2024-11-01',
                    total_value: 2000,
                    currency: 'USD',
                    vendor: 'Vendor A',
                    jobs: [
                        {
                            job_id: 'JOB-001',
                            status: 'Completed',
                            completion_date: '2024-11-05',
                        },
                        {
                            job_id: 'JOB-002',
                            status: 'In Progress',
                        },
                    ],
                    delivery: {
                        delivery_status: 'Delivered',
                        delivery_date: '2024-11-10',
                        tracking_number: 'TRK123456789',
                        carrier: 'DHL',
                    },
                },
                {
                    order_id: 'ORD-002',
                    status: 'In Progress',
                    order_date: '2024-11-05',
                    total_value: 5000,
                    currency: 'USD',
                    vendor: 'Vendor B',
                    jobs: {
                        error: true,
                        code: 'NOT_FOUND',
                        details: {
                            id: 'ORD-002',
                            type: 'jobs',
                        },
                    },
                    delivery: {
                        error: true,
                        code: 'NOT_FOUND',
                        details: {
                            id: 'ORD-002',
                            type: 'delivery',
                        },
                    },
                },
            ],
        });

        expect(
            financeroProvider.getCustomerAddress.mock
                .calls[0][0],
        ).toEqual({ customer_id: '12345' });
        expect(
            financeroProvider.getCustomerBillingInfo.mock
                .calls[0][0],
        ).toEqual({ customer_id: '12345' });
        expect(
            financeroProvider.getCustomerInvoices.mock
                .calls[0][0],
        ).toEqual({ customer_id: '12345' });
        expect(
            oderinoProvider.getCustomerOrders.mock
                .calls[0][0],
        ).toEqual({ customer_id: '12345' });
        expect(
            oderinoProvider.getOrderDetails.mock
                .calls[0][0],
        ).toEqual({ order_id: 'ORD-001' });
        expect(
            oderinoProvider.getOrderDetails.mock
                .calls[1][0],
        ).toEqual({ order_id: 'ORD-002' });
        expect(
            oderinoProvider.getOrderJobs.mock.calls[0][0],
        ).toEqual({ order_id: 'ORD-001' });
        expect(
            oderinoProvider.getOrderJobs.mock.calls[1][0],
        ).toEqual({ order_id: 'ORD-002' });
        expect(
            oderinoProvider.getOrderDeliveryDetails.mock
                .calls[0][0],
        ).toEqual({ order_id: 'ORD-001' });
        expect(
            oderinoProvider.getOrderDeliveryDetails.mock
                .calls[1][0],
        ).toEqual({ order_id: 'ORD-002' });
    });

    it('returns 404 if customer not found', async () => {
        const getCustomerAddressResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerAddressSchema>
        >();
        getCustomerAddressResult.error('notFound', {
            error: 'Customer address not found',
        });

        financeroProvider.getCustomerAddress.mockResolvedValue(
            getCustomerAddressResult,
        );

        const response = await app.handle(
            new Request(
                'http://localhost/api/customers/12345/summary',
            ),
        );

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({
            error: true,
            code: 'NOT_FOUND',
            details: {
                id: '12345',
                type: 'customer',
            },
        });
    });

    it('returns empty  info if customer has no billing info, invoices, or orders', async () => {
        const getCustomerAddressResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerAddressSchema>
        >();
        getCustomerAddressResult.ok({
            customer_id: '12345',
            company_name: 'ABC Corp',
            address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA',
            },
        });

        const getCustomerBillingInfoResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerBillingInfoSchema>
        >();
        getCustomerBillingInfoResult.error('notFound', {
            error: 'Billing info not found',
        });

        const getCustomerInvoicesResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerInvoicesSchema>
        >();
        getCustomerInvoicesResult.error('notFound', {
            error: 'Invoices not found',
        });

        const getCustomerOrdersResult = new Result<
            InferErrorMap<{
                notFound: typeof NotFoundErrorSchema;
            }>,
            z.infer<typeof GetCustomerOrdersSchema>
        >();
        getCustomerOrdersResult.error('notFound', {
            error: 'Not found',
        });

        financeroProvider.getCustomerAddress.mockResolvedValue(
            getCustomerAddressResult,
        );
        financeroProvider.getCustomerBillingInfo.mockResolvedValue(
            getCustomerBillingInfoResult,
        );
        financeroProvider.getCustomerInvoices.mockResolvedValue(
            getCustomerInvoicesResult,
        );
        oderinoProvider.getCustomerOrders.mockResolvedValue(
            getCustomerOrdersResult,
        );

        const response = await app.handle(
            new Request(
                'http://localhost/api/customers/12345/summary',
            ),
        );

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            customer_id: '12345',
            company_name: 'ABC Corp',
            address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA',
            },
            billing_info: {
                error: true,
                code: 'NOT_FOUND',
                details: {
                    id: '12345',
                    type: 'billing',
                },
            },
            invoices: {
                error: true,
                code: 'NOT_FOUND',
                details: {
                    id: '12345',
                    type: 'invoices',
                },
            },
            orders: {
                error: true,
                code: 'NOT_FOUND',
                details: {
                    id: '12345',
                    type: 'orders',
                },
            },
        });
    });
});
