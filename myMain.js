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
    attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, Data sourced from <a href='https://www.strausscenter.org/scad.html'> Social Conflict Analysis Database</a> and <a href='mailto:amir.a@uci.edu'>Amir AghaKouchak et al. | <a href='https://github.com/skeate/Leaflet.timeline'>Leaflet.timeline</a>, <a href='https://github.com/Leaflet/Leaflet.heat'>Leaflet.heat</a>" 
    }
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
        radius: 5,
        fillOpacity: 1,
        color: "hsl(" + fillColorVar + ", 100%, 25%)",
        fillColor: "hsl(" + fillColorVar + ", 100%, 50%)"

      }).bindPopup(popList);

    }
  });
  
  var heatmap = {
    "radius": .8,
    "maxOpacity": .7,
    "scaleRadius": true,
    "uselocalExtrema": false,
    latField: ('lat'),
    lngField: ('lng'),
    valueField: ('value'),
  };
  var heatmapLayer= new HeatmapOverlay(heatmap);
  pointTimeline.on('change', function() {

    var currentTime = pointTimeline.time;

    // var polyLayer = L.geoJson(TwoFive, {filter: layerFilter}).addTo(mapObject);
    // console.log(polyLayer.toGeoJSON());
    // function layerFilter (data){
    //   if ('purse' < currentTime) return true
    // }
    // heatmapLayer.setData(TwoFive, {filter: layerFilter});
    // mapObject.addLayer(heatmapLayer)
    // // mapObject.addLayer(heatmapLayer, {filter: addfilter});
    // function layerFilter(data){
    //         if (86400000 * 31 + data.properties.purse < currentTime) return false
    //     console.log(heatmapLayer.toGeoJSON());
    // }

    heatmapLayer.setData(JanTwoFive);
    //JANUARY
    var Jan = Date.parse("January 01, 2005");
    if (currentTime > Jan){
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Jan)){
      mapObject.removeLayer(heatmapLayer);
    }

    //FEBRUARY
    var Feb = Date.parse("February 01, 2005");
    if (currentTime > Feb){
      heatmapLayer.setData(FebTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 28 + Feb)){
      mapObject.removeLayer(heatmapLayer);
    }

    //MARCH
    var Mar = Date.parse("March 01, 2005");
    if (currentTime > Mar){
      heatmapLayer.setData(MarTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Mar)){
      mapObject.removeLayer(heatmapLayer);
    }
    
    //APRIL
    var Apr = Date.parse("April 01, 2005");
    if (currentTime > Apr){
      heatmapLayer.setData(AprTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Apr)){
      mapObject.removeLayer(heatmapLayer);
    }

    //MAY
    var May = Date.parse("May 01, 2005");
    if (currentTime > May){
      heatmapLayer.setData(MayTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + May)){
      mapObject.removeLayer(heatmapLayer);
    }

    //JUNE
    var Jun = Date.parse("June 01, 2005");
    if (currentTime > Jun){
      heatmapLayer.setData(JunTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Jun)){
      mapObject.removeLayer(heatmapLayer);
    }

    //JULY
    var Jul = Date.parse("July 01, 2005");
    if (currentTime > Jul){
      heatmapLayer.setData(JulTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Jul)){
      mapObject.removeLayer(heatmapLayer);
    }

    //AUGUST
    var Aug = Date.parse("August 01, 2005");
    if (currentTime > Aug){
      heatmapLayer.setData(AugTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Aug)){
      mapObject.removeLayer(heatmapLayer);
    }
    
    //SEPTEMBER
    var Sep = Date.parse("September 01, 2005");
    if (currentTime > Sep){
      heatmapLayer.setData(SepTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Sep)){
      mapObject.removeLayer(heatmapLayer);
    }

    //OCTOBER
    var Oct = Date.parse("October 01, 2005");
    if (currentTime > Oct){
      heatmapLayer.setData(OctTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Oct)){
      mapObject.removeLayer(heatmapLayer);
    }

    //NOVEMBER
    var Nov = Date.parse("November 01, 2005");
    if (currentTime > Nov){
      heatmapLayer.setData(NovTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Nov)){
      mapObject.removeLayer(heatmapLayer);
    }

    //DECEMBER
    var Dec = Date.parse("December 01, 2005");
    if (currentTime > Dec){
      heatmapLayer.setData(DecTwoFive);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Dec)){
      mapObject.removeLayer(heatmapLayer);
    }

          //JANUARY 2006
          var Jan = Date.parse("January 01, 2006");
          if (currentTime > Jan){
            heatmapLayer.setData(JanTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + Jan)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //FEBRUARY
          var Feb = Date.parse("February 01, 2006");
          if (currentTime > Feb){
            heatmapLayer.setData(FebTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 28 + Feb)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //MARCH
          var Mar = Date.parse("March 01, 2006");
          if (currentTime > Mar){
            heatmapLayer.setData(MarTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + Mar)){
            mapObject.removeLayer(heatmapLayer);
          }
          
          //APRIL
          var Apr = Date.parse("April 01, 2006");
          if (currentTime > Apr){
            heatmapLayer.setData(AprTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 30 + Apr)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //MAY
          var May = Date.parse("May 01, 2006");
          if (currentTime > May){
            heatmapLayer.setData(MayTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + May)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //JUNE
          var Jun = Date.parse("June 01, 2006");
          if (currentTime > Jun){
            heatmapLayer.setData(JunTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 30 + Jun)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //JULY
          var Jul = Date.parse("July 01, 2006");
          if (currentTime > Jul){
            heatmapLayer.setData(JulTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + Jul)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //AUGUST
          var Aug = Date.parse("August 01, 2006");
          if (currentTime > Aug){
            heatmapLayer.setData(AugTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + Aug)){
            mapObject.removeLayer(heatmapLayer);
          }
          
          //SEPTEMBER
          var Sep = Date.parse("September 01, 2006");
          if (currentTime > Sep){
            heatmapLayer.setData(SepTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 30 + Sep)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //OCTOBER
          var Oct = Date.parse("October 01, 2006");
          if (currentTime > Oct){
            heatmapLayer.setData(OctTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + Oct)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //NOVEMBER
          var Nov = Date.parse("November 01, 2006");
          if (currentTime > Nov){
            heatmapLayer.setData(NovTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 30 + Nov)){
            mapObject.removeLayer(heatmapLayer);
          }
      
          //DECEMBER
          var Dec = Date.parse("December 01, 2006");
          if (currentTime > Dec){
            heatmapLayer.setData(DecTwoSix);
            mapObject.addLayer(heatmapLayer);
          }
          if (currentTime > (86400000 * 31 + Dec)){
            mapObject.removeLayer(heatmapLayer);
          }

    //JANUARY 2007
    var Jan = Date.parse("January 01, 2007");
    if (currentTime > Jan){
      heatmapLayer.setData(JanTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Jan)){
      mapObject.removeLayer(heatmapLayer);
    }

    //FEBRUARY
    var Feb = Date.parse("February 01, 2007");
    if (currentTime > Feb){
      heatmapLayer.setData(FebTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 28 + Feb)){
      mapObject.removeLayer(heatmapLayer);
    }

    //MARCH
    var Mar = Date.parse("March 01, 2007");
    if (currentTime > Mar){
      heatmapLayer.setData(MarTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Mar)){
      mapObject.removeLayer(heatmapLayer);
    }
    
    //APRIL
    var Apr = Date.parse("April 01, 2007");
    if (currentTime > Apr){
      heatmapLayer.setData(AprTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Apr)){
      mapObject.removeLayer(heatmapLayer);
    }

    //MAY
    var May = Date.parse("May 01, 2007");
    if (currentTime > May){
      heatmapLayer.setData(MayTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + May)){
      mapObject.removeLayer(heatmapLayer);
    }

    //JUNE
    var Jun = Date.parse("June 01, 2007");
    if (currentTime > Jun){
      heatmapLayer.setData(JunTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Jun)){
      mapObject.removeLayer(heatmapLayer);
    }

    //JULY
    var Jul = Date.parse("July 01, 2007");
    if (currentTime > Jul){
      heatmapLayer.setData(JulTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Jul)){
      mapObject.removeLayer(heatmapLayer);
    }

    //AUGUST
    var Aug = Date.parse("August 01, 2007");
    if (currentTime > Aug){
      heatmapLayer.setData(AugTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Aug)){
      mapObject.removeLayer(heatmapLayer);
    }
    
    //SEPTEMBER
    var Sep = Date.parse("September 01, 2007");
    if (currentTime > Sep){
      heatmapLayer.setData(SepTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Sep)){
      mapObject.removeLayer(heatmapLayer);
    }

    //OCTOBER
    var Oct = Date.parse("October 01, 2007");
    if (currentTime > Oct){
      heatmapLayer.setData(OctTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Oct)){
      mapObject.removeLayer(heatmapLayer);
    }

    //NOVEMBER
    var Nov = Date.parse("November 01, 2007");
    if (currentTime > Nov){
      heatmapLayer.setData(NovTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 30 + Nov)){
      mapObject.removeLayer(heatmapLayer);
    }

    //DECEMBER
    var Dec = Date.parse("December 01, 2007");
    if (currentTime > Dec){
      heatmapLayer.setData(DecTwoSeven);
      mapObject.addLayer(heatmapLayer);
    }
    if (currentTime > (86400000 * 31 + Dec)){
      mapObject.removeLayer(heatmapLayer);
    }


         //JANUARY 2008
         var Jan = Date.parse("January 01, 2008");
         if (currentTime > Jan){
           heatmapLayer.setData(JanTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + Jan)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //FEBRUARY
         var Feb = Date.parse("February 01, 2008");
         if (currentTime > Feb){
           heatmapLayer.setData(FebTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 28 + Feb)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //MARCH
         var Mar = Date.parse("March 01, 2008");
         if (currentTime > Mar){
           heatmapLayer.setData(MarTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + Mar)){
           mapObject.removeLayer(heatmapLayer);
         }
         
         //APRIL
         var Apr = Date.parse("April 01, 2008");
         if (currentTime > Apr){
           heatmapLayer.setData(AprTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 30 + Apr)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //MAY
         var May = Date.parse("May 01, 2008");
         if (currentTime > May){
           heatmapLayer.setData(MayTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + May)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //JUNE
         var Jun = Date.parse("June 01, 2008");
         if (currentTime > Jun){
           heatmapLayer.setData(JunTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 30 + Jun)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //JULY
         var Jul = Date.parse("July 01, 2008");
         if (currentTime > Jul){
           heatmapLayer.setData(JulTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + Jul)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //AUGUST
         var Aug = Date.parse("August 01, 2008");
         if (currentTime > Aug){
           heatmapLayer.setData(AugTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + Aug)){
           mapObject.removeLayer(heatmapLayer);
         }
         
         //SEPTEMBER
         var Sep = Date.parse("September 01, 2008");
         if (currentTime > Sep){
           heatmapLayer.setData(SepTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 30 + Sep)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //OCTOBER
         var Oct = Date.parse("October 01, 2008");
         if (currentTime > Oct){
           heatmapLayer.setData(OctTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + Oct)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //NOVEMBER
         var Nov = Date.parse("November 01, 2008");
         if (currentTime > Nov){
           heatmapLayer.setData(NovTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 30 + Nov)){
           mapObject.removeLayer(heatmapLayer);
         }
     
         //DECEMBER
         var Dec = Date.parse("December 01, 2008");
         if (currentTime > Dec){
           heatmapLayer.setData(DecTwoEight);
           mapObject.addLayer(heatmapLayer);
         }
         if (currentTime > (86400000 * 31 + Dec)){
           mapObject.removeLayer(heatmapLayer);
         }

  //JANUARY 2009
  var Jan = Date.parse("January 01, 2009");
  if (currentTime > Jan){
    heatmapLayer.setData(JanTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Jan)){
    mapObject.removeLayer(heatmapLayer);
  }

  //FEBRUARY
  var Feb = Date.parse("February 01, 2009");
  if (currentTime > Feb){
    heatmapLayer.setData(FebTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 28 + Feb)){
    mapObject.removeLayer(heatmapLayer);
  }

  //MARCH
  var Mar = Date.parse("March 01, 2009");
  if (currentTime > Mar){
    heatmapLayer.setData(MarTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Mar)){
    mapObject.removeLayer(heatmapLayer);
  }
  
  //APRIL
  var Apr = Date.parse("April 01, 2009");
  if (currentTime > Apr){
    heatmapLayer.setData(AprTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Apr)){
    mapObject.removeLayer(heatmapLayer);
  }

  //MAY
  var May = Date.parse("May 01, 2009");
  if (currentTime > May){
    heatmapLayer.setData(MayTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + May)){
    mapObject.removeLayer(heatmapLayer);
  }

  //JUNE
  var Jun = Date.parse("June 01, 2009");
  if (currentTime > Jun){
    heatmapLayer.setData(JunTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Jun)){
    mapObject.removeLayer(heatmapLayer);
  }

  //JULY
  var Jul = Date.parse("July 01, 2009");
  if (currentTime > Jul){
    heatmapLayer.setData(JulTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Jul)){
    mapObject.removeLayer(heatmapLayer);
  }

  //AUGUST
  var Aug = Date.parse("August 01, 2009");
  if (currentTime > Aug){
    heatmapLayer.setData(AugTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Aug)){
    mapObject.removeLayer(heatmapLayer);
  }
  
  //SEPTEMBER
  var Sep = Date.parse("September 01, 2009");
  if (currentTime > Sep){
    heatmapLayer.setData(SepTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Sep)){
    mapObject.removeLayer(heatmapLayer);
  }

  //OCTOBER
  var Oct = Date.parse("October 01, 2009");
  if (currentTime > Oct){
    heatmapLayer.setData(OctTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Oct)){
    mapObject.removeLayer(heatmapLayer);
  }

  //NOVEMBER
  var Nov = Date.parse("November 01, 2009");
  if (currentTime > Nov){
    heatmapLayer.setData(NovTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Nov)){
    mapObject.removeLayer(heatmapLayer);
  }

  //DECEMBER
  var Dec = Date.parse("December 01, 2009");
  if (currentTime > Dec){
    heatmapLayer.setData(DecTwoNine);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Dec)){
    mapObject.removeLayer(heatmapLayer);
  }
  //JANUARY 2010
  var Jan = Date.parse("January 01, 2010");
  if (currentTime > Jan){
    heatmapLayer.setData(JanTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Jan)){
    mapObject.removeLayer(heatmapLayer);
  }

  //FEBRUARY
  var Feb = Date.parse("February 01, 2010");
  if (currentTime > Feb){
    heatmapLayer.setData(FebTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 28 + Feb)){
    mapObject.removeLayer(heatmapLayer);
  }

  //MARCH
  var Mar = Date.parse("March 01, 2010");
  if (currentTime > Mar){
    heatmapLayer.setData(MarTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Mar)){
    mapObject.removeLayer(heatmapLayer);
  }
  
  //APRIL
  var Apr = Date.parse("April 01, 2010");
  if (currentTime > Apr){
    heatmapLayer.setData(AprTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Apr)){
    mapObject.removeLayer(heatmapLayer);
  }

  //MAY
  var May = Date.parse("May 01, 2010");
  if (currentTime > May){
    heatmapLayer.setData(MayTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + May)){
    mapObject.removeLayer(heatmapLayer);
  }

  //JUNE
  var Jun = Date.parse("June 01, 2010");
  if (currentTime > Jun){
    heatmapLayer.setData(JunTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Jun)){
    mapObject.removeLayer(heatmapLayer);
  }

  //JULY
  var Jul = Date.parse("July 01, 2010");
  if (currentTime > Jul){
    heatmapLayer.setData(JulTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Jul)){
    mapObject.removeLayer(heatmapLayer);
  }

  //AUGUST
  var Aug = Date.parse("August 01, 2010");
  if (currentTime > Aug){
    heatmapLayer.setData(AugTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Aug)){
    mapObject.removeLayer(heatmapLayer);
  }
  
  //SEPTEMBER
  var Sep = Date.parse("September 01, 2010");
  if (currentTime > Sep){
    heatmapLayer.setData(SepTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Sep)){
    mapObject.removeLayer(heatmapLayer);
  }

  //OCTOBER
  var Oct = Date.parse("October 01, 2010");
  if (currentTime > Oct){
    heatmapLayer.setData(OctTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Oct)){
    mapObject.removeLayer(heatmapLayer);
  }

  //NOVEMBER
  var Nov = Date.parse("November 01, 2010");
  if (currentTime > Nov){
    heatmapLayer.setData(NovTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Nov)){
    mapObject.removeLayer(heatmapLayer);
  }

  //DECEMBER
  var Dec = Date.parse("December 01, 2010");
  if (currentTime > Dec){
    heatmapLayer.setData(DecTwoTen);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Dec)){
    mapObject.removeLayer(heatmapLayer);
  }
  //JANUARY 2011
  var Jan = Date.parse("January 01, 2011");
  if (currentTime > Jan){
    heatmapLayer.setData(JanTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Jan)){
    mapObject.removeLayer(heatmapLayer);
  }

  //FEBRUARY
  var Feb = Date.parse("February 01, 2011");
  if (currentTime > Feb){
    heatmapLayer.setData(FebTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 28 + Feb)){
    mapObject.removeLayer(heatmapLayer);
  }

  //MARCH
  var Mar = Date.parse("March 01, 2011");
  if (currentTime > Mar){
    heatmapLayer.setData(MarTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Mar)){
    mapObject.removeLayer(heatmapLayer);
  }
  
  //APRIL
  var Apr = Date.parse("April 01, 2011");
  if (currentTime > Apr){
    heatmapLayer.setData(AprTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Apr)){
    mapObject.removeLayer(heatmapLayer);
  }

  //MAY
  var May = Date.parse("May 01, 2011");
  if (currentTime > May){
    heatmapLayer.setData(MayTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + May)){
    mapObject.removeLayer(heatmapLayer);
  }

  //JUNE
  var Jun = Date.parse("June 01, 2011");
  if (currentTime > Jun){
    heatmapLayer.setData(JunTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Jun)){
    mapObject.removeLayer(heatmapLayer);
  }

  //JULY
  var Jul = Date.parse("July 01, 2011");
  if (currentTime > Jul){
    heatmapLayer.setData(JulTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Jul)){
    mapObject.removeLayer(heatmapLayer);
  }

  //AUGUST
  var Aug = Date.parse("August 01, 2011");
  if (currentTime > Aug){
    heatmapLayer.setData(AugTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Aug)){
    mapObject.removeLayer(heatmapLayer);
  }
  
  //SEPTEMBER
  var Sep = Date.parse("September 01, 2011");
  if (currentTime > Sep){
    heatmapLayer.setData(SepTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Sep)){
    mapObject.removeLayer(heatmapLayer);
  }

  //OCTOBER
  var Oct = Date.parse("October 01, 2011");
  if (currentTime > Oct){
    heatmapLayer.setData(OctTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Oct)){
    mapObject.removeLayer(heatmapLayer);
  }

  //NOVEMBER
  var Nov = Date.parse("November 01, 2011");
  if (currentTime > Nov){
    heatmapLayer.setData(NovTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 30 + Nov)){
    mapObject.removeLayer(heatmapLayer);
  }

  //DECEMBER
  var Dec = Date.parse("December 01, 2011");
  if (currentTime > Dec){
    heatmapLayer.setData(DecTwoEleven);
    mapObject.addLayer(heatmapLayer);
  }
  if (currentTime > (86400000 * 31 + Dec)){
    mapObject.removeLayer(heatmapLayer);
  }
//JANUARY 2012
var Jan = Date.parse("January 01, 2012");
if (currentTime > Jan){
  heatmapLayer.setData(JanTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jan)){
  mapObject.removeLayer(heatmapLayer);
}

//FEBRUARY
var Feb = Date.parse("February 01, 2012");
if (currentTime > Feb){
  heatmapLayer.setData(FebTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 28 + Feb)){
  mapObject.removeLayer(heatmapLayer);
}

//MARCH
var Mar = Date.parse("March 01, 2012");
if (currentTime > Mar){
  heatmapLayer.setData(MarTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Mar)){
  mapObject.removeLayer(heatmapLayer);
}

//APRIL
var Apr = Date.parse("April 01, 2012");
if (currentTime > Apr){
  heatmapLayer.setData(AprTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Apr)){
  mapObject.removeLayer(heatmapLayer);
}

//MAY
var May = Date.parse("May 01, 2012");
if (currentTime > May){
  heatmapLayer.setData(MayTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + May)){
  mapObject.removeLayer(heatmapLayer);
}

//JUNE
var Jun = Date.parse("June 01, 2012");
if (currentTime > Jun){
  heatmapLayer.setData(JunTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Jun)){
  mapObject.removeLayer(heatmapLayer);
}

//JULY
var Jul = Date.parse("July 01, 2012");
if (currentTime > Jul){
  heatmapLayer.setData(JulTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jul)){
  mapObject.removeLayer(heatmapLayer);
}

//AUGUST
var Aug = Date.parse("August 01, 2012");
if (currentTime > Aug){
  heatmapLayer.setData(AugTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Aug)){
  mapObject.removeLayer(heatmapLayer);
}

//SEPTEMBER
var Sep = Date.parse("September 01, 2012");
if (currentTime > Sep){
  heatmapLayer.setData(SepTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Sep)){
  mapObject.removeLayer(heatmapLayer);
}

//OCTOBER
var Oct = Date.parse("October 01, 2012");
if (currentTime > Oct){
  heatmapLayer.setData(OctTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Oct)){
  mapObject.removeLayer(heatmapLayer);
}

//NOVEMBER
var Nov = Date.parse("November 01, 2012");
if (currentTime > Nov){
  heatmapLayer.setData(NovTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Nov)){
  mapObject.removeLayer(heatmapLayer);
}

//DECEMBER
var Dec = Date.parse("December 01, 2012");
if (currentTime > Dec){
  heatmapLayer.setData(DecTwoTwelve);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Dec)){
  mapObject.removeLayer(heatmapLayer);
}

//JANUARY 2013
var Jan = Date.parse("January 01, 2013");
if (currentTime > Jan){
  heatmapLayer.setData(JanTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jan)){
  mapObject.removeLayer(heatmapLayer);
}

//FEBRUARY
var Feb = Date.parse("February 01, 2013");
if (currentTime > Feb){
  heatmapLayer.setData(FebTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 28 + Feb)){
  mapObject.removeLayer(heatmapLayer);
}

//MARCH
var Mar = Date.parse("March 01, 2013");
if (currentTime > Mar){
  heatmapLayer.setData(MarTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Mar)){
  mapObject.removeLayer(heatmapLayer);
}

//APRIL
var Apr = Date.parse("April 01, 2013");
if (currentTime > Apr){
  heatmapLayer.setData(AprTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Apr)){
  mapObject.removeLayer(heatmapLayer);
}

//MAY
var May = Date.parse("May 01, 2013");
if (currentTime > May){
  heatmapLayer.setData(MayTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + May)){
  mapObject.removeLayer(heatmapLayer);
}

//JUNE
var Jun = Date.parse("June 01, 2013");
if (currentTime > Jun){
  heatmapLayer.setData(JunTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Jun)){
  mapObject.removeLayer(heatmapLayer);
}

//JULY
var Jul = Date.parse("July 01, 2013");
if (currentTime > Jul){
  heatmapLayer.setData(JulTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jul)){
  mapObject.removeLayer(heatmapLayer);
}

//AUGUST
var Aug = Date.parse("August 01, 2013");
if (currentTime > Aug){
  heatmapLayer.setData(AugTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Aug)){
  mapObject.removeLayer(heatmapLayer);
}

//SEPTEMBER
var Sep = Date.parse("September 01, 2013");
if (currentTime > Sep){
  heatmapLayer.setData(SepTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Sep)){
  mapObject.removeLayer(heatmapLayer);
}

//OCTOBER
var Oct = Date.parse("October 01, 2013");
if (currentTime > Oct){
  heatmapLayer.setData(OctTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Oct)){
  mapObject.removeLayer(heatmapLayer);
}

//NOVEMBER
var Nov = Date.parse("November 01, 2013");
if (currentTime > Nov){
  heatmapLayer.setData(NovTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Nov)){
  mapObject.removeLayer(heatmapLayer);
}

//DECEMBER
var Dec = Date.parse("December 01, 2013");
if (currentTime > Dec){
  heatmapLayer.setData(DecTwoThirteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Dec)){
  mapObject.removeLayer(heatmapLayer);
}


//JANUARY 2014
var Jan = Date.parse("January 01, 2014");
if (currentTime > Jan){
  heatmapLayer.setData(JanTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jan)){
  mapObject.removeLayer(heatmapLayer);
}

//FEBRUARY
var Feb = Date.parse("February 01, 2014");
if (currentTime > Feb){
  heatmapLayer.setData(FebTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 28 + Feb)){
  mapObject.removeLayer(heatmapLayer);
}

//MARCH
var Mar = Date.parse("March 01, 2014");
if (currentTime > Mar){
  heatmapLayer.setData(MarTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Mar)){
  mapObject.removeLayer(heatmapLayer);
}

//APRIL
var Apr = Date.parse("April 01, 2014");
if (currentTime > Apr){
  heatmapLayer.setData(AprTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Apr)){
  mapObject.removeLayer(heatmapLayer);
}

//MAY
var May = Date.parse("May 01, 2014");
if (currentTime > May){
  heatmapLayer.setData(MayTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + May)){
  mapObject.removeLayer(heatmapLayer);
}

//JUNE
var Jun = Date.parse("June 01, 2014");
if (currentTime > Jun){
  heatmapLayer.setData(JunTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Jun)){
  mapObject.removeLayer(heatmapLayer);
}

//JULY
var Jul = Date.parse("July 01, 2014");
if (currentTime > Jul){
  heatmapLayer.setData(JulTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jul)){
  mapObject.removeLayer(heatmapLayer);
}

//AUGUST
var Aug = Date.parse("August 01, 2014");
if (currentTime > Aug){
  heatmapLayer.setData(AugTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Aug)){
  mapObject.removeLayer(heatmapLayer);
}

//SEPTEMBER
var Sep = Date.parse("September 01, 2014");
if (currentTime > Sep){
  heatmapLayer.setData(SepTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Sep)){
  mapObject.removeLayer(heatmapLayer);
}

//OCTOBER
var Oct = Date.parse("October 01, 2014");
if (currentTime > Oct){
  heatmapLayer.setData(OctTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Oct)){
  mapObject.removeLayer(heatmapLayer);
}

//NOVEMBER
var Nov = Date.parse("November 01, 2014");
if (currentTime > Nov){
  heatmapLayer.setData(NovTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Nov)){
  mapObject.removeLayer(heatmapLayer);
}

//DECEMBER
var Dec = Date.parse("December 01, 2014");
if (currentTime > Dec){
  heatmapLayer.setData(DecTwoFourteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Dec)){
  mapObject.removeLayer(heatmapLayer);
}

//JANUARY 2015
var Jan = Date.parse("January 01, 2015");
if (currentTime > Jan){
  heatmapLayer.setData(JanTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jan)){
  mapObject.removeLayer(heatmapLayer);
}

//FEBRUARY
var Feb = Date.parse("February 01, 2015");
if (currentTime > Feb){
  heatmapLayer.setData(FebTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 28 + Feb)){
  mapObject.removeLayer(heatmapLayer);
}

//MARCH
var Mar = Date.parse("March 01, 2015");
if (currentTime > Mar){
  heatmapLayer.setData(MarTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Mar)){
  mapObject.removeLayer(heatmapLayer);
}

//APRIL
var Apr = Date.parse("April 01, 2015");
if (currentTime > Apr){
  heatmapLayer.setData(AprTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Apr)){
  mapObject.removeLayer(heatmapLayer);
}

//MAY
var May = Date.parse("May 01, 2015");
if (currentTime > May){
  heatmapLayer.setData(MayTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + May)){
  mapObject.removeLayer(heatmapLayer);
}

//JUNE
var Jun = Date.parse("June 01, 2015");
if (currentTime > Jun){
  heatmapLayer.setData(JunTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Jun)){
  mapObject.removeLayer(heatmapLayer);
}

//JULY
var Jul = Date.parse("July 01, 2015");
if (currentTime > Jul){
  heatmapLayer.setData(JulTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Jul)){
  mapObject.removeLayer(heatmapLayer);
}

//AUGUST
var Aug = Date.parse("August 01, 2015");
if (currentTime > Aug){
  heatmapLayer.setData(AugTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Aug)){
  mapObject.removeLayer(heatmapLayer);
}

//SEPTEMBER
var Sep = Date.parse("September 01, 2015");
if (currentTime > Sep){
  heatmapLayer.setData(SepTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Sep)){
  mapObject.removeLayer(heatmapLayer);
}

//OCTOBER
var Oct = Date.parse("October 01, 2015");
if (currentTime > Oct){
  heatmapLayer.setData(OctTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Oct)){
  mapObject.removeLayer(heatmapLayer);
}

//NOVEMBER
var Nov = Date.parse("November 01, 2015");
if (currentTime > Nov){
  heatmapLayer.setData(NovTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 30 + Nov)){
  mapObject.removeLayer(heatmapLayer);
}

//DECEMBER
var Dec = Date.parse("December 01, 2015");
if (currentTime > Dec){
  heatmapLayer.setData(DecTwoFifteen);
  mapObject.addLayer(heatmapLayer);
}
if (currentTime > (86400000 * 31 + Dec)){
  mapObject.removeLayer(heatmapLayer);
}



  });

  mapObject.addLayer(heatmapLayer);






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
  //updateList(pointTimeline);


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
