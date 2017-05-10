'use strict';

var app = require('angular').module('myApp');

app.controller('HomeController', require('./homeCtrl'));
app.controller('AdminController', require('./adminCtrl'));
app.controller('LoginController', require('./loginCtrl'));
app.controller('RegisterController', require('./registerCtrl'));
app.controller('NavbarController', require('./navbarCtrl'));
app.controller('BookingController', require('./bookingCtrl'));
app.controller('DriverController', require('./driverCtrl'));
app.controller('PasswordController', require('./passCtrl'));
app.controller('MyRideController', require('./myrideCtrl'));
