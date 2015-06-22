'use strict';

angular.module('raApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mycertificates', {
        url: '/mycertificates',
        templateUrl: 'app/mycertificates/mycertificates.html',
        controller: 'MycertificatesCtrl'
      });
  });