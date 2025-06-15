import { createConnection } from '../sdk/connection';
import { z } from 'zod';
import {
    CustomerIdSchema,
    NotFoundErrorSchema,
    OrderIdSchema,
} from '../models/api/external';

export const GetCustomerOrdersSchema = z.object({
    customer_id: z.string(),
    orders: z.array(
        z.object({
            order_id: z.string(),
            status: z.string(),
        }),
    ),
});

export const GetOrderDetailsSchema = z.object({
    order_id: z.string(),
    status: z.string(),
    order_date: z.string(),
    total_value: z.number(),
    currency: z.string(),
    vendor: z.string(),
});

export const GetOrderJobsSchema = z.object({
    order_id: z.string(),
    jobs: z.array(
        z.object({
            job_id: z.string(),
            status: z.string(),
            completion_date: z.string().optional(),
        }),
    ),
});

export const GetOrderDeliveryDetailsSchema = z.object({
    order_id: z.string(),
    delivery_status: z.string(),
    delivery_date: z.string(),
    tracking_number: z.string(),
    carrier: z.string(),
});

export const OderinoProvider = (url: string) =>
    createConnection({
        baseUrl: url,
        functions: {
            getCustomerOrders: {
                method: 'GET',
                endpoint:
                    'v1/customers/:customer_id/orders',
                expectedResponse: GetCustomerOrdersSchema,
                expectedData: CustomerIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
            getOrderDetails: {
                method: 'GET',
                endpoint: 'v2/orders/:order_id',
                expectedResponse: GetOrderDetailsSchema,
                expectedData: OrderIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
            getOrderJobs: {
                method: 'GET',
                endpoint: 'v2/orders/:order_id/jobs',
                expectedResponse: GetOrderJobsSchema,
                expectedData: OrderIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
            getOrderDeliveryDetails: {
                method: 'GET',
                endpoint: 'v1/orders/:order_id/delivery',
                expectedResponse:
                    GetOrderDeliveryDetailsSchema,
                expectedData: OrderIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
        },
    });
