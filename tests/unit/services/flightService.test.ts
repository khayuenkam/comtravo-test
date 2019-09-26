import { mocked } from 'ts-jest/utils';
import {
  getUniqueFlights,
  getFlights,
} from '../../../src/services/flightService';
import FlightCacheProvider from '../../../src/providers/FlightCacheProvider';
import { flightData1, flightData2 } from '../../seed/Flights';
import { generateFlightId } from '../../../src/models/Flight';
import Config from '../../../src/providers/Config';

const mockGetFirstSourceFlights = jest.fn();
const mockGetSecondSourceFlights = jest.fn();

jest.mock('../../../src/providers/FlightCacheProvider', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getFirstSourceFlights: mockGetFirstSourceFlights,
      getSecondSourceFlights: mockGetSecondSourceFlights,
    };
  });
});

describe('services/flightService', () => {
  describe('#getUniqueFlights', () => {
    test('generate unique flights', () => {
      const combineFlights = flightData1.concat(flightData2);
      const uniqueFlightIds = combineFlights.reduce((acc, flight) => {
        return acc.add(generateFlightId(flight));
      }, new Set());

      const uniqueFlights = getUniqueFlights(combineFlights);

      expect(Object.keys(uniqueFlights).length).toBeLessThanOrEqual(
        combineFlights.length,
      );
      expect(Object.keys(uniqueFlights).sort()).toEqual(
        Array.from(uniqueFlightIds).sort(),
      );
    });
  });

  describe('#getFlights', () => {
    beforeEach(() => {
      mockGetFirstSourceFlights.mockReset();
      mockGetSecondSourceFlights.mockReset();
      mocked(FlightCacheProvider).mockClear();
    });

    test('get flights successfully if two sources return data', async () => {
      mockGetFirstSourceFlights.mockImplementation(() => {
        return flightData1;
      });
      mockGetSecondSourceFlights.mockImplementation(() => {
        return flightData2;
      });

      const results = await getFlights(new FlightCacheProvider(new Config()));
      expect(FlightCacheProvider).toHaveBeenCalledTimes(1);
      expect(mockGetFirstSourceFlights).toHaveBeenCalledTimes(1);
      expect(mockGetSecondSourceFlights).toHaveBeenCalledTimes(1);

      const combineFlights = flightData1.concat(flightData2);
      const uniqueFlights = getUniqueFlights(combineFlights);

      expect(results.length).toEqual(Object.keys(uniqueFlights).length);
    });

    test('get flights successfully if only one source return flight data', async () => {
      mockGetFirstSourceFlights.mockImplementation(() => {
        return flightData1;
      });
      mockGetSecondSourceFlights.mockImplementation(() => {
        return [];
      });

      const results = await getFlights(new FlightCacheProvider(new Config()));
      expect(FlightCacheProvider).toHaveBeenCalledTimes(1);
      expect(mockGetFirstSourceFlights).toHaveBeenCalledTimes(1);
      expect(mockGetSecondSourceFlights).toHaveBeenCalledTimes(1);

      const uniqueFlights = getUniqueFlights(flightData1);
      expect(results.length).toEqual(Object.keys(uniqueFlights).length);
    });
  });
});
