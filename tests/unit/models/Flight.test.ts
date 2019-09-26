import { generateFlightId } from '../../../src/models/Flight';

const flight = {
  slices: [
    {
      origin_name: 'Schonefeld',
      destination_name: 'Stansted',
      departure_date_time_utc: '2019-08-08T04:30:00.000Z',
      arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
      flight_number: '144',
      duration: 115,
    },
    {
      origin_name: 'Stansted',
      destination_name: 'Schonefeld',
      departure_date_time_utc: '2019-08-10T06:50:00.000Z',
      arrival_date_time_utc: '2019-08-10T08:40:00.000Z',
      flight_number: '145',
      duration: 110,
    },
  ],
  price: 129,
};

describe('models/flight', () => {
  describe('#generateFlightId', () => {
    test('generate flight id successfully', () => {
      const flightId = generateFlightId(flight);
      expect(flightId).toBe(
        '144:2019-08-08T04:30:00.000Z:2019-08-08T06:25:00.000Z_145:2019-08-10T06:50:00.000Z:2019-08-10T08:40:00.000Z',
      );
    });
  });
});
