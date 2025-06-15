import Elysia, { t } from 'elysia';
import { ApiController } from './api.controller';
import { CustomerSummarySchema } from '../models/api/response/customerSummary.model';
import { NotFoundErrorSchema } from '../models/api/response/errors.model';
import { constructCustomerSummary } from '../utils/constructCustomerSummary';

export const SummaryController = new Elysia({
    prefix: '/api',
    tags: ['Summary'],
})
    .use(ApiController)

    .model('CustomerSummary', CustomerSummarySchema)

    .get(
        '/customers/:customer_id/summary',
        async ({ params, error: send, inject }) => {
            const financeroProvider = inject(
                'FinanceroProvider',
            );
            const oderinoProvider = inject(
                'OderinoProvider',
            );

            const customerSummary =
                await constructCustomerSummary(
                    params.customer_id,
                    financeroProvider,
                    oderinoProvider,
                );

            if (!customerSummary) {
                return send('Not Found', {
                    error: true,
                    code: 'NOT_FOUND',
                    details: {
                        id: params.customer_id,
                        type: 'customer',
                    },
                });
            }

            return send('OK', customerSummary);
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
