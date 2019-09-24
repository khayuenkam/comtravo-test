import express from 'express';
import * as RouterV1 from './v1';

const router = express.Router();

router.use('/v1', RouterV1.router);

export { router };
