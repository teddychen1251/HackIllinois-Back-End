let Amadeus = require('amadeus');
let express = require('express');

let app = express();

let amadeus = new Amadeus({
  clientId: 'OCyWXGtFjvCyKcGzCDgO4As9ArPK0zfT',
  clientSecret: 'ly93zeHErfkWyjLe'
});

/*Example:
{
    "data": [
        {
            "type": "flight-destination",
            "origin": "BOS",
            "destination": "BUF",
            "departureDate": "2019-03-01",
            "returnDate": "2019-03-04",
            "price": {
                "total": "77.96"
            },
            "links": {
                "flightDates": "https://test.api.amadeus.com/v1/shopping/flight-dates?origin=BOS&destination=BUF&departureDate=2019-02-24,2019-08-22&oneWay=false&duration=1,15&nonStop=false&viewBy=DURATION",
                "flightOffers": "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=BOS&destination=BUF&departureDate=2019-03-01&returnDate=2019-03-04&adults=1&nonStop=false"
            }
        },
*/

app.get('/', function() {
  return amadeus.client.get('/v1/shopping/flight-destinations', { origin: 'MAD' })
  .then(function(response){
    console.log(response.data/*[0].href*/);
  }).catch(function(responseError){
    console.log(responseError.code);
  });
});
