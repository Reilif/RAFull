'use strict';

angular.module('raApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $modal) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.url = '/api/users/download';

    $scope.open = function (user) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          user: function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function (data) {
        $scope.activate(data);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.download = function(user){
        window.open('/api/users/download/'+user._id);
    };

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.activate = function(data) {
      $http.put('/api/users/'+data.user._id+'/activation',data).success(function(data, status, headers, config) {
        data.activated = true;
      }).
        error(function(data, status, headers, config) {
        });
    };
  });

angular.module('raApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, user) {

  $scope.user = user;
  $scope.data = {};
  $scope.data.user = user;

  $scope.data.street = "PKI42";
  $scope.data.zip = "Minden";
  $scope.data.state = "NRW";
  $scope.data.country = "DE";
  $scope.data.idnr = "Robin Rasch";

  $scope.ok = function () {
    $modalInstance.close($scope.data);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
