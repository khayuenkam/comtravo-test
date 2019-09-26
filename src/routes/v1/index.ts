import express from 'express';
import { getFlights } from '../../controllers/flightController';

const router = express.Router();

router.get('/flights', getFlights);

export { router };
