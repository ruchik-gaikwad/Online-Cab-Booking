module.exports = function ($http, $parse, $location, $sessionStorage, $cookies) {

  return {
    restrict : 'E',
    templateUrl : '../views/navbar.html',
    controller : 'NavbarController'

  };
};
