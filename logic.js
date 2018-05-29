// looking at all earthquakes in the past day
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var plateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

var earthquakes = [];
var plates = [];

// perform a GET request to the query URL
d3.json(url, function(error, quakeData) {
    if(error) console.warn(error);
    // console.log(quakeData.features);
    // send to createFeatures function
    var earthquakeData = (quakeData.features);
  

// create the first GeoJSON layer
earthquakes.push(L.geoJSON(earthquakeData, {
   
  // create the markers based on earthquake magnitude and set their colors
    pointToLayer: function(feature, latlng) {

        var customColor = "#fee5d9";
        if (feature.properties.mag >1 && feature.properties.mag <2)
        customColor = "#fcbba1";
        else if (feature.properties.mag >2 && feature.properties.mag <3)
        customColor = "#fc9272";
        else if (feature.properties.mag >3 && feature.properties.mag <4)
        customColor = "#fb6a4a";
        else if(feature.properties.mag >4 && feature.properties.mag <5)
        customColor = "#de2d26";
        else if (feature.properties.mag >5)
        customColor = "#a50f15";
        else
        customColor = customColor;

        return new L.CircleMarker(latlng, {radius: feature.properties.mag * 5, fillOpacity: .75, color: customColor});
    },
  // add the popup
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p align=center>" + feature.properties.mag + " magnitude" + "</p>");
    }

}));
var earthquakeLayer = L.layerGroup(earthquakes);

// create the plates GeoJSON layer

// perform a GET request for the plates data
d3.json(plateURL, function(error, plateData) {
    if(error) console.warn(error);
    // send to createFeatures function
    var platesData = (plateData.features)
  
plates.push(L.geoJSON(platesData, {
    geometryToLayer: function(feature, coordinates) {
        return new L.polyline(coordinates, {
            color: "blue",
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
         })}
    }));
var platesLayer = L.layerGroup(plates);


// define map layers
var map1 = L.tileLayer("https://api.mapbox.com/styles/v1/myanaga87/cjhj7jihp0unp2ss5caaby7xv/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXlhbmFnYTg3IiwiYSI6ImNqaDllNDQ5dTBjMWMzMGxqazAweTdrd3EifQ.vMp4cvHR2uPa3oydja65bg"
);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXlhbmFnYTg3IiwiYSI6ImNqaDllNDQ5dTBjMWMzMGxqazAweTdrd3EifQ.vMp4cvHR2uPa3oydja65bg"
);

// define a baseMaps object to hold the base layers
var baseMaps = {
    "Light Map": map1,
    "Dark Map": darkmap
  };

// create overlay object to hold the overlay layers
var overlayMaps = {
    "Earthquakes": earthquakeLayer,
    "Plates": platesLayer,
  };

// create the map
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [map1, earthquakeLayer, platesLayer]
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
});
});

