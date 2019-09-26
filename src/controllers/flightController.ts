import { Request, Response, NextFunction } from 'express';
import * as FlightService from '../services/flightService';
import FlightCacheProvider from '../providers/FlightCacheProvider';
import Config from '../providers/Config';
import { NoFlightsError } from '../errors/NoFlightsError';

function getFlights(_: Request, res: Response, next: NextFunction): void {
  const config = Config.getInstance();
  const cacheProvider = FlightCacheProvider.getInstance(config);

  FlightService.getFlights(cacheProvider).then(
    result => {
      if (result.length > 0) {
        res.json(result);
      } else {
        const error = new NoFlightsError('No flights');
        next(error);
      }
    },
    err => next(err),
  );
}

export { getFlights };
