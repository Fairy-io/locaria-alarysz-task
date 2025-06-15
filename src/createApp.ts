import { Elysia } from 'elysia';
import { onError } from './onError';
import {
    InfoController,
    SummaryController,
} from './controllers';
import { di } from './plugins/di';

export const createApp = () => {
    return new Elysia()
        .use(onError)
        .use(di())

        .use(InfoController)
        .use(SummaryController);
};
