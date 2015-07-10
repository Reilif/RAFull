'use strict';

angular.module('raApp')
  .controller('MycertificatesCtrl', function ($scope,  $http, Auth) {
    $scope.certificates = [];
    var user = Auth.getCurrentUser();
    $scope.user = Auth.getCurrentUser();
    $scope.formdata={userid: user._id};

    $http.get('/api/certificatess/my/'+user._id).success(function(certificates) {
      $scope.certificates = certificates;
      console.log(certificates);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteCert = function(thing) {
      console.log("Revoke Zert");
      $http.delete('/api/certificatess/' + thing._id);
    };

    $scope.onSuccess = function(response){
      console.log(response);
    }

    $scope.download = function(cert){
      window.open('/api/certificatess/download/'+cert._id);
    };

  });
