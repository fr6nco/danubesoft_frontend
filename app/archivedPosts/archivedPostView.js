'use strict';

//TODO
angular.module('danubeSoftApp.archivedPostView', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/archived', {
                    templateUrl: 'archivedPosts/archivedView.html',
                    controller: 'archivedViewCtrl'
                });
            }])

        .controller('archivedViewCtrl', ['$scope', function ($scope) {
                var news = null;

                var init = function () {
                    if (!$scope.data) {
                        $scope.data = {}
                    }
                    $scope.data.archive = {};
                    $scope.data.archive.posts = {};
                    $scope.data.archive.post_loading = true;
                    news = firebase.database().ref('/news/archived/');
                };

                var safeApply = function (fn) {
                    var phase = $scope.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof (fn) === 'function')) {
                            fn();
                        }
                    } else {
                        $scope.$apply(fn);
                    }
                };

                var removeEntry = function (ref, error_msg, callback) {
                    firebase.database().ref(ref).remove(function (error) {
                        if (error) {
                            console.log(error_msg + ' ' + error);
                        }
                        if (callback !== 'undefined' && callback !== null) {
                            callback();
                        }
                        return;
                    });
                };

                var addEntry = function (ref, object, error_msg, callback) {
                    firebase.database().ref(ref).set(object, function (error) {
                        if (error) {
                            console.log(error_msg + ' ' + error);
                        }
                        if (callback !== 'undefined' && callback !== null) {
                            callback();
                        }
                        return;
                    });
                };

                $scope.deletePost = function (id) {
                    removeEntry('/news/archived/' + id, 'Failed to remove post from archived section', null);
                };

                init();

                news.on('value', function (snapshot) {
                    $scope.data.archive.posts = snapshot.val();
                    for(var key in $scope.data.archive.posts) {
                        $scope.data.archive.posts[key].timestamp = Date.parse($scope.data.archive.posts[key].date);
                        $scope.data.archive.posts[key].firebase_id = key; 
                    }
                    safeApply(function () {
                        $scope.data.archive.post_loading = false;
                    });
                }, function (error) {
                    console.log(error);
                });
            }]);