$(function() {
  var position = new google.maps.LatLng(52.450939, -1.721002);

  getCurrentPosition = function(callback) {
    // 1.Versuch zu lokalisieren via W3C Geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            callback(position);
          }, callback(position));         
    } // Wenn fehlgeeschlagen, 2.Versuch zu lokalisieren via Google Gears Geolocation
    else if (google.gears) {
      var geo = google.gears.factory.create('beta.geolocation');
      geo.getCurrentPosition(
        function(pos) {
          position = new google.maps.LatLng(pos.latitude,pos.longitude);
          callback(position);
        }, callback(position));          
    } // Falls Browser Geolocation nicht unterstützt
    else {
      // Zeig dem User das eigene Land
      callback(position);
    }
  };
     // starte die gane Funktion
  getCurrentPosition(InitMap);
});

function InitMap(pos) {
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: pos,
    zoom: 14,
    mapTypeId: 'roadmap'
  });

  var marker = new google.maps.Marker({
    position: pos, 
    animation: google.maps.Animation.DROP,
    map: map, 
    title: "You are here, mate!"
  });   
    
var layer = new google.maps.FusionTablesLayer({
  query: {
    select: 'Geocodable address',
    from: '1260763'
    },
  });

  layer.setMap(map);
};
