let Amadeus = require('amadeus');
let express = require('express');
var CheckbookAPI = require('checkbook-api');
let app = express();

let amadeus = new Amadeus({
  clientId: 'OCyWXGtFjvCyKcGzCDgO4As9ArPK0zfT',
  clientSecret: 'ly93zeHErfkWyjLe'
});

var Checkbook = new CheckbookAPI({
  api_key: 'b715050e714b45c0b6befcc570157d63',
  api_secret: 'TJM7WFVv8WasF6tAVJxnfNm7m1IcmR',
  //env: 'demo'
});

//Amadeus-----------------------

/*Data:
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
        {...}
      ]
*/
app.get('/', function() {
  return amadeus.client.get('/v1/shopping/flight-destinations', { origin: 'MAD' })
  .then(function(response){
    console.log(response.data/*[0].href*/);
  }).catch(function(responseError){
    console.log(responseError.code);
  });
});

//Checkbook---------------------

/*Data:
{'id': '65432178123456781234567812345678',
'date': '2014-01-02 13:14:15',
'number': '1002',
'description': 'January rent',
'status': 'IN_PROCESS',
'amount': 535.00,
'name': 'Widgets Inc.',
'image_uri': 'https://checkbook.io/bcd96495-1fe7-439f-965d-85f38c131b22.png',
'recipient': 'rent@example.com'
}
*/
Checkbook.checks.sendDigitalCheck({
  name: 'Widgets Inc.',
  recipient: 'widgets@example.com',
  description: 'Test Send Check',
  amount: 5.00
}, function (error, response) {
  if (error) {
      console.log('Error:', error);
  } else {
      console.log('Response:', response);
  }
});
