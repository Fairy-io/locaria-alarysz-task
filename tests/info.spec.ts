import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
} from 'bun:test';
import { createApp } from '../src/createApp';
import { ConfigProvider } from '../src/providers';
import { createInject } from '../src/plugins/di';
import { Mocked } from '../src/sdk/di';
import { vi } from 'vitest';

describe('GET /info', () => {
    let app: ReturnType<typeof createApp>;
    let configProvider: Mocked<ConfigProvider>;

    beforeAll(() => {
        const inject = createInject();

        configProvider = inject('ConfigProvider', vi.fn);

        app = createApp(inject);
    });

    afterEach(() => {
        configProvider.getConfig.mockReset();
    });

    it('returns environment variable', async () => {
        configProvider.getConfig.mockResolvedValue({
            PORT: 0,
            SERVICE_NAME: 'Test service',
            SERVICE_VERSION: '1.0.0',
            SERVICE_DESCRIPTION: 'Test description',
            SERVICE_ENV: 'test',
        });

        const { response, status } = await app
            .handle(
                new Request('http://localhost/info', {
                    method: 'get',
                }),
            )
            .then(async (res) => ({
                response: await res.json(),
                status: res.status,
            }));

        expect(response).toEqual({
            serviceName: 'Test service',
            serviceVersion: '1.0.0',
            serviceDescription: 'Test description',
            environment: 'test',
        });

        expect(status).toBe(200);

        expect(configProvider.getConfig).toHaveBeenCalled();
    });
});
