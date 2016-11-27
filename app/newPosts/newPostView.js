'use strict';

angular.module('danubeSoftApp.newPostView', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/new', {
                    templateUrl: 'newPosts/newView.html',
                    controller: 'newPostsController'
                });
            }])

        .controller('newPostsController', ['$scope', function ($scope) {

                var news = null;

                var init = function () {
                    if (!$scope.data) {
                        $scope.data = {}
                    }
                    $scope.data.new = {};
                    $scope.data.new.posts = {};
                    $scope.data.new.post_loading = true;
                    news = firebase.database().ref('news/new/');
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
                
                var removeEntry = function(ref, error_msg, callback) {
                    firebase.database().ref(ref).remove(function(error) {
                        if(error) {
                            console.log(error_msg + ' ' + error);
                        }
                        if (callback !== 'undefined' && callback !== null){
                            callback();
                        }
                        return;
                    });
                };
                
                var addEntry = function(ref, object, error_msg, callback) {
                    firebase.database().ref(ref).set(object, function(error) {
                        if (error) {
                            console.log(error_msg + ' ' + error);
                        }
                        if (callback !== 'undefined' && callback !== null) {
                            callback();
                        }
                        return;
                    });
                };
                
                $scope.archivePost = function(id) {                    
                    var toArchive = $scope.data.new.posts[id];
                    
                    var post = {
                        "body": toArchive.body,
                        "date": toArchive.date,
                        "title": toArchive.title
                    }
                    
                    addEntry('/news/archived/' + id, post, 'Failed to add post to archived', function() {
                        removeEntry('/news/new/' + id, 'Failed to remove post from new section', null);
                    }); 
                };

                init();

                news.on('value', function (snapshot) {
                    $scope.data.new.posts = snapshot.val();
                    for(var key in $scope.data.new.posts) {
                        $scope.data.new.posts[key].timestamp = Date.parse($scope.data.new.posts[key].date);
                        $scope.data.new.posts[key].firebase_id = key; 
                    }
                    safeApply(function () {
                        $scope.data.new.post_loading = false;
                    });
                }, function (error) {
                    console.log(error);
                });

            }]);