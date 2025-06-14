import { t } from 'elysia';

export const NotFoundErrorSchema = <T extends string>(
    type: T,
) =>
    t.Object({
        error: t.Literal(true),
        code: t.Literal('NOT_FOUND', {
            examples: ['NOT_FOUND'],
        }),
        details: t.Object({
            id: t.String(),
            type: t.Literal(type, { examples: [type] }),
        }),
    });

export const InvalidPayloadSchema = t.Object({
    error: t.Literal(true),
    code: t.Literal('INVALID_PAYLOAD', {
        examples: ['INVALID_PAYLOAD'],
    }),
    details: t.Object({
        fields: t.Array(
            t.Object({
                name: t.String(),
                code: t.Union([
                    t.Literal('NOT_PROVIDED'),
                    t.Literal('INVALID_STRING'),
                    t.Literal('INVALID_NUMBER'),
                ]),
            }),
            {
                examples: [
                    [
                        {
                            name: 'name',
                            code: 'NOT_PROVIDED',
                        },
                        {
                            name: 'name',
                            code: 'INVALID_STRING',
                        },
                        {
                            name: 'power',
                            code: 'NOT_PROVIDED',
                        },
                        {
                            name: 'power',
                            code: 'INVALID_NUMBER',
                        },
                    ],
                ],
            },
        ),
    }),
});

export const UnauthorizedSchema = t.Object({
    error: t.Literal(true),
    code: t.Literal('INSUFFICIENT_PRIVILEGES', {
        examples: ['INSUFFICIENT_PRIVILEGES'],
    }),
});

export type InvalidPayload =
    typeof InvalidPayloadSchema.static;

export type InvalidPayloadFieldCode =
    InvalidPayload['details']['fields'][number]['code'];

export type Unauthorized = typeof UnauthorizedSchema.static;
