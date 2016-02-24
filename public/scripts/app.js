var app = angular.module('authSampleApp', ['ngRoute', 'satellizer']);

app.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
    	.when('/', {
    		templateUrl: 'templates/home.html'
    	})
    	.when('/signup', {
    		templateUrl: 'templates/signup.html',
        controller: 'AuthCtrl'
    	})
    	.when('/login', {
    		templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
    	})
      .when('/profile', {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
]);

app.controller('MainCtrl', ['$scope', '$auth', '$http', '$location',
	function ($scope, $auth, $http, $location) {
    $scope.isAuthenticated = function() {
      $http.get('/api/me', {}).then(
        function (data){
          console.log(data);
          $scope.currentUser = data.data;
        }, function(error){
          console.log("error!");
          console.log(error);
          $auth.removeToken();
        });
    };

    $scope.isAuthenticated();

    $scope.logout = function() {
      $auth.logout();
      $auth.removeToken();
      $scope.currentUser = null;
      $location.path('/login');
    };
  }]
);

app.controller('AuthCtrl', ['$scope', '$auth', '$location',
  function ($scope, $auth, $location) {
    if ($scope.currentUser) {
      $location.path('/profile');
      $scope.user = {};
    }

    $scope.signup = function() {
      var user = $scope.user;

      $auth.signup(user)
        .then(function(response) {
          console.log(response);
          $auth.setToken(response.token);
          $scope.isAuthenticated();
          $scope.user = {};
          $location.path('/profile');
        })
        .catch(function(response) {
          console.log(response);
          // Handle errors here.
        });
    };

    $scope.login = function() {
      var user = $scope.user;

      $auth.login(user)
        .then(function(response) {
          console.log(response);
          $auth.setToken(response.token);
          $scope.isAuthenticated();
          $scope.user = {};
          $location.path('/profile');
        })
        .catch(function(response) {
          console.log(response);
          // Handle errors here, such as displaying a notification
          // for invalid email and/or password.
        });
    };
  }]
);

app.controller('ProfileCtrl', ['$scope', '$http', '$location', '$auth',
	function ($scope, $http, $location, $auth) {
    if(!$auth.getToken()) {
      $location.path('/login');
    }
  }
]);





