'use strict';

// require('../vendor/angular-cookies.min.js');
// require('../vendor/ngStorage.min.js');
//
// Auth.$inject = ['$http', '$cookies', '$sessionStorage'];

module.exports = function ($http, $window, $cookies, $sessionStorage) {

  var service = {};

  service.Login = Login;
  service.Logout = Logout;

  return service;

  function Login (user, callback){
    $http.post('/user/login', user)
    .then (function(response){
      if (response.data.success && response.data.token) {
        $sessionStorage.tokenDetails = {
          token: response.data.token
        };
        // sessionStorage.setItem ('token', response.data.token);
        $http.defaults.headers.common.Authorization =  response.data.token;
          var obj = {
            currentUser: {
              isLoggedIn: true,
              userInfo: {
                id : response.data.userDetail._id,
                name : response.data.userDetail.FirstName,
                mobile: response.data.userDetail.MobileNumber,
                UserType : response.data.userDetail.UserType,
                Email: response.data.userDetail.Email
              }
            }
          };
          // document.cookie =
          $cookies.putObject('authUser', obj);
        callback(response);
      }else {
        callback(response);
      }
    });
  }

function Logout() {
  delete $sessionStorage.tokenDetails;
  $http.defaults.headers.common.Authorization = '';
  $cookies.remove('authUser');
}

}

// module.exports = Auth;
