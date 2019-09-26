import NodeCache from 'node-cache';
import * as DiscoveryStubGateway from '../gateways/discoveryStubGateway';
import { IFlight } from '../models/Flight';
import Config from './Config';

/**
 *  Singleton object for FlightCacheProvider. This is implemented using Read-through
 *  cache strategy. If cache is missed, will request gateway to fetch data. There is also
 *  retry strategy when requesting gateway.
 */
export default class FlightCacheProvider {
  private static instance: FlightCacheProvider;
  private cache: NodeCache;
  private FIRST_SOURCE_KEY: string = 'first-source';
  private SECOND_SOURCE_KEY: string = 'second-source';
  private config: Config;

  public constructor(config: Config) {
    this.cache = new NodeCache();
    this.config = config;
  }

  public static getInstance(config: Config) {
    if (!FlightCacheProvider.instance) {
      FlightCacheProvider.instance = new FlightCacheProvider(config);
    }

    return FlightCacheProvider.instance;
  }

  public async getFirstSourceFlights(): Promise<IFlight[]> {
    const cache = this.cache;
    const key = this.FIRST_SOURCE_KEY;
    const { cacheTtl } = this.config.getConfig();

    const data = cache.get<IFlight[]>(key);

    if (data) {
      console.log('Hit cache')
      return data;
    }

    try {
      const flights = await DiscoveryStubGateway.getFirstSourceFlights();
      cache.set(key, flights, cacheTtl);
      return flights;
    } catch {
      return [];
    }
  }

  public async getSecondSourceFlights(): Promise<IFlight[]> {
    const cache = this.cache;
    const key = this.SECOND_SOURCE_KEY;
    const { cacheTtl } = this.config.getConfig();

    const data = cache.get<IFlight[]>(key);

    if (data) {
      console.log('Hit cache')
      return data;
    }

    try {
      const flights = await DiscoveryStubGateway.getSecondSourceFlights();
      cache.set(key, flights, cacheTtl);
      return flights;
    } catch {
      return [];
    }
  }
}
