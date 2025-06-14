import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
} from 'bun:test';
import { createApp } from '../src/createApp';
import { CardsProviderMock } from './mocks/cards.provider';
import { createCard } from './helpers/createCard';

describe('GET /cards', () => {
    let app: ReturnType<typeof createApp>;
    let CardsProvider: CardsProviderMock;

    beforeAll(() => {
        CardsProvider = new CardsProviderMock();

        app = createApp({ CardsProvider });
    });

    afterEach(() => {
        CardsProvider.fetchAll.mockReset();
    });

    it('returns empty array', async () => {
        CardsProvider.fetchAll.mockReturnValue([]);

        const { response, status } = await app
            .handle(
                new Request('http://localhost/cards', {
                    method: 'get',
                }),
            )
            .then(async (res) => ({
                response: await res.json(),
                status: res.status,
            }));

        expect(response).toEqual([]);
        expect(status).toBe(200);

        expect(CardsProvider.fetchAll).toHaveBeenCalled();
    });

    it('returns cards', async () => {
        const cards = [
            {
                id: '123',
                name: 'Name',
                power: 5,
                description: 'Description',
                created_at: '2024-12-28T10:59:23.489Z',
                updated_at: '2024-12-28T10:59:23.489Z',
            },
            {
                id: '456',
                name: 'Name2',
                power: 10,
                created_at: '2024-12-28T10:59:23.489Z',
                updated_at: '2024-12-28T10:59:23.489Z',
            },
        ];

        CardsProvider.fetchAll.mockReturnValue(
            Promise.all(cards.map(createCard)),
        );

        const { response, status } = await app
            .handle(
                new Request('http://localhost/cards', {
                    method: 'get',
                }),
            )
            .then(async (res) => ({
                response: await res.json(),
                status: res.status,
            }));

        expect(response).toEqual(cards);
        expect(status).toBe(200);

        expect(CardsProvider.fetchAll).toHaveBeenCalled();
    });
});
