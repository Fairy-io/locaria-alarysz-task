import { Elysia } from 'elysia';
import { onError } from './onError';
import { InfoController } from './controllers';
import { di } from './plugins/di';

export const createApp = () => {
    return new Elysia()
        .use(onError)
        .use(di())

        .use(InfoController);
};
