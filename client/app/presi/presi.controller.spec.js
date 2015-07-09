'use strict';

describe('Controller: PresiCtrl', function () {

  // load the controller's module
  beforeEach(module('raApp'));

  var PresiCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PresiCtrl = $controller('PresiCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
