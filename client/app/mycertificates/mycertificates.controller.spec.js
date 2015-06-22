'use strict';

describe('Controller: MycertificatesCtrl', function () {

  // load the controller's module
  beforeEach(module('raApp'));

  var MycertificatesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MycertificatesCtrl = $controller('MycertificatesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
