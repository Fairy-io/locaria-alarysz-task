import Elysia from 'elysia';
import { ElysiaCommon } from '../common';

export const ApiController = new Elysia({
    prefix: '/api',
}).use(ElysiaCommon);
