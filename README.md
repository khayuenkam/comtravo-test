Comtravo Test
-------------

### Run local
1. `npm install`
2. `DISCOVERY_STUB_SERVICE_USERNAME=<INSERT_YOUR_USERNAME> DISCOVERY_STUB_SERVICE_PASSWORD=<INSERT_YOUR_PASSWORD> npm run dev`
3. `curl http://localhost:3000/api/v1/flights`

### Run tests
1. `npm install`
2. `npm test`

### Decision Made
Flights are cached in in-memory. In real world case, flights are rarely changed/cancelled. Therefore, I have
used Read-through strategy for caching since the service is focused on reading flights.

Secondly, if one of the endpoints is failing, the service will still return the successful endpoint's result. Only
two endpoints are failing, then we will return 500.

### Improvements
I think the crawler job can move away from this http service. So that the service is only focused on hitting cache/data store
for flights.