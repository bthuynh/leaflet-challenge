
var myMap = L.map("map", {
  center: [28.304381, -196.526448],
  zoom: 2.5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson?";


function calculateRadius (magnitude) {
  return magnitude * 3
}


function colorMarker (depth) {
  if (depth > 90 ) {
    return "#ea2c2c"
  }
  if (depth > 70) {
    return "	#ea822c"
  }
  if (depth > 50) {
    return "	#ee9c00"
  }
  if (depth > 30) {
    return "	#eecc00"
  }
  if (depth > 10) {
    return "	#d4ee00"
  }
  else {
    return "#98ee00"
  }
}


d3.json(baseURL).then(function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latLng) {
      return L.circleMarker(latLng)
      
    },


    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag +  "</p><p>Depth: " + feature.geometry.coordinates[2] );
    },

    style: function (feature, layer) {
      return {
        radius: calculateRadius(feature.properties.mag),
        opacity: 0,
        fillOpacity: .75, 
        color: colorMarker(feature.geometry.coordinates[2])
      }
    }

  }).addTo(myMap);

})


var legend = L.control({
  position: "bottomright"
});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10, 10, 30, 50, 70, 90];
  var colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"];
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += "<div class = 'color-text-combo'><i style='background: "
      + colors[i]
      + "'></i> "
      + grades[i]
      + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "</div><br>" : "+");
  }
  return div;
};

legend.addTo(myMap);