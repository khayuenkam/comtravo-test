import Router from 'express-promise-router';
import { getFlights } from '../../controllers/flightController';

const router = Router();

router.get('/flights', getFlights);

export { router };
