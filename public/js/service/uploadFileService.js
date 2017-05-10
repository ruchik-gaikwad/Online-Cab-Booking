module.exports = function($http){


this.upload = function(file) {
    var fd = new FormData();
    fd.append('myfile', file.upload);
    return $http.post('/cabr/upload', fd, {
      transformRequest : angular.identity,
      headers : {'Content-Type' : undefined }
    });
};

}
