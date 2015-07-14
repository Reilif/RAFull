'use strict';

angular.module('raApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, Alerts) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
            Alerts.addAlert('Du hast dich erfolgreich eingelogt','success');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
