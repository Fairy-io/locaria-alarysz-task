import { z } from 'zod';

export const CustomerIdSchema = z.object({
    customer_id: z.string(),
});

export const OrderIdSchema = z.object({
    order_id: z.string(),
});

export const NotFoundErrorSchema = z.object({
    error: z.string(),
});
