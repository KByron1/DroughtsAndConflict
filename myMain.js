"use strict";

var myFunctionHolder = {};

//declaring function 1
myFunctionHolder.addPopups = function (feature, layer) {
  if (feature.properties && feature.properties.startdate) {
    layer.bindPopup(feature.properties.startdate);
  }
}



/* COMMENTED OUT THE DOTS FOR TEST
//declaring function 2
myFunctionHolder.pointToCircle = function (feature, latlng) {
  var fillColorVar = "";
  if (Number(feature.properties["ndeath"]) > 0 && Number(feature.properties["ndeath"]) < 5) {
    fillColorVar = "Green";
  } else if (Number(feature.properties["ndeath"]) > 5 && Number(feature.properties["ndeath"]) < 10) {
    fillColorVar = "Blue";
  } else if (Number(feature.properties["ndeath"]) > 10 && Number(feature.properties["ndeath"]) < 100000) {
    fillColorVar = "Red";
  }
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: fillColorVar,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
  return circleMarker;
}
*/


//execute only when window is fully loaded
window.onload = function () {

  var mapObject = L.map('mapDivId').setView([3.090739, 17.404454], 4);
  var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiMTIzODIiLCJhIjoiY2pjaTRscWllMmV0ZTMzbnptZXppczA1MCJ9.DbUREsZcMMNHEBwqytnWnA', {
    maxZoom: 18,
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(mapObject);

  //TODO not in use at the moment
  var cfg = {
    "radius": 0.005,
    "maxOpacity": 1,
    "scaleRadius": true,
    "uselocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'value'
  };


  /*
    MAYBE WE DONT NEED?
    var violenceLayer = L.geoJSONp(Violence, {
      onEachFeature: myFunctionHolder.addPopups,
      pointToLayer: myFunctionHolder.pointToCircle
    });
  */



  //start earthquake data
  //TODO not in use
  function updateList(timeline) {
    var displayed = timeline.getLayers();
    var list = document.getElementById("displayed-list");
    list.innerHTML = "";
    displayed.forEach(function (riot) {
      var li = document.createElement('li');
      var sideList = "<dt><b>Country: </b></dt>"
        + "<dd>" + riot.feature.properties.countryname + "</dd>"
        + "<dt><b>Description: </b></dt>"
        + "<dd>" + riot.feature.properties.issuenote + "</dd>"
        + "<dt><b>Deaths: </b></dt>"
        + "<dd>" + riot.feature.properties.ndeath + "</dd>"
      var sideListSmall = sideList.fontsize(2);
      li.innerHTML = (sideListSmall);
      list.appendChild(li);
    });
  }

  // eqfeed_callback is called once the earthquake geojsonp file below loads
  var getInterval = function (riot) {
    var intervalObject =
      {
        start: Date.parse(riot.properties.startdate),
        end: Date.parse(riot.properties.enddate) + (86400000 * 150),
      };
    //console.log(intervalObject)
    return intervalObject;
  };
  var timelineControl = L.timelineSliderControl({
    formatOutput: function (date) {
      return new Date(date).toString();
      //return moment(date).format("YYYY-MM-DD HH:MM:SS");
      //return date;
    }
  });

    var cfg = {
          "radius": .9,
          "maxOpacity": .7,
          "scaleRadius": true,
          "uselocalExtrema": true,
          latField: ('lat'),
          lngField: ('lng'),
          valueField: 'value'
        };
        var heatmapLayer= new HeatmapOverlay(cfg);
        heatmapLayer.setData(TwoFiveDroughtData);
        mapObject.addLayer(heatmapLayer);

  // var timelineControl = L.timelineSliderControl({
  //   formatOutput: function(date){
  //     return moment(date).format("YYYY-MM-DD HH:MM:SS");
  //   }
  // });

  var timeline = L.timeline(violence, {
    getInterval: getInterval,
    pointToLayer: function (data, latlng) {
      var deaths = data.properties.ndeath;
      var popList = "<dt><b>Description: </b></dt>"
        + "<dd>" + data.properties.issuenote + "</dd>"
        + "<dt><b>Deaths: </b></dt>"
        + "<dd>" + data.properties.ndeath + "</dd>"
      var fillColorVar = "";
      if (data.properties.ndeath > -1 && data.properties.ndeath < 1) {
        fillColorVar = 115;
      } else if (data.properties.ndeath > 0 && data.properties.ndeath < 10) {
        fillColorVar = 60;
      } else if (data.properties.ndeath >= 10 && data.properties.ndeath < 20) {
        fillColorVar = 40;
      } else if (data.properties.ndeath >= 20 && data.properties.ndeath < 100) {
        fillColorVar = 20;
      } else if (data.properties.ndeath >= 100) {
        fillColorVar = 1;
      }
      return L.circleMarker(latlng, {
        radius: 10,
        fillOpacity: 1,
        color: "hsl(" + fillColorVar + ", 100%, 25%)",
        fillColor: "hsl(" + fillColorVar + ", 100%, 50%)"
      }).bindPopup(popList);

    }
  });
  timelineControl.addTo(mapObject);
  timelineControl.addTimelines(timeline);
  timeline.addTo(mapObject);
  //timeline.on('change', function (e) {
  //  updateList(e.target);
  //});
  //updateList(timeline);


  //END EARTHKUAKE DATA

  //mapObject.addLayer(violenceLayer);


  // bikeThefts is the variable name we difined in Bike_Thefts_2011.js file. 
  //var bikesLayerGroup = L.geoJSON(bikeThefts, {
  //  onEachFeature: myFunctionHolder.addPopups,
  //  pointToLayer: myFunctionHolder.pointToCircle
  //});

  //mapObject.addLayer(bikesLayerGroup);
  //mapObject.fitBounds(bikesLayerGroup.getBounds());
};
