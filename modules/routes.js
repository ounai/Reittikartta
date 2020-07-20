const request = require('request');
const fs = require('fs');

const DIGITRANSIT_API_URL = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

let routes = {};

function queryDigitransitAPI(query, callback) {
  request.post({
    url: DIGITRANSIT_API_URL,
    headers: {
      'Content-Type': 'application/graphql'
    },
    body: query
  }, (err, response, body) => {
    if(err) return callback(err, body);

    callback(null, body);
  });
}

function getRouteList(callback) {
  const query = `
    {
      routes {
        gtfsId
        shortName
        longName
      }
    }
  `;

  queryDigitransitAPI(query, (err, routeList) => {
    if(err) return callback(err);

    callback(null, JSON.parse(routeList).data.routes);
  });
}

function getRouteData(gtfsId, callback) {
  const query = `
    {
      routes(ids: "${gtfsId}") {
        gtfsId
        mode
        shortName
        longName
        patterns {
          directionId
          geometry {
            lat
            lon
          }
        }
      }
    }  
  `;

  queryDigitransitAPI(query, (err, routeData) => {
    if(err) return callback(err);
    
    callback(null, JSON.parse(routeData).data.routes[0]);
  });
}

function saveRoutesToDisk() {
  const dataToSave = {
    timestamp: (new Date()).getTime(),
    routes: JSON.stringify(routes)
  };

  fs.writeFile('./routes.json', JSON.stringify(dataToSave), 'utf8', err => {
    if(err) throw err;

    console.log('Route data successfully saved to disk!');
  });
}

module.exports.updateRoutes = () => {
  console.log('Updating routes...');

  routes = [];

  if(fs.existsSync('./routes.json')) {
    fs.readFile('./routes.json', 'utf8', (err, data) => {
      if(err) throw err;

      data = JSON.parse(data);

      const currentTimestamp = (new Date()).getTime(),
              fileTimestamp = data.timestamp,
              timeElapsed = currentTimestamp - fileTimestamp;

      console.log(fileTimestamp + ' vs ' + data.timestamp + ', difference ' + timeElapsed);

      if(timeElapsed < 12 * 60 * 60 * 1000) {
        console.log('Using cached route data');

        routes = JSON.parse(data.routes);
      } else {
        console.log('Cached route data too old, updating via Digitransit API');
      }
    });
  }

  if(routes === []) {
    getRouteList((err, routeList) => {
      if(err) throw err;
      
      routeList.forEach(route => {
        getRouteData(route.gtfsId, (err, routeData) => {
          if(err) throw err;

          routes[route.gtfsId] = routeData;

          console.log(Object.keys(routes).length + ' / ' + routeList.length);
          console.log(routeData);
          console.log();

          if(Object.keys(routes).length === routeList.length) {
            // All routes complete
            saveRoutesToDisk();
          }
        });
      });
    });
  }
};

module.exports.getRoutes = () => {
  return routes;
};

