import express from 'express';
import { getFlights } from './flight';

const router = express.Router();

router.get('/flights', getFlights);

export { router };
