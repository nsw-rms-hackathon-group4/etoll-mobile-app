(function () {
    "use strict";
    var app = angular.module('eTollGeoLocation', ['ionic', 'ngCordova']);

    app.constant('ENV', {
        url: 'https://mobile-toll-api.herokuapp.com'
    });
    app.run(function ($ionicPlatform, backgroundGeolocationService) {
        $ionicPlatform.ready(function () {
            backgroundGeolocationService.configureBackgroundTask();

        });
    });

    app.service("tollLinkService", function ($rootScope, ENV, $q, $http) {

        var self = this;
        var isTollLinkLoaded = true;

        this.loadTollLinks = function () {
            return $q(function (resolve, reject) {
                var url =ENV.url + '/toll-gates';
                $http.get(url).success(function (data, status, headers, config) {
                    return resolve(data);

                }).error(function (data, status, headers, config) {
                    return reject(data);

                });
            });
        };

        this.isToll = function (latObj) {
            return $q(function (resolve) {
                console.log("Is Toll Link called %s, long:", latObj.lat, latObj.long);
                resolve({isToll: isTollLinkLoaded, lat: latObj.lat, long: latObj.long});
            });

        };
    });


    app.service('backgroundGeolocationService', function ($timeout, $window, $interval, $cordovaLocalNotification, $cordovaGeolocation,
                                                          tollLinkService, $rootScope, $q) {
        var notification = 1000;
        var posOptions = {timeout: 40000, enableHighAccuracy: true};
        var self = this;
        this.getCurrentGeoLocation = function () {
            console.log("Geo location %s", window.navigator.geolocation.getCurrentPosition);
            return $q(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    resolve({lat: lat, long: long});

                }, function (error) {
                    console.log(error);
                    reject(error);
                }, posOptions);
            });
        };

        this.addNotification = function (message) {
            $cordovaLocalNotification.add({
                id: notification,
                message: message
            });
            notification++;
        };

        this.startTracking = function () {
            self.getCurrentGeoLocation().then(tollLinkService.isToll, function (error) {
                $q.reject(error);
            }).then(function (isTollObj) {
                if (isTollObj.isToll) {
                    console.log("Received Latitude %s,longitude %s", isTollObj.lat, isTollObj.long);
                    self.addNotification(isTollObj.lat + ":" + isTollObj.long);
                }
            }, function (error) {
                console.error(error);
            });
        };

        this.configureBackgroundTask = function () {
            console.log("Configuring Background Task");
            window.plugin.backgroundMode.setDefaults({text: 'Tracking Toll on Background'});
            window.plugin.backgroundMode.enable();
            window.plugin.backgroundMode.onactivate = function () {
                console.log("Inside Background Task");
                $timeout(function () {

                    window.plugin.backgroundMode.configure({
                        text: "Tracking Toll Locations on Background"
                    });

                }, 5000);
                $interval(self.startTracking, 5000);
            };
            window.plugin.backgroundMode.onfailure = function (errorCode) {
                alert(errorCode);
            };

        };
        this.onError = function (error) {
            console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        };
    });
    app.controller('EtollGeoLocationController', function ($scope, tollLinkService) {
        console.log("Etoll Controller");
        $scope.toll = {};
        $scope.loadTolls = function () {
             tollLinkService.loadTollLinks().then(function(data){
                 console.log(data);
                 $scope.toll.tolls =data;
             });
        };
        $scope.loadTolls();


    });
})();
