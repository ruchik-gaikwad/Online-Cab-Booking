'use strict';

Tariff.$inject = ['$http'];


function Tariff($http){
  var _this = this;

  _this.getTariff = function () {

    return $http({
      method: 'GET',
      url: '/tarif/getTrf',
    })
    .then(function (response){
      console.log(response);
      return response.data;
    })
    .catch(function(error){
      throw error;
    });

  };

  _this.addTariff = function(Trf) {

    return $http ({
      method: 'POST',
      url: '/tarif/addTrf',
      data: Trf,
    })
    .then(function(response){
      return response.data;
    })
    .catch(function(error){
      return error;
    });
  };

  _this.deleteTariff = function(Trf) {
    return $http.delete('/tarif/deleteTrf/'+ Trf._id)
        .then(function(response){
          return response.data;
        })
        .catch(function(error){
          throw error;
        });
  };

}

module.exports = Tariff;
