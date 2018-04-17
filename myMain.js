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
  // function updateList(timeline) {
  //   var displayed = timeline.getLayers();
  //   var list = document.getElementById("displayed-list");
  //   list.innerHTML = "";
  //   displayed.forEach(function (riot) {
  //     var li = document.createElement('li');
  //     var sideList = "<dt><b>Country: </b></dt>"
  //       + "<dd>" + riot.feature.properties.countryname + "</dd>"
  //       + "<dt><b>Description: </b></dt>"
  //       + "<dd>" + riot.feature.properties.issuenote + "</dd>"
  //       + "<dt><b>Deaths: </b></dt>"
  //       + "<dd>" + riot.feature.properties.ndeath + "</dd>"
  //     var sideListSmall = sideList.fontsize(2);
  //     li.innerHTML = (sideListSmall);
  //     list.appendChild(li);
  //   });
  // }

  // eqfeed_callback is called once the earthquake geojsonp file below loads
  var getInterval1 = function (riot) {
    var intervalObject =
      {
        start: Date.parse(riot.properties.startdate),
        end: Date.parse(riot.properties.enddate) + (86400000 * 150),
      };
    //console.log(intervalObject)
    return intervalObject;
  };
  var getInterval2 = function (drought) {
    var intervalObject =
      {
        start: Date.parse(drought.properties.date),
        end: Date.parse(drought.properties.date) + (86400000 * 31),
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



  // var timelineControl = L.timelineSliderControl({
  //   formatOutput: function(date){
  //     return moment(date).format("YYYY-MM-DD HH:MM:SS");
  //   }
  // });

  var pointTimeline = L.timeline(violence, {
    getInterval: getInterval1,
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
      var zoomed=2
      var myZoom = {
          start: mapObject.getZoom(),
          end: mapObject.getZoom()
      };
      
      mapObject.on('zoomstart', function (e) {
          myZoom.start = mapObject.getZoom();
      });
       
      mapObject.on('zoomend', function(e) {
          myZoom.end = mapObject.getZoom();
          var diff = myZoom.start - myZoom.end;
          if (diff > 0) {
              zoomed = 15;
          } else if (diff < 0) {
              zoomed = .06666666666;
          }
      });
      //var zoomed = 10000;
      return L.circleMarker(latlng, {
          radius: 10,
        fillOpacity: 1,
        color: "hsl(" + fillColorVar + ", 100%, 25%)",
        fillColor: "hsl(" + fillColorVar + ", 100%, 50%)"

      }).bindPopup(popList);

    }
  });
  
  var heatmap = {
    "radius": .9,
    "maxOpacity": .7,
    "scaleRadius": true,
    "uselocalExtrema": true,
    latField: ('lat'),
    lngField: ('lng'),
    valueField: 'value',
    start: 'date',
    end: 'date' + (86400000 * 31)
  };
  var heatmapLayer= new HeatmapOverlay(heatmap);
  heatmapLayer.setData(TwoFiveDroughtData);

  pointTimeline.on('change', function() {
    var currentTime = pointTimeline.time;
    var Jan = Date.parse("January 01, 2005");
    if (currentTime > Jan){
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Jan)){
      mapObject.removeLayer(heatmapLayer);
    }
    // if (currentTime = (Jan + 86400000 * 31)) {
    // mapObject.removeLayer(heatmapLayer)};
  });

  // mapObject.addLayer(heatmapLayer);






  // var heatTimeline = L.timeline(heatmapLayer, {
  //   getInterval: getInterval2
  // });


// var vioTimeline = L.timeline(timeline);
// vioTimeline.addTo(mapObject);
// var heatTimeline = L.timeline(heatmapLayer);
// heatTimeline.addTo(map);

  timelineControl.addTo(mapObject);
  timelineControl.addTimelines(pointTimeline);
  // timelineControl.addTimelines(heatTimeline);
  pointTimeline.addTo(mapObject);
  // heatTimeline.addTo(mapObject);
  /*timeline.on('change', function (e) {
    updateList(e.target);
  });*/
  updateList(pointTimeline);


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
