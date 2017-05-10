module.exports = function($http, $scope, $rootScope, $cookies){


  var authUser = $cookies.getObject('authUser');

  var loggedInUser = authUser.currentUser.userInfo;

var name = document.getElementById('name').innerHTML = loggedInUser.name;
var MobileNumber = document.getElementById('Mno.').innerHTML = loggedInUser.mobile;
var Email = document.getElementById('Email').innerHTML = loggedInUser.Email;


  $http.get('/user/getUser/' + Email).success(function(response){
    var res = response;
    console.log(res);
  });

  $scope.changePassword = function(){
    $http
  }
}
