const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const request = require('request')
const Amadeus = require('amadeus')

let token = ""

app.use(cors())

// Input (String city name)
// Output 
/*
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

// Input (two cities, one departure date YYYY-MM-DD)
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})