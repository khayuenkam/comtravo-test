import { Request, Response } from 'express';
import {} from 'rxjs';
import * as FlightService from '../services/flightService';
import { FlightCacheProvider } from '../FlightCacheProvider';

const cacheProvider = new FlightCacheProvider();
function getFlights(_: Request, res: Response): void {
  FlightService.getFlights(cacheProvider)
    .toPromise()
    .then(
      result => {
        res.send(result);
      },
      (err) => {
        console.log('Controller', err)
        res.sendStatus(500);
      },
    );
}

export { getFlights };
