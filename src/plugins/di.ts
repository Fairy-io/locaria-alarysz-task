import { Elysia } from 'elysia';
import { provide } from '../sdk/di';
import { ConfigProvider } from '../providers';

export const inject = provide({
    ConfigProvider: new ConfigProvider(),
});

export const di = () =>
    new Elysia({ name: 'di' }).decorate('inject', inject);
