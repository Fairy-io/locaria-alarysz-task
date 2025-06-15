import { Elysia } from 'elysia';
import { onError } from './onError';
import {
    InfoController,
    SummaryController,
} from './controllers';
import { di, createInject } from './plugins/di';

export const createApp = (
    inject: ReturnType<typeof createInject>,
) => {
    return new Elysia()
        .use(onError)
        .use(di(inject))

        .use(InfoController)
        .use(SummaryController);
};
