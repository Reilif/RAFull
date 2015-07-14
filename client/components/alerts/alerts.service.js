'use strict';

angular.module('raApp')
  .factory('Alerts', function () {
    var alerts = [
      {type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'},
      {type: 'success', msg: 'Well done! You successfully read this important alert message.'}
    ];


    return {
      addAlert: function (msg, type) {
        alerts.push({type: type, msg: msg});
      },

      closeAlert: function (index) {
        $scope.alerts.splice(index, 1);
      },
      getAlert: function(){
        return alerts;
      }
    }
  });
