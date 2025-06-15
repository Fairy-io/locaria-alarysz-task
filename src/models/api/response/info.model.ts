import { t } from 'elysia';

export const InfoSchema = t.Object({
    serviceName: t.String(),
    serviceVersion: t.String(),
    serviceDescription: t.String(),
    environment: t.String(),
});
