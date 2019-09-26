import { IFlight, generateFlightId } from '../models/Flight';
import FlightCacheProvider from '../providers/FlightCacheProvider';

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
