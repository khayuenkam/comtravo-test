import { Observable, merge } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Flight } from '../models/Flight';
import { FlightCacheProvider } from '../FlightCacheProvider';

function getFlights(cacheProvider: FlightCacheProvider): Observable<any> {
  return merge(
    cacheProvider.getFirstSourceFlights(),
    cacheProvider.getSecondSourceFlights(),
  ).pipe(
    scan(
      (acc, flight) => {
        const flightKey = generateFlightId(flight);
        acc[flightKey] = flight;
        return acc;
      },
      {} as any,
    ),
  );
}

/**
 *
 * @param flight
 */
function generateFlightId(flight: Flight): string {
  return flight.slices.reduce((acc, slice, index) => {
    const sliceKey = `${slice.flight_number}:${slice.departure_date_time_utc}`;
    return index === 0 ? sliceKey : `${acc}_${sliceKey}`;
  }, '');
}

export { getFlights };
