const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const request = require('request')
const Amadeus = require('amadeus')
const CheckbookAPI = require('checkbook-api');
let Checkbook = new CheckbookAPI({
  api_key: '0eb0c22842a0fcccef4b9d329d9c5d04',
  api_secret: '88b84e581bf2ab14551d1a5702df01dd',
  env: 'sandbox'
});

let token = ""

app.use(cors())
/*
Input
origin: city,
maxPrice: maxPrice,
viewBy(COUNTRY,DATE,DESTINATION,DURATION,WEEK): viewBy,

Output
{
    "data": [
        {
            "type": "flight-destination",
            "origin": "MAD",
            "destination": "LON",
            "departureDate": "2019-02-26",
            "returnDate": "2019-03-06",
            "price": {
                "total": "74.55"
            },
            "links": {
                "flightDates": "https://test.api.amadeus.com/v1/shopping/flight-dates?origin=MAD&destination=LON&departureDate=2019-02-25,2019-08-23&oneWay=false&duration=1,15&nonStop=false&viewBy=DURATION",
                "flightOffers": "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=MAD&destination=LON&departureDate=2019-02-26&returnDate=2019-03-06&adults=1&nonStop=false"
            }
        },
*/

app.get('/inspiration', (req, res) => {

  var apiToken = {
    method: 'POST',
    url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
    headers: {
      'Postman-Token': '66a369bc-da1c-4f68-a453-91b36f45d822',
      'cache-control': 'no-cache'
    },
    form: {
      client_id: 'OCyWXGtFjvCyKcGzCDgO4As9ArPK0zfT',
      client_secret: 'ly93zeHErfkWyjLe',
      grant_type: 'client_credentials'
    }
  };

  request(apiToken, function (error, response, body) {
    if (error) res.error(error);

    token = JSON.parse(body);
    token = token.token_type + " " + token.access_token;

    var citiesToCodes = {
      method: 'GET',
      url: 'https://test.api.amadeus.com/v1/reference-data/locations',
      qs: {
        subType: 'CITY',
        keyword: req.query.city
      },
      headers: {
        'Postman-Token': '00f8030d-fda7-45c4-9723-6f7a9114c2ca',
        'cache-control': 'no-cache',
        Authorization: token
      }
    };

    let cityCode = "";

    request(citiesToCodes, function (error, response, body) {
      if (error) res.error(error)
      cityCode = JSON.parse(body).data[0].iataCode
      var flightOptions = {
        method: 'GET',
        url: 'https://test.api.amadeus.com/v1/shopping/flight-destinations',
        qs: {
          origin: cityCode,
          maxPrice: req.query.maxPrice,
          currency: 'USD',
          viewBy: req.query.viewBy
        },
        headers: {
            'Postman-Token': 'a494f66e-d0b2-4824-af61-eeedd480d39e',
            'cache-control': 'no-cache',
            Authorization: token
        }
      };
      request(flightOptions, function (error, response, body) {
        if (error) res.error(error);
        res.json(JSON.parse(body));
      });
    });
  });
})

/*
Input
origin: city1,
destination: city2,
departureDate: departDate,
returnDate: returnDate,
maxPrice: maxPrice,
adults: adults,
children: children,
infants: infants,
seniors: seniors

Output
{
    "meta": {
        "links": {
        "self": "http://test.api.amadeus.com/v1/shopping/flight-offers?origin=NYC&destination=MAD&departureDate=2019-08-01&adults=1&nonStop=false&max=2"
        },
        "currency": "EUR",
        "defaults": {
            "nonStop": false,
            "adults": 1
        }
    },
    "data": [
        {
            "type": "flight-offer",
            "id": "1539956390004--540268760",
            "offerItems": [
                {
                    "services": [
                        {
                            "segments": [
                                {
                                    "flightSegment": {
                                        "departure": {
                                            "iataCode": "EWR",
                                            "terminal": "B",
                                            "at": "2019-08-01T17:45:00-04:00"
                                        },
                                        "arrival": {
                                            "iataCode": "LIS",
                                            "terminal": "1",
                                            "at": "2019-08-02T05:35:00+01:00"
                                        },
                                        "carrierCode": "TP",
                                        "number": "202",
                                        "aircraft": {
                                            "code": "332"
                                        },
                                        "operating": {
                                            "carrierCode": "TP",
                                            "number": "202"
                                        },
                                        "duration": "0DT6H50M"
                                    },
                                    "pricingDetailPerAdult": {
                                        "travelClass": "ECONOMY",
                                        "fareClass": "U",
                                        "availability": 1,
                                        "fareBasis": "UUSDSI0E"
                                    }
                                },
                                {
                                    "flightSegment": {
                                        "departure": {
                                            "iataCode": "LIS",
                                            "terminal": "1",
                                            "at": "2019-08-02T06:55:00+01:00"
                                        },
                                        "arrival": {
                                            "iataCode": "MAD",
                                            "terminal": "2",
                                            "at": "2019-08-02T09:10:00+02:00"
                                        },
                                        "carrierCode": "TP",
                                        "number": "1026",
                                        "aircraft": {
                                            "code": "319"
                                        },
                                        "operating": {
                                            "carrierCode": "TP",
                                            "number": "1026"
                                        },
                                        "duration": "0DT1H15M"
                                    },
                                    "pricingDetailPerAdult": {
                                        "travelClass": "ECONOMY",
                                        "fareClass": "U",
                                        "availability": 5,
                                        "fareBasis": "UUSDSI0E"
                                    }
                                }
                            ]
                        }
                    ],
                    "price": {
                        "total": "259.91",
                        "totalTaxes": "185.91"
                    },
                    "pricePerAdult": {
                        "total": "259.91",
                        "totalTaxes": "185.91"
                    }
                }
            ]
        },
        {
            "type": "flight-offer",
            "id": "1539956390004-765796655",
            "offerItems": [
                {
                    "services": [
                        {
                        "segments": [
                            {
                            "flightSegment": {
                                "departure": {
                                "iataCode": "JFK",
                                "at": "2019-08-01T22:05:00-04:00"
                                },
                                "arrival": {
                                "iataCode": "MAD",
                                "at": "2019-08-02T11:30:00+02:00",
                                "terminal": "1"
                                },
                                "carrierCode": "UX",
                                "number": "92",
                                "aircraft": {
                                "code": "332"
                                },
                                "operating": {
                                "carrierCode": "UX",
                                "number": "92"
                                },
                                "duration": "0DT7H25M"
                            },
                            "pricingDetailPerAdult": {
                                "travelClass": "ECONOMY",
                                "fareClass": "M",
                                "availability": 9,
                                "fareBasis": "MYYOAE"
                            }
                            }
                        ]
                        }
                    ],
                    "price": {
                        "total": "1670.89",
                        "totalTaxes": "162.89"
                    },
                    "pricePerAdult": {
                        "total": "1670.89",
                        "totalTaxes": "162.89"
                    }
                }
            ]
        }
    ],
    "dictionaries": {
        "locations": {
            "JFK": {
                "subType": "AIRPORT",
                "detailedName": "JOHN F KENNEDY INTL"
            },
            "EWR": {
                "subType": "AIRPORT",
                "detailedName": "NEWARK LIBERTY INTL"
            },
            "MAD": {
                "subType": "AIRPORT",
                "detailedName": "ADOLFO SUAREZ BARAJAS"
            },
            "LIS": {
                "subType": "AIRPORT",
                "detailedName": "AIRPORT"
            }
        },
        "carriers": {
            "UX": "AIR EUROPA",
            "TP": "TAP PORTUGAL"
        },
        "currencies": {
            "EUR": "EURO"
        },
        "aircraft": {
            "319": "AIRBUS INDUSTRIE A319",
            "332": "AIRBUS INDUSTRIE A330-200"
        }
    }
}
 */
app.get('/lowfare', (req, res) => {

  var apiToken = {
    method: 'POST',
    url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
    headers: {
      'Postman-Token': '66a369bc-da1c-4f68-a453-91b36f45d822',
      'cache-control': 'no-cache'
    },
    form: {
      client_id: 'OCyWXGtFjvCyKcGzCDgO4As9ArPK0zfT',
      client_secret: 'ly93zeHErfkWyjLe',
      grant_type: 'client_credentials'
    }
  };

  request(apiToken, function (error, response, body) {
    if (error) res.error(error);

    token = JSON.parse(body);
    token = token.token_type + " " + token.access_token;

    var firstCityToCode = {
      method: 'GET',
      url: 'https://test.api.amadeus.com/v1/reference-data/locations',
      qs: {
        subType: 'CITY',
        keyword: req.query.city1
      },
      headers: {
        'Postman-Token': '00f8030d-fda7-45c4-9723-6f7a9114c2ca',
        'cache-control': 'no-cache',
        Authorization: token
      }
    };

    var secondCityToCode = {
      method: 'GET',
      url: 'https://test.api.amadeus.com/v1/reference-data/locations',
      qs: {
        subType: 'CITY',
        keyword: req.query.city2
      },
      headers: {
        'Postman-Token': '00f8030d-fda7-45c4-9723-6f7a9114c2ca',
        'cache-control': 'no-cache',
        Authorization: token
      }
    };

    let cityCode1 = "";
    let cityCode2 = "";

    request(firstCityToCode, function (error, response, body) {
      if (error) res.error(error)
      cityCode1 = JSON.parse(body).data[0].iataCode
      request(secondCityToCode, function (error, response, body) {
        if (error) res.error(error)
        cityCode2 = JSON.parse(body).data[0].iataCode
        var flightOptions = {
          method: 'GET',
          url: 'https://test.api.amadeus.com/v1/shopping/flight-offers',
          qs: {
            origin: cityCode1,
            destination: cityCode2,
            departureDate: req.query.departDate,
            returnDate: req.query.returnDate,
            maxPrice: req.query.maxPrice,
            adults: req.query.adults,
            children: req.query.children,
            infants: req.query.infants,
            seniors: req.query.seniors,
            currency: 'USD'
          },
          headers: {
            'Postman-Token': 'cb3c132d-3dea-412b-8aa2-0cbe57e059df',
            'cache-control': 'no-cache',
            Authorization: token,
            Accept: 'application/vnd.amadeus+json'
          }
        };

        request(flightOptions, function (error, response, body) {
          if (error) res.error(error)
          console.log(cityCode1)
          console.log(cityCode2)
          res.json(JSON.parse(body))
        });
      });
    });
  });
})

app.get('/pay', (req, res) => {
  Checkbook.checks.sendDigitalCheck({
    name: req.query.name,
    recipient: req.query.recipient,
    description: req.query.description,
    amount: parseFloat(req.query.amount)
  }, function (error, response) {
    if (error) {
        console.log('Error:', error);
    } else {
        res.send(response)
    }
  });
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})
