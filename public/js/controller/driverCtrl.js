module.exports = function($http, $scope, $rootScope, $sessionStorage, $cookies, Auth){

  var socket = io();



  var map, infoWindow;
  $scope.initMap =  function () {
     map = new google.maps.Map(document.getElementById('map'), {
       center: {lat: -34.397, lng: 150.644},
       zoom: 13,
      //  styles: [
      //       {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      //       {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      //       {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      //       {
      //         featureType: 'administrative.locality',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#d59563'}]
      //       },
      //       {
      //         featureType: 'poi',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#d59563'}]
      //       },
      //       {
      //         featureType: 'poi.park',
      //         elementType: 'geometry',
      //         stylers: [{color: '#263c3f'}]
      //       },
      //       {
      //         featureType: 'poi.park',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#6b9a76'}]
      //       },
      //       {
      //         featureType: 'road',
      //         elementType: 'geometry',
      //         stylers: [{color: '#38414e'}]
      //       },
      //       {
      //         featureType: 'road',
      //         elementType: 'geometry.stroke',
      //         stylers: [{color: '#212a37'}]
      //       },
      //       {
      //         featureType: 'road',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#9ca5b3'}]
      //       },
      //       {
      //         featureType: 'road.highway',
      //         elementType: 'geometry',
      //         stylers: [{color: '#746855'}]
      //       },
      //       {
      //         featureType: 'road.highway',
      //         elementType: 'geometry.stroke',
      //         stylers: [{color: '#1f2835'}]
      //       },
      //       {
      //         featureType: 'road.highway',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#f3d19c'}]
      //       },
      //       {
      //         featureType: 'transit',
      //         elementType: 'geometry',
      //         stylers: [{color: '#2f3948'}]
      //       },
      //       {
      //         featureType: 'transit.station',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#d59563'}]
      //       },
      //       {
      //         featureType: 'water',
      //         elementType: 'geometry',
      //         stylers: [{color: '#17263c'}]
      //       },
      //       {
      //         featureType: 'water',
      //         elementType: 'labels.text.fill',
      //         stylers: [{color: '#515c6d'}]
      //       },
      //       {
      //         featureType: 'water',
      //         elementType: 'labels.text.stroke',
      //         stylers: [{color: '#17263c'}]
      //       }
      //     ]
     });
     infoWindow = new google.maps.InfoWindow;

     // Try HTML5 geolocation.
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };
        coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         infoWindow.setPosition(pos);
         infoWindow.setContent('Location found.');
         infoWindow.open(map);
         map.setCenter(pos);
         var marker = new google.maps.Marker({
           position: pos,
           map: map,
           icon: '../resourses/images/cab1.jpg',
           title: "Your Location"
         })

         sendLocation(position.coords.latitude, position.coords.longitude);
       }, function() {
         handleLocationError(true, infoWindow, map.getCenter());
       });
     } else {
       // Browser doesn't support Geolocation
       handleLocationError(false, infoWindow, map.getCenter());
     }
   }

   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
     infoWindow.setPosition(pos);
     infoWindow.setContent(browserHasGeolocation ?
                           'Error: The Geolocation service failed.' :
                           'Error: Your browser doesn\'t support geolocation.');
     infoWindow.open(map);
   }

   function sendLocation(latitude, longitude){
     var authUser = $cookies.getObject('authUser');
     var driverInfo = authUser.currentUser.userInfo;
     socket.emit('init', {
       location:{
         lat: latitude,
         lng: longitude
       },
       driver: driverInfo
     });
   }

// function ack() {
//    socket.on('DriverAcknowledge', function (data){
//      console.log(data);
//
//      document.getElementById('custName').innerHTML = data.Customer.name;
//      document.getElementById('contactno').innerHTML = data.Customer.mobile;
//      document.getElementById('pickup').innerHTML = data.Pickup;
//      document.getElementById('Destination').innerHTML = data.Drop;
//      document.getElementById('fare').innerHTML = data.CabFare;
//        $('#Modal').modal();
//    });
// }
   $scope.showCorrentBookings = function(){

     console.log('working driver ctrl');
     socket.on('DriverAcknowledge', function (data){
console.log(data);
       document.getElementById('custName').innerHTML = data.Customer.name;
       document.getElementById('contactno').innerHTML = data.Customer.mobile;
       document.getElementById('pickup').innerHTML = data.Pickup;
       document.getElementById('destinationloc').innerHTML = data.Drop;
       document.getElementById('fare').innerHTML = data.CabFare;
         $('#Modal').modal();
     });
   }
};
