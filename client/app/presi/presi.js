'use strict';

angular.module('raApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('presi', {
        url: '/presi',
        templateUrl: 'app/presi/slides-certificate-authority.html'
      });
  });
