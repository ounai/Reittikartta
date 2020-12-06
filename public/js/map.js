const defaultCoordinates = [ 60.192, 24.94 ];
const defaultZoom = 12;

const modeColors = {
  'BUS': '#007AC9',
  'RAIL': '#8C4799',
  'SUBWAY': '#FF6319',
  'TRAM': '#00985F',
  'FERRY': '#00B9E4'
};

let layerGroups = {};

function initLeaflet() {
  $('#map').css({
    height: window.innerHeight
  });

  map = L.map('map');

  // OSM Layer
  let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let osmAttribution = 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  let osmLayer = new L.TileLayer(osmUrl, {
    maxZoom: 19,
    attribution: osmAttribution
  });

  // Mapbox layers
  let mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  let mapboxAttribution = osmAttribution + ', Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>';

  // Mapbox streets
  let streetsLayer = new L.TileLayer(mapboxUrl, {
    attribution: mapboxAttribution,
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoib3VuYWkiLCJhIjoiY2pydWczb3Y4MTJrYjQ1bXNjb2pyMzE0ZSJ9.brIw7U0LhvkcsBKD8QHIXw'
  });

  map.setView(defaultCoordinates, defaultZoom);
  map.addLayer(streetsLayer);

  layerGroups['BUS'] = new L.LayerGroup();
  layerGroups['RAIL'] = new L.LayerGroup();
  layerGroups['SUBWAY'] = new L.LayerGroup();
  layerGroups['TRAM'] = new L.LayerGroup();
  layerGroups['FERRY'] = new L.LayerGroup();

  for(let mode in layerGroups) {
    layerGroups[mode].addTo(map);
  }

  L.control.layers({
    'OpenStreetMap': osmLayer,
    'Mapbox Streets': streetsLayer
  }, {
    'Bussit': layerGroups['BUS'],
    'Metrot': layerGroups['SUBWAY'],
    'Raitiovaunut': layerGroups['TRAM'],
    'Lähijunat': layerGroups['RAIL'],
    'Lautat': layerGroups['FERRY']
  }).addTo(map);
}

function getLongestPattern(patterns) {
  let longestPattern, longestPatternLength = 0;

  patterns.forEach(pattern => {
    if(!pattern || !pattern.geometry) return;

    if(pattern.geometry.length > longestPatternLength) {
      longestPattern = pattern;
      longestPatternLength = pattern.geometry.length;
    }
  });

  return longestPattern;
}

function onPolylineClick(e) {
  // TODO
  console.log(e);
}

function addRoute(route) {
  let pattern = getLongestPattern(route.patterns);

  if(!pattern) return;

  let polylineClickable = {
    weight: 20,
    opacity: 0,
    color: '#FFFFFF',
    interactive: true
  }

  let polylineBack = {
    weight: 6,
    opacity: 1,
    color: '#FFFFFF',
    interactive: false
  }

  let polylineBackHighlighted = {
    weight: 6,
    opacity: 1,
    color: '#FF0000',
    interactive: false
  }

  let polylineFront = {
    weight: 4,
    opacity: 1,
    color: modeColors[route.mode],
    interactive: false
  }

  let polylineArr = [];

  pattern.geometry.forEach(latLng => {
    polylineArr.push(L.latLng(latLng.lat, latLng.lon));
  });

  let polylineClickableObj = L.polyline(polylineArr, polylineClickable);
  polylineClickableObj.addTo(layerGroups[route.mode]);
  polylineClickableObj.on('click', onPolylineClick);

  L.polyline(polylineArr, polylineBack).addTo(layerGroups[route.mode]);

  L.polyline(polylineArr, polylineFront).addTo(layerGroups[route.mode]);
}

function getRoutes() {
  fetch('/api/getRoutes')
    .then(response => response.json())
    .then(routes => {
      let once = false;

      for(let gtfsId in routes) {
        let route = routes[gtfsId];

        addRoute(route);
      }
  });
}

$(() => {
  initLeaflet();
  getRoutes();
});

