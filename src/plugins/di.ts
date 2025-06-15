import { Elysia } from 'elysia';
import { provide } from '../sdk/di';
import { ConfigProvider } from '../providers';

const configProvider = new ConfigProvider();

export const inject = provide({
    ConfigProvider: configProvider,
});

export const di = () =>
    new Elysia({ name: 'di' }).decorate('inject', inject);
