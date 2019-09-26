const request = require('supertest');
import { mocked } from 'ts-jest/utils';
import { app, server } from '../../../src/server';
import {
  getFirstSourceFlights,
  getSecondSourceFlights,
} from '../../../src/gateways/discoveryStubGateway';
import { flightData1, flightData2 } from '../../seed/Flights';
import { getUniqueFlights } from '../../../src/services/flightService';

jest.mock('../../../src/gateways/discoveryStubGateway');
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

describe('components/v1/flights', () => {
  beforeEach(() => {
    mockGetCache.mockReset();
    mockSetCache.mockReset();
    mocked(getFirstSourceFlights).mockReset();
    mocked(getSecondSourceFlights).mockReset();
  });

  afterEach(() => {
    server.close();
  });

  test('fetch flights successfully if 2 source gateways return flight result', async () => {
    mocked(getFirstSourceFlights).mockImplementation(() => {
      return Promise.resolve(flightData1);
    });

    mocked(getSecondSourceFlights).mockImplementation(() => {
      return Promise.resolve(flightData2);
    });

    const combineFlights = flightData1.concat(flightData2);
    const uniqueFlights = getUniqueFlights(combineFlights);
    const result = await request(app)
      .get('/api/v1/flights')
      .set('Accept', 'application/json');

    expect(result.status).toBe(200);
    expect(result.length).toBe(uniqueFlights.length);
  });

  test('fetch flights successfully if one source gateways return flight result', async () => {
    mocked(getFirstSourceFlights).mockImplementation(() => {
      return Promise.resolve(flightData1);
    });

    mocked(getSecondSourceFlights).mockImplementation(() => {
      throw new Error('no data');
    });

    const uniqueFlights = getUniqueFlights(flightData1);
    const result = await request(app)
      .get('/api/v1/flights')
      .set('Accept', 'application/json');

    expect(result.status).toBe(200);
    expect(result.length).toBe(uniqueFlights.length);
  });

  test('return 500 if all data source gateway failed', async () => {
    mocked(getFirstSourceFlights).mockImplementation(() => {
      throw new Error('no data');
    });

    mocked(getSecondSourceFlights).mockImplementation(() => {
      throw new Error('no data');
    });

    const result = await request(app)
      .get('/api/v1/flights')
      .set('Accept', 'application/json');

    expect(result.status).toBe(500);
  });
});
