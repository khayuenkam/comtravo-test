import { mocked } from 'ts-jest/utils';
import FlightCacheProvider from '../../../src/providers/FlightCacheProvider';
import {
  getFirstSourceFlights,
  getSecondSourceFlights,
} from '../../../src/gateways/discoveryStubGateway';
import { flightData1, flightData2 } from '../../seed/Flights';
import Config from '../../../src/providers/Config';

const mockGetCache = jest.fn();
const mockSetCache = jest.fn();

jest.mock('node-cache', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: mockGetCache,
      set: mockSetCache,
    };
  });
});
jest.mock('../../../src/gateways/discoveryStubGateway');

describe('providers/FlightCacheProvider', () => {
  beforeEach(() => {
    mocked(getFirstSourceFlights).mockReset();
    mocked(getSecondSourceFlights).mockReset();
  });

  const flightCacheProvider = new FlightCacheProvider(new Config());

  describe('#getFirstSourceFlights', () => {
    describe('Cache Miss', () => {
      beforeAll(() => {
        mockGetCache.mockImplementation(() => {
          return undefined;
        });
      });

      afterAll(() => {
        mockGetCache.mockReset();
        mockSetCache.mockReset();
      });

      test('get first source flights successfully ', async () => {
        mocked(getFirstSourceFlights).mockImplementation(() => {
          return Promise.resolve(flightData1);
        });

        const result = await flightCacheProvider.getFirstSourceFlights();
        expect(getFirstSourceFlights).toHaveBeenCalledTimes(1);
        expect(result).toEqual(flightData1);
      });

      test('return empty array if gateway failed', async () => {
        mocked(getFirstSourceFlights).mockImplementation(() => {
          throw new Error('no data');
        });
        const result = await flightCacheProvider.getFirstSourceFlights();
        expect(getFirstSourceFlights).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });

    describe('Cache Hit', () => {
      beforeAll(() => {
        mockGetCache.mockImplementation(() => {
          return flightData1;
        });
      });

      afterAll(() => {
        mockGetCache.mockReset();
        mockSetCache.mockReset();
      });

      test('return flights from cache', async () => {
        const result = await flightCacheProvider.getFirstSourceFlights();
        expect(getFirstSourceFlights).toHaveBeenCalledTimes(0);
        expect(mockGetCache).toHaveBeenCalledTimes(1);
        expect(result).toEqual(flightData1);
      });
    });
  });

  describe('#getSecondSourceFlights', () => {
    describe('Cache Miss', () => {
      beforeAll(() => {
        mockGetCache.mockImplementation(() => {
          return undefined;
        });
      });

      afterAll(() => {
        mockGetCache.mockReset();
        mockSetCache.mockReset();
      });

      test('get first source flights successfully ', async () => {
        mocked(getSecondSourceFlights).mockImplementation(() => {
          return Promise.resolve(flightData2);
        });

        const result = await flightCacheProvider.getSecondSourceFlights();
        expect(getSecondSourceFlights).toHaveBeenCalledTimes(1);
        expect(result).toEqual(flightData2);
      });

      test('return empty array if gateway failed', async () => {
        mocked(getSecondSourceFlights).mockImplementation(() => {
          throw new Error('no data');
        });
        const result = await flightCacheProvider.getSecondSourceFlights();
        expect(getSecondSourceFlights).toHaveBeenCalledTimes(1);
        expect(result).toEqual([]);
      });
    });

    describe('Cache Hit', () => {
      beforeAll(() => {
        mockGetCache.mockImplementation(() => {
          return flightData2;
        });
      });

      afterAll(() => {
        mockGetCache.mockReset();
        mockSetCache.mockReset();
      });

      test('return flights from cache', async () => {
        const result = await flightCacheProvider.getSecondSourceFlights();
        expect(getSecondSourceFlights).toHaveBeenCalledTimes(0);
        expect(mockGetCache).toHaveBeenCalledTimes(1);
        expect(result).toEqual(flightData2);
      });
    });
  });
});
