'use strict';

angular.module('raApp').controller('AlertDemoCtrl', function ($scope, Alerts) {
  $scope.alerts = Alerts.getAlert();
  $scope.closeAlert = function(index) {
    Alerts.closeAlert(index);
  };
});
