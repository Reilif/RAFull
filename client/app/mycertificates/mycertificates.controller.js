'use strict';

angular.module('raApp')
  .controller('MycertificatesCtrl', function ($scope) {
    $scope.certificates = [];

    $http.get('/api/certificatess').success(function(certificates) {
      $scope.certificates = certificates;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
