import NodeCache from 'node-cache';
import { of, from, Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import {
  getRxFirstSource,
  getRxSecondSource,
} from './gateways/discoveryStubGateway';
import { Flight } from './models/Flight';

export class FlightCacheProvider {
  private static instance: FlightCacheProvider;
  private cache: NodeCache;

  public constructor() {
    this.cache = new NodeCache();
  }

  static getInstance() {
    if (!FlightCacheProvider.instance) {
      FlightCacheProvider.instance = new FlightCacheProvider();
    }

    return FlightCacheProvider.instance;
  }

  public getFirstSourceFlights(): Observable<Flight> {
    const cache = this.cache;
    return of(cache.get('first-source')).pipe<Flight>(
      mergeMap(
        (data: any): Observable<Flight> => {
          console.log('first data', data)
          if (data !== undefined) {
            return from(data) as Observable<Flight>;
          }

          return getRxFirstSource().pipe(
            mergeMap(flights => {
              cache.set('first-source', flights, 1);
              return from(flights);
            }),
            catchError(err => {
              return throwError(err);
            }),
          );
        },
      ),
    );
  }

  public getSecondSourceFlights(): Observable<Flight> {
    const cache = this.cache;
    return of(cache.get('second-source')).pipe<Flight>(
      mergeMap(
        (data: any): Observable<Flight> => {
          if (data !== undefined) {
            return from(data) as Observable<Flight>;
          }

          return getRxSecondSource().pipe(
            mergeMap(flights => {
              cache.set('second-source', flights, 50);
              return from(flights);
            }),
            catchError(err => {

              return throwError(err);
            }),
          );
        },
      ),
    );
  }
}
