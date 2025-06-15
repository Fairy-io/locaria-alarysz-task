import Elysia, { t } from 'elysia';
import { ApiController } from './api.controller';
import { CustomerSummarySchema } from '../models/api/response/customerSummary.model';
import { NotFoundErrorSchema } from '../models/api/response/errors.model';

export const SummaryController = new Elysia({
    prefix: '/api',
    tags: ['Summary'],
})
    .use(ApiController)

    .model('CustomerSummary', CustomerSummarySchema)

    .get(
        '/customers/:customer_id/summary',
        async ({ params, error: send }) => {
            const customerId = params.customer_id;
        },
        {
            params: t.Object({
                customer_id: t.String(),
            }),
            response: {
                200: 'CustomerSummary',
                404: NotFoundErrorSchema('customer'),
            },
        },
    );
