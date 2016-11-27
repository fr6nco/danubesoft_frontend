'use strict';

// Declare app level module which depends on views, and components
angular.module('danubeSoftApp', [
  'ngRoute',
  'danubeSoftApp.newPostView',
  'danubeSoftApp.archivedPostView',
  'angular-toArrayFilter',
  'ngOrderObjectBy'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/new'});
}]);
