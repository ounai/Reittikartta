const defaultCoordinates = [ 60.192, 24.94 ];
const defaultZoom = 12;

let metroLayerGroup, tramLayerGroup, busLayerGroup, railLayerGroup, ferryLayerGroup;

$(() => {
  $('#map').css({
    height: window.innerHeight
  });

  map = L.map('map');

  // OSM Layer
  let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let osmAttribution = 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  let osmLayer = new L.TileLayer(osmUrl, {
    maxZoom: 20,
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

  metroLayerGroup = new L.LayerGroup();
  tramLayerGroup = new L.LayerGroup();
  busLayerGroup = new L.LayerGroup();
  railLayerGroup = new L.LayerGroup();
  ferryLayerGroup = new L.LayerGroup();

  metroLayerGroup.addTo(map);
  tramLayerGroup.addTo(map);
  busLayerGroup.addTo(map);
  railLayerGroup.addTo(map);
  ferryLayerGroup.addTo(map);

  L.control.layers({
    'OpenStreetMap': osmLayer,
    'Mapbox Streets': streetsLayer
  }, {
    'Bussit': busLayerGroup,
    'Metrot': metroLayerGroup,
    'Raitiovaunut': tramLayerGroup,
    'Lähijunat': railLayerGroup,
    'Lautat': ferryLayerGroup
  }).addTo(map);
});

