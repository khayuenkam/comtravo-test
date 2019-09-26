import { Request, Response, NextFunction } from 'express';
import * as FlightService from '../services/flightService';
import FlightCacheProvider from '../providers/FlightCacheProvider';
import Config from '../providers/Config';
import CustomError from '../errors/CustomError';

async function getFlights(
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const config = Config.getInstance();
  const cacheProvider = FlightCacheProvider.getInstance(config);

  const result = await FlightService.getFlights(cacheProvider);
  if (result.length > 0) {
    res.json(result);
  } else {
    next(new CustomError('No flights', 500));
  }
}

export { getFlights };
