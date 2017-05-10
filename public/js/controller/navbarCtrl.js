module.exports = function($scope, $http, $rootScope, Auth, $sessionStorage, $cookies){

// var nav  = this;
$scope.userName = '';
$scope.UserType = '';
$scope.isLoggedIn = false;
contr();

function contr(){
  var authUser = $cookies.getObject('authUser');
  if (authUser != undefined) {
    var loggedInUser  = authUser.currentUser.userInfo;
    var isLoggedIn = authUser.currentUser.isLoggedIn;
    if(isLoggedIn) {
      $scope.isLoggedIn = isLoggedIn;
      $scope.userName = loggedInUser.name;
      $scope.UserType = loggedInUser.UserType;

    }
  }else {
    $scope.isLoggedIn = false;
  }
}

$scope.Login = function() {
  contr();
}

$rootScope.$on('loginuser', function(){
  $scope.Login();
});

$scope.logout = function() {
  Auth.Logout();
  $scope.isLoggedIn = false;
}

}
