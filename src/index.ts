import swagger from '@elysiajs/swagger';
import { createApp } from './createApp';
import { ConfigProvider } from './providers';
import { createInject } from './plugins/di';

const configProvider = new ConfigProvider();
const {
    SERVICE_NAME,
    SERVICE_DESCRIPTION,
    SERVICE_VERSION,
    PORT,
} = await configProvider.getConfig();

const app = createApp(createInject());

app.use(
    swagger({
        documentation: {
            info: {
                title: SERVICE_NAME,
                version: SERVICE_VERSION,
                description: SERVICE_DESCRIPTION,
            },
            components: {
                securitySchemes: {},
            },
        },
        path: '/docs',
    }),
).listen(PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
