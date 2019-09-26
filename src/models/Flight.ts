interface ISlice {
  origin_name: string;
  destination_name: string;
  departure_date_time_utc: string;
  arrival_date_time_utc: string;
  flight_number: string;
  duration: number;
}

interface IFlight {
  slices: ISlice[];
  price: number;
}

/**
 * Generate Flight ID based on flight number and dates by iterating slices
 *
 * @param {IFlight} flight - Flight
 * @returns {string} - Flight ID
 */
function generateFlightId(flight: IFlight): string {
  return flight.slices.reduce((acc, slice, index) => {
    const sliceKey = `${slice.flight_number}:${slice.departure_date_time_utc}:${slice.arrival_date_time_utc}`;
    return index === 0 ? sliceKey : `${acc}_${sliceKey}`;
  }, '');
}

export { IFlight, ISlice, generateFlightId };
