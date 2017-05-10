'use strict';

CabDriver.$inject = ['$http'];

function CabDriver($http){
  var _this = this;



  _this.getcabDriver = function () {

    return $http({
      method: 'GET',
      url: '/cabr/getCabr',
    })
    .then(function (response){
      console.log(response);
      return response.data;
    })
    .catch(function(error){
      throw error;
    });
  };

_this.addcabDriver = function(cabr) {

  return $http ({
    method: 'POST',
    url: '/cabr/addCabr',
    data: cabr,
  })
  .then(function(response){
    return response.data;
  })
  .catch(function(error){
    return error;
  });
};


_this.deletecabDriver = function(cabr) {
  return $http.delete('/cabr/deleteCabr/'+ cabr._id)
      .then(function(response){
        return response.data;
      })
      .catch(function(error){
        throw error;
      });
};

_this.getcabDriverDetail = function () {

  return $http({
    method: 'GET',
    url: '/user/getUser',
  })
  .then(function (response){
    console.log(response);
    return response.data;
  })
  .catch(function(error){
    throw error;
  });
};

_this.addDriverDetail = function(dvrd) {

  return $http ({
    method: 'POST',
    url: '/user/addUsers',
    data: dvrd,
  })
  .then(function(response){
    return response.data;
  })
  .catch(function(error){
    return error;
  });
};

_this.deleteDriverDetail = function(dvrd) {
  return $http.delete('/user/deleteUser/'+ dvrd._id)
      .then(function(response){
        return response.data;
      })
      .catch(function(error){
        throw error;
      });
};


}

module.exports = CabDriver;
