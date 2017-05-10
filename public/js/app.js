'use strict';

// window.$ = window.jQuery = require('jquery');

var angular = require('angular');
              require('angular-route');
            //require('../node_modules/angular-swx-session-storage');
           require('ngstorage');
           require('angular-cookies');

var app = angular.module('myApp', ['ngRoute', 'ngCookies', 'ngStorage']);


require('./vendor/angular-cookies.min.js');
require('./vendor/ngStorage.min.js');
// require('../css/foundation.min.css');
// require('../css/bootstrap.min.css');
require('../css/app.css');
// require('../css/wickedpicker.min.css');
// require('../css/font-awesome.min.css');
require('./controller');
require('./service');
require('./directives');
// require('./vendor/bootstrap.min.js');
// require('./vendor/what-input.js');
// require('./vendor/foundation.min.js');
// $(document).foundation();


app.config(function ($routeProvider, $locationProvider){
  $routeProvider

  .when("/home", {
    templateUrl: 'views/home.html',
    controller: 'HomeController',
  })

  .when("/admin", {
    templateUrl: 'views/admin.html',
    controller: 'AdminController',
  })

  .when("/login", {
    templateUrl: 'views/login.html',
    controller: 'LoginController',
  })

  .when("/register", {
    templateUrl: 'views/register.html',
    controller: 'RegisterController',
  })

  .when("/unauth", {
    templateUrl: 'views/unauth.html',
    // controller: 'RegisterController',
  })

  .when("/driver", {
    templateUrl: 'views/driver.html',
    controller: 'DriverController',
  })

  .when("/navbar", {
    templateUrl: 'views/navbar.html',
    controller: 'NavbarController',
  })
  .when("/booking", {
    templateUrl: 'views/booking.html',
    controller: 'BookingController',
  })
  .when("/changePassword", {
    templateUrl: 'views/changePassword.html',
    controller: 'PasswordController',
  })
  .when("/myride", {
    templateUrl: 'views/myride.html',
    controller: 'MyRideController',
  })

  .otherwise({
    redirectTo : '/home',
  });
});




app.run(function($rootScope, $http, $location, $sessionStorage, $cookies) {
    if ($sessionStorage.tokenDetails) {
        $http.defaults.headers.common.Authorization = $sessionStorage.tokenDetails.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        var publicPages = ['/home','/', '/login', '/register'];
        var AdminPages = ['/home' , '/' , '/admin'];
        var CustomerPages = ['/booking', '/myride' , '/' , '/home' , '/bookingConfirm' , '/changePassword'];
        var DriverPages = ['/driver' , '/myride' , '/' ,'/changePassword', '/home'];
        var authUser = $cookies.getObject('authUser');
        if (authUser != undefined) {
            var loggedInUser = authUser.currentUser.userInfo;
        }
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$sessionStorage.tokenDetails && $location.path() != '') {
            $location.path('/login');
        }else {
          if(authUser != undefined) {
            if(authUser.currentUser.userInfo.UserType == 'Admin'){
              var admin  = AdminPages.indexOf($location.path()) === -1;
              if(admin) {
                $location.path('/unauth');
              }
            }
            if (authUser.currentUser.userInfo.UserType == 'Customer'){
              var Customer = CustomerPages.indexOf($location.path()) === -1;
              if(Customer){
                $location.path('/unauth');
              }
            }
            if (authUser.currentUser.userInfo.UserType == 'Driver'){
              var Driver = DriverPages.indexOf($location.path()) === -1;
              if(Driver){
                $location.path('/unauth');
              }
            }
          }
        }
        // console.log(restrictedPage);
        // console.log($sessionStorage.tokenDetails);
    });
});


if (module.hot) {
      module.hot.accept();
}
