(function () {
    "use strict";
    var app = angular.module('eTollGeoLocation', ['ionic', 'ngCordova']);

    app.run(function ($ionicPlatform, backgroundGeolocationService) {


        $ionicPlatform.ready(function () {
            backgroundGeolocationService.configureBackgroundTask();

        });
    });


    app.service('backgroundGeolocationService', function ($timeout, $window, $interval, $cordovaLocalNotification, $cordovaGeolocation, $rootScope) {
        var notification = 1000;
        var posOptions = {timeout: 40000, enableHighAccuracy: true};
        var self = this;
        this.getCurrentGeoLocation = function () {
            console.log("Geo location %s", window.navigator.geolocation.getCurrentPosition);
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                console.log("Position is :" + position);
                self.addNotification(lat+":"+long);

            }, function (error) {
                console.log(error);
            }, posOptions);
        };

        this.addNotification = function (message) {
            $cordovaLocalNotification.add({
                id: notification,
                message: message
            });
            notification++;
        };

        this.startTracking = function () {
            self.getCurrentGeoLocation();
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

    app.controller('EtollGeoLocationController', function ($scope, $timeout, $cordovaBackgroundGeolocation,
                                                           $cordovaLocalNotification, $ionicPlatform) {


    });
})();
