import { createConnection } from '../sdk/connection';
import { z } from 'zod';
import {
    CustomerIdSchema,
    NotFoundErrorSchema,
} from '../models/api/external';

export const GetCustomerAddressSchema = z.object({
    customer_id: z.string(),
    company_name: z.string(),
    address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        country: z.string(),
    }),
});

export const GetCustomerBillingInfoSchema = z.object({
    customer_id: z.string(),
    payment_terms: z.string(),
    credit_limit: z.number(),
    currency: z.string(),
});

export const GetCustomerInvoicesSchema = z.object({
    customer_id: z.string(),
    invoices: z.array(
        z.object({
            invoice_id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.string(),
            due_date: z.string(),
        }),
    ),
});

export const FinanceroProvider = (url: string) =>
    createConnection({
        baseUrl: url,
        functions: {
            getCustomerAddress: {
                method: 'GET',
                endpoint:
                    'v1/customers/:customer_id/address',
                expectedResponse: GetCustomerAddressSchema,
                expectedData: CustomerIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
            getCustomerBillingInfo: {
                method: 'GET',
                endpoint:
                    'v1/customers/:customer_id/billing-info',
                expectedResponse:
                    GetCustomerBillingInfoSchema,
                expectedData: CustomerIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
            getCustomerInvoices: {
                method: 'GET',
                endpoint:
                    'v3-1/customers/:customer_id/invoices',
                expectedResponse: GetCustomerInvoicesSchema,
                expectedData: CustomerIdSchema,
                errorMap: {
                    notFound: NotFoundErrorSchema,
                },
            },
        },
    });
