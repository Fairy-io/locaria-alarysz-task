import {
    OderinoProvider,
    FinanceroProvider,
} from '../providers';
import { NotFoundErrorSchema } from '../models/api/response';
import { CustomerSummarySchema } from '../models/api/response/customerSummary.model';

type FinProvider = ReturnType<typeof FinanceroProvider>;
type OderProvider = ReturnType<typeof OderinoProvider>;

const getCustomerAddress = async (
    customer_id: string,
    financeroProvider: FinProvider,
) => {
    const result =
        await financeroProvider.getCustomerAddress({
            customer_id,
        });

    const expected = result.expect(['notFound']);

    if (expected.notFound) {
        return null;
    }

    return expected.ok!;
};

const getCustomerBillingInfo = async (
    customer_id: string,
    financeroProvider: FinProvider,
) => {
    const result =
        await financeroProvider.getCustomerBillingInfo({
            customer_id,
        });

    const expected = result.expect(['notFound']);

    if (expected.notFound) {
        const schema = NotFoundErrorSchema('billing');

        return {
            error: true,
            code: 'NOT_FOUND',
            details: {
                id: customer_id,
                type: 'billing',
            },
        } as typeof schema.static;
    }

    return {
        payment_terms: expected.ok!.payment_terms,
        credit_limit: expected.ok!.credit_limit,
        currency: expected.ok!.currency,
    };
};

const getCustomerInvoices = async (
    customer_id: string,
    financeroProvider: FinProvider,
) => {
    const result =
        await financeroProvider.getCustomerInvoices({
            customer_id,
        });

    const expected = result.expect(['notFound']);

    if (expected.notFound) {
        const schema = NotFoundErrorSchema('invoices');

        return {
            error: true,
            code: 'NOT_FOUND',
            details: {
                id: customer_id,
                type: 'invoices',
            },
        } as typeof schema.static;
    }

    return expected.ok!.invoices;
};

const getOrderDetails = async (
    order_id: string,
    oderinoProvider: OderProvider,
) => {
    const result = await oderinoProvider.getOrderDetails({
        order_id,
    });

    const expected = result.unwrap();

    return expected.ok;
};

const getOrderDeliveryDetails = async (
    order_id: string,
    oderinoProvider: OderProvider,
) => {
    const result =
        await oderinoProvider.getOrderDeliveryDetails({
            order_id,
        });

    const expected = result.expect(['notFound']);

    if (expected.notFound) {
        const schema = NotFoundErrorSchema('delivery');

        return {
            error: true,
            code: 'NOT_FOUND',
            details: {
                id: order_id,
                type: 'delivery',
            },
        } as typeof schema.static;
    }

    return {
        delivery_status: expected.ok!.delivery_status,
        delivery_date: expected.ok!.delivery_date,
        tracking_number: expected.ok!.tracking_number,
        carrier: expected.ok!.carrier,
    };
};

const getOrderJobs = async (
    order_id: string,
    oderinoProvider: OderProvider,
) => {
    const result = await oderinoProvider.getOrderJobs({
        order_id,
    });

    const expected = result.expect(['notFound']);

    if (expected.notFound) {
        const schema = NotFoundErrorSchema('jobs');

        return {
            error: true,
            code: 'NOT_FOUND',
            details: {
                id: order_id,
                type: 'jobs',
            },
        } as typeof schema.static;
    }

    return expected.ok!.jobs;
};

const getCustomerOrders = async (
    customer_id: string,
    oderinoProvider: OderProvider,
) => {
    const result = await oderinoProvider.getCustomerOrders({
        customer_id,
    });

    const expected = result.expect(['notFound']);

    if (expected.notFound) {
        const schema = NotFoundErrorSchema('orders');

        return {
            error: true,
            code: 'NOT_FOUND',
            details: {
                id: customer_id,
                type: 'orders',
            },
        } as typeof schema.static;
    }

    const orders = await Promise.all(
        expected.ok!.orders.map(async (order) => {
            const orderDetails = await getOrderDetails(
                order.order_id,
                oderinoProvider,
            );

            const orderDeliveryDetails =
                await getOrderDeliveryDetails(
                    order.order_id,
                    oderinoProvider,
                );

            const orderJobs = await getOrderJobs(
                order.order_id,
                oderinoProvider,
            );

            return {
                ...order,
                ...orderDetails,
                delivery: orderDeliveryDetails,
                jobs: orderJobs,
            };
        }),
    );

    return orders;
};

export const constructCustomerSummary = () => {
    const customerSummaryCache = new Map<
        string,
        typeof CustomerSummarySchema.static
    >();

    return async (
        customer_id: string,
        financeroProvider: FinProvider,
        oderinoProvider: OderProvider,
    ) => {
        const cacheKey = customer_id;
        const cached = customerSummaryCache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const customerAddress = await getCustomerAddress(
            customer_id,
            financeroProvider,
        );

        if (!customerAddress) {
            return null;
        }

        const customerBillingInfo =
            await getCustomerBillingInfo(
                customer_id,
                financeroProvider,
            );

        const customerInvoices = await getCustomerInvoices(
            customer_id,
            financeroProvider,
        );

        const customerOrders = await getCustomerOrders(
            customer_id,
            oderinoProvider,
        );

        const summary = {
            ...customerAddress,
            billing_info: customerBillingInfo,
            invoices: customerInvoices,
            orders: customerOrders,
        };

        customerSummaryCache.set(cacheKey, summary);
        return summary;
    };
};
