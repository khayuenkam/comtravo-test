import axios from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Flight } from '../models/Flight';

const FIRST_SOURCE_URL = 'https://discovery-stub.comtravo.com/source1';
const SECOND_SOURCE_URL = 'https://discovery-stub.comtravo.com/source2';

function getRxFirstSource(): Observable<Flight[]> {
  return from(axios.get(FIRST_SOURCE_URL)).pipe(
    map(response => response.data),
    map(data => data.flights),
    catchError(error => {
      console.log('Failed to request first source: ', error.message);
      return throwError(error);
    }),
  );
}

function getRxSecondSource(): Observable<Flight[]> {
  return from(
    axios.get(SECOND_SOURCE_URL, {
      auth: {
        username: 'ct_interviewee',
        password: 'supersecret',
      },
    }),
  ).pipe(
    map(response => response.data),
    map(data => data.flights),
    catchError(error => {
      console.log('Failed to request second source: ', error.message);
      return throwError(error);
    }),
  );
}

export { getRxFirstSource, getRxSecondSource };
