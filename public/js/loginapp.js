/* global angular */
var app = angular.module('LoginApp', ['ngMaterial', 'ngMdIcons', 'ngStorage']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('red');
});

app.controller('LoginCtrl', function($scope, $http, $localStorage, $window, $interval) {
  $scope.loginTime = 3000;
  $scope.redirecting = false;
  $scope.$storage = $localStorage
  $scope.password = '';
  $scope.loginerror = false;
  var errMessages = [
    'YOU SHALL NOT PASS!',
    'Fel fel fel fel',
    'contraseña incorrecta',
    'väärä salasana',
    'Fel lösenord...',
    'Nix, försök igen',
    'Gissar du bara nu?',
    'Va puttenuttigt, men det är FEL!'
  ];
  console.log('loaded login controller');

  // Login func
  $scope.login = function() {
    $scope.errorMessage = errMessages[Math.floor(Math.random()*errMessages.length)];
    $http.post('authenticate', {'password': $scope.password}).then(function(result) {
      $scope.password = '';
      if (result.data.success) {
        $scope.redirecting = true;
        $scope.loginerror = false;
        $scope.$storage.token = result.data.token;
        $interval($scope.redirectClient,$scope.loginTime, false);
      }
      else {
        $scope.loginerror = true;
      }
    });
  }
  
  // Check if webtoken exists
  if ($scope.$storage.token) {
    console.log('token found logging in');
    $http.post('verifytoken', {'token': $scope.$storage.token}).then(function(result) {
      if (result.data.success) {
        $scope.redirecting = true;
        $scope.loginerror = false;
        $interval($scope.redirectClient,$scope.loginTime, false);
      }
      else {
        $scope.loginerror = true;
      }
    });
  }
  
  $scope.redirectClient = function() {
    console.log('running location now!');
    
    $window.location='/main'
  };
});