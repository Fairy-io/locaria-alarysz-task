import { Elysia } from 'elysia';
import { provide } from '../sdk/di';
import {
    ConfigProvider,
    FinanceroProvider,
    OderinoProvider,
} from '../providers';

export const createInject = () => {
    const configProvider = new ConfigProvider();

    const financeroProvider = FinanceroProvider(
        'https://locaria-alarysz-fin-dev.magicfe.net',
    );

    const oderinoProvider = OderinoProvider(
        'https://locaria-alarysz-ode-dev.magicfe.net',
    );

    return provide({
        ConfigProvider: configProvider,
        FinanceroProvider: financeroProvider,
        OderinoProvider: oderinoProvider,
    });
};

export const di = (
    inject: ReturnType<typeof createInject>,
) => {
    return new Elysia({ name: 'di' }).decorate(
        'inject',
        inject,
    );
};
