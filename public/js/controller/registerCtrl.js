module.exports = function ($scope, $http){


  $scope.reg = function (){
    $scope.user.UserType = 'Customer';
    $http.post('/user/register', $scope.user).then(function(data){

      if (data.data.success){
        $scope.alert = 'alert alert-success';
        $scope.message = data.data.message;
      }else {
        $scope.alert = 'alert alert-danger';
        $scope.message = data.data.message;
      }

    });
  }

};
