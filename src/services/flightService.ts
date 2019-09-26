import { IFlight, generateFlightId } from '../models/Flight';
import FlightCacheProvider from '../providers/FlightCacheProvider';

/**
 * Request 2 data sourcess data from cache provider and return unique flights
 *
 * @param {FlightCacheProvider} cacheProvider - Flight cache provider
 * @returns {IFlight[]} - Unique flights
 */
async function getFlights(
  cacheProvider: FlightCacheProvider,
): Promise<IFlight[]> {
  const flights = await Promise.all([
    cacheProvider.getFirstSourceFlights(),
    cacheProvider.getSecondSourceFlights(),
  ]);
  const flattenFlights = flights.reduce((a, b) => a.concat(b), []);
  const uniqueFlights = getUniqueFlights(flattenFlights);

  return Object.values(uniqueFlights);
}

/**
 * Remove duplicated flights by unique flight id
 *
 * @param {IFlight[]} flights - Flights
 * @returns {Record<string, IFlight>} - Object that contains flight id as key and flight as value
 */
function getUniqueFlights(flights: IFlight[]): Record<string, IFlight> {
  return flights.reduce(
    (acc, flight) => {
      const flightKey = generateFlightId(flight);
      acc[flightKey] = flight;

      return acc;
    },
    {} as Record<string, IFlight>,
  );
}

export { getFlights, getUniqueFlights };
