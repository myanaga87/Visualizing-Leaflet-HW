// looking at all earthquakes in the past day
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// perform a GET request for the plates data
d3.json(plateURL, function(error, plateData) {
    if(error) console.warn(error);
    // send to createFeatures function
    createFeatures(plateData.features)});


function createFeatures(platesData) { 

  // create the first GeoJSON layer
  var plates = L.geoJSON(platesData, {
    geometryToLayer: function(feature, coordinates) {
        return new L.polyline(coordinates, {
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        })}
    });
  // send the earthquakes and plates layers to the createMap function
  createMap(plates);
};

function createMap(plates) {
  // define map layers
  var map1 = L.tileLayer("https://api.mapbox.com/styles/v1/myanaga87/cjhj7jihp0unp2ss5caaby7xv/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXlhbmFnYTg3IiwiYSI6ImNqaDllNDQ5dTBjMWMzMGxqazAweTdrd3EifQ.vMp4cvHR2uPa3oydja65bg"
  );

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXlhbmFnYTg3IiwiYSI6ImNqaDllNDQ5dTBjMWMzMGxqazAweTdrd3EifQ.vMp4cvHR2uPa3oydja65bg"
  );

  // define a baseMaps object to hold the base layers
  var baseMaps = {
    "Map": map1,
    "Dark Map": darkmap
  };

  // create overlay object to hold the overlay layers
  var overlayMaps = {
    Plates: plates,
  };


  // create the map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [map1, plates]
  });

  // add the legend 
  var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    levels = [0, 1, 2, 3, 4, 5],
    labels = [];

    function getColor(d) {
        return d > 5 ? "#a50f15" :
               d > 4  ? "#de2d26" :
               d > 3  ? "#fb6a4a" :
               d > 2  ? "#fc9272" :
               d > 1   ? "#fcbba1" :
                          "#fee5d9";
    }

    // loop through levels and generate a label with a colored square for each interval
    for (var i = 0; i < levels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(levels[i] + 1) + '"></i> ' +
            levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
}

    return div;
};
  legend.addTo(myMap);

  // create a layer control and add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}