module.exports = function ($scope, $rootScope, $http, $location, $cookies, $sessionStorage) {

$scope.rideDetails = false;
var socket = io();
var cabmarkers = {};
var pos;
var rate;
var totalAmount;
var cabtype = $scope.cartype;
var distance;
$scope.Booking = {};

$('.timepicker').timepicker({
    timeFormat: 'HH:mm p',
    interval: 1,
    dynamic: true,
    dropdown: true,
    scrollbar: true
});

 $scope.initMap =  function () {
          var map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 12

          });
          var geocoder = new google.maps.Geocoder;
          new AutocompleteDirectionsHandler(map);

          infoWindow = new google.maps.InfoWindow;


                 // Try HTML5 geolocation.
                 if (navigator.geolocation) {
                   navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                       lat: position.coords.latitude,
                       lng: position.coords.longitude
                     };
                     console.log(pos);
                     geocodeLatLng(geocoder, map, infoWindow, pos);
                     console.log(pos);
                     $scope.position = pos;

                     infoWindow.setPosition(pos);
                     infoWindow.setContent('Location found.' + pos.lat +pos.lng);
                     infoWindow.open(map);
                     map.setCenter(pos);
                   }, function() {
                     handleLocationError(true, infoWindow, map.getCenter());
                   });
                 } else {
                   // Browser doesn't support Geolocation
                   handleLocationError(false, infoWindow, map.getCenter());
                 }
                //  var start = document.getElementById('start').innerHTML = pos;
                socket.on('NewDriver', function(data){
                  cabmarkers[data.id] = new google.maps.Marker({
                    position: data.location,
                    map:map,
                    icon: "../resourses/images/cab1.jpg"
                  });
                });

        }

         /**
          * @constructor
         */
        function AutocompleteDirectionsHandler(map) {
          this.map = map;
          this.originPlaceId = null;
          this.destinationPlaceId = null;
          this.travelMode = 'DRIVING';
          var originInput = document.getElementById('start');
          var destinationInput = document.getElementById('dest');
          // var modeSelector = document.getElementById('mode-selector');
          this.directionsService = new google.maps.DirectionsService;
          this.directionsDisplay = new google.maps.DirectionsRenderer;
          this.directionsDisplay.setMap(map);

          var originAutocomplete = new google.maps.places.Autocomplete(
              originInput, {placeIdOnly: true});
          var destinationAutocomplete = new google.maps.places.Autocomplete(
              destinationInput, {placeIdOnly: true});

          // this.setupClickListener('changemode-walking', 'WALKING');
          // this.setupClickListener('changemode-transit', 'TRANSIT');
          // this.setupClickListener('changemode-driving', 'DRIVING');

          this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        }

// console.log( originInput);
        AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          var me = this;
          autocomplete.bindTo('bounds', this.map);
          autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            if (mode === 'ORIG') {
              me.originPlaceId = place.place_id;
            } else {
              me.destinationPlaceId = place.place_id;
            }
            me.route();
          });

        };

        AutocompleteDirectionsHandler.prototype.route = function() {
          if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
          }
          var me = this;

          this.directionsService.route({
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
          }, function(response, status) {
            if (status === 'OK') {
              me.directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
         };
                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                                      'Error: The Geolocation service failed.' :
                                      'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
              }




              function geocodeLatLng(geocoder, map, infowindow, pos) {


            var latlng = {lat:pos.lat, lng:pos.lng};
            geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
            if (results[1]) {
              // // map.setZoom(13);
              // var marker = new google.maps.Marker({
              //   position: latlng,
              //   map: map,
              //   draggable :true
              // });
              infowindow.setContent('Your Location = ' + results[1].formatted_address);
              // infowindow.open(map, marker);
              document.getElementById('start').value = results[1].formatted_address;
            } else {
              window.alert('No results found');
            }
            } else {
            window.alert('Geocoder failed due to: ' + status);
            }
            });
            }


            $scope.cartype = '';


            $('.btn-default').click(function(e) {
            $('.btn-default').not(this).removeClass('active');
            $(this).toggleClass('active');
            e.preventDefault();
        });

        $scope.micro = function(){
          $scope.cartype = 'Micro';
          console.log($scope.cartype);
        };
        $scope.mini = function(){
          $scope.cartype = 'Mini';
          console.log($scope.cartype);
        };
        $scope.sedan = function(){
          $scope.cartype = 'Prime Sedan';
          console.log($scope.cartype);
        };
        $scope.suv = function(){
          $scope.cartype = 'Prime SUV';
          console.log($scope.cartype);
        };


        $scope.estm = function() {
var rate = Number;
          $http.get('/tarif/getTrf/' + $scope.cartype).success(function(response){
          var type = response.docs[0];
          console.log(response);

          var start = parseInt(type.StPekTm);
          var end = parseInt(type.EnPekTm);
          var currentTime = new Date().getHours();
          console.log(currentTime);
          console.log(end);
          console.log(start);


          if(type.Type == 'Micro'){


              if(end >= currentTime &&  currentTime >= start ){
                rate = type.PekRt;
                console.log(rate);
              }else {
                rate = type.NrmRt;
                console.log(rate);
              }
            }else if (type.Type == 'Mini') {
              if(end >= currentTime &&  currentTime >= start ){
                rate = type.PekRt;
                console.log(rate);
              }else {
                rate = type.NrmRt;
                console.log(rate);
              }
            }else if (type.Type == 'Prime Sedan') {
              if(end >= currentTime &&  currentTime >= start ){
                rate = type.PekRt;
                console.log(rate);
              }else {
                rate = type.NrmRt;
                console.log(rate);
              }
            }else if (type.Type == 'Prime SUV') {
              if(end >= currentTime &&  currentTime >= start ){
                rate = type.PekRt;
                console.log(rate);
              }else {
                rate = type.NrmRt;
                console.log(rate);
              }
            }
          });

var origin = document.getElementById('start').value;
var dest = document.getElementById('dest').value;
          var origin1 = origin;
          // var totalAmount = Number;
// var origin2 = 'Greenwich, England';
var destinationA = dest;
// var destinationB = new google.maps.LatLng(50.087692, 14.421150);
var distTime = "";
var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: [destinationA],
    travelMode: 'DRIVING',
    // transitOptions: TransitOptions,
    // drivingOptions: DrivingOptions,
    // unitSystem: UnitSystem,
    // avoidHighways: Boolean,
    // avoidTolls: Boolean,
  }, callback);

 var results;
function callback(response, status) {
  if (status == 'OK') {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++) {
       results = response.rows[i].elements;
      console.log(results);
      // distTime = results[0].distance.text;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        var duration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];
      }
    }
  }
var qweee = parseInt(rate);
var klsdjalsk = parseInt(distance);
var totalAmount = qweee * klsdjalsk;
console.log(totalAmount);
console.log(duration);

document.getElementById('estmdist').innerHTML ='Estmd. Distance :' + distance;
document.getElementById('estmdur').innerHTML = 'Estmd. Duration :' + duration;
document.getElementById('estmfare').innerHTML = 'Estmd. Fare :' + totalAmount;


// function calculate()
}
// console.log(distance);


$scope.rideDetails = true;

                }

console.log($scope.position);


      $scope.RideNow = function(){
        console.log($scope.position);
        var customer = $cookies.getObject('authUser');
        var loggedInUser = customer.currentUser.userInfo;
        socket.emit('BookRide', {
          location: $scope.position,
          SelectedCab:$scope.cartype,
          Pickup: document.getElementById('start').value,
          Dest: document.getElementById('dest').value,
          Fare: totalAmount,
          CustomerInfo:loggedInUser
        });

socket.on('BookingDetails', function(data){
  if(!data.Status){
    alert('No Cabs Available at this Moment');

  }else if (socket.id == data.BookingId) {
    alert('You cat book the same cab');
  }else{
    console.log(data);
    var customer = $cookies.getObject('authUser');
    document.getElementById('drivername').innerHTML = data.DriverDetails.name;
    document.getElementById('contactno').innerHTML = data.DriverDetails.mobile;
    document.getElementById('vehical').innerHTML = data.CabDetails.cabrMake +" "+data.CabDetails.cabrModel +" "+data.CabDetails.cabrRegno;
    document.getElementById('pickup').innerHTML = document.getElementById('start').value;
    document.getElementById('destinationloc').innerHTML =  document.getElementById('dest').value;
    $('#Modal').modal();
    $("#ridenow").prop('diabled', true);
    $scope.Booking.PickupLocation = document.getElementById('start').value;
    $scope.Booking.DestinationLocation = document.getElementById('dest').value;
    $scope.Booking.Fare = totalAmount;
    $scope.Booking.Customer = customer.currentUser.userInfo;
    $scope.Booking.Distance = distance;
    $scope.Booking.BookingType = 'Current';
    $scope.Booking.CabType = $scope.cartype;
    $scope.Booking.BookingStatus = 'Completed';
    $scope.Booking.PickupDate = new Date().getDay() + '-'+new Date().getMonth();+'-'+new Date().getFullYear();
    $scope.Booking.PickupTime = new Date().getHours()+':'+new Date().getMinutes();
    $scope.Booking.BookingId = data.BookingId;
    $scope.Booking.Driver = data.DriverDetails;
    $scope.Booking.Cab = data.CabDetails;

    console.log($scope.Booking)
    $http.post('/bookcab/bookcabnow', $scope.Booking).then(function(){

    });

  }
})

      }

      // socket.on('BookingDetails', function(data){
      //   console.log(data.Status);
      //   if(!data.Status){
      //     alert('No Cabs available at this time');
      //   }else if (socket.id == data.BookingId) {
      //     alert('cant book the same cab');
      //   }else {
      //     var customer = $cookies.getObject('authUser');
      //   }
      // })




$scope.RideLater = function () {
  var customer = $cookies.getObject('authUser');
  $scope.Booking.PickupLocation = document.getElementById('modalstart').value;
  $scope.Booking.DestinationLocation = document.getElementById('modaldest').value;
  $scope.Booking.Fare = totalAmount;
  $scope.Booking.Customer = customer.currentUser.userInfo;
  $scope.Booking.Distance = distance;
  $scope.Booking.BookingType = 'Advanced';
  $scope.Booking.CabType = $scope.cartype;
  $scope.Booking.BookingStatus = 'Hold';
  $scope.Booking.PickupDate = document.getElementById('pickdate').value;
  $scope.Booking.PickupTime = document.getElementById('timepicker').value;
  console.log($scope.Booking)
  $http.post('/bookcab/bookcabnow', $scope.Booking).then(function(){

  });
  alert('Your cab in Advanced has booked');
}

}
