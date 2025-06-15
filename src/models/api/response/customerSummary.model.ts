import { t } from 'elysia';
import { NotFoundErrorSchema } from './errors.model';

export const CustomerSummarySchema = t.Object({
    customer_id: t.String(),
    company_name: t.String(),
    address: t.Object({
        street: t.String(),
        city: t.String(),
        state: t.String(),
        zip: t.String(),
        country: t.String(),
    }),
    billing_info: t.Union([
        t.Object({
            payment_terms: t.String(),
            credit_limit: t.Number(),
            currency: t.String(),
        }),
        NotFoundErrorSchema('billing'),
    ]),
    invoices: t.Union([
        t.Array(
            t.Object({
                invoice_id: t.String(),
                amount: t.Number(),
                currency: t.String(),
                status: t.String(),
                due_date: t.String(),
            }),
        ),
        NotFoundErrorSchema('invoices'),
    ]),
    orders: t.Union([
        t.Array(
            t.Object({
                order_id: t.String(),
                status: t.String(),
                order_date: t.String(),
                total_value: t.Number(),
                currency: t.String(),
                vendor: t.String(),
                jobs: t.Union([
                    t.Array(
                        t.Object({
                            job_id: t.String(),
                            status: t.String(),
                            completion_date: t.Optional(
                                t.String(),
                            ),
                        }),
                    ),
                    NotFoundErrorSchema('jobs'),
                ]),
                delivery: t.Union([
                    t.Object({
                        delivery_status: t.String(),
                        delivery_date: t.String(),
                        tracking_number: t.String(),
                        carrier: t.String(),
                    }),
                    NotFoundErrorSchema('delivery'),
                ]),
            }),
        ),
        NotFoundErrorSchema('orders'),
    ]),
});
