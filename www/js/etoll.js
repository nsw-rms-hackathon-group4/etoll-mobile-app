(function () {
    "use strict";
    var app = angular.module('eTollGeoLocation', ['ionic', 'ngCordova']);

    app.run(function ($ionicPlatform, backgroundGeolocationService,$cordovaLocalNotification) {
        $ionicPlatform.ready(function () {
            alert(" I am here Ready");
            $cordovaLocalNotification.add({
                id: '1',
                message: "Push!!"
            })
        });
    });

    app.service('backgroundGeolocationService', function ($timeout, $cordovaBackgroundGeolocation) {
        this.onSuccess = function (position) {
            console.log('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
        };

        this.configureBackgroundTask = function (geoLocation) {
            $cordovaBackgroundGeolocation.configure(options)
                .then(
                null, // Background never resolves
                function (err) { // error callback
                    console.error(err);
                },
                function (location) { // notify callback
                    console.log(location);
                });


            this.stopBackgroundGeolocation = function () {
                $cordovaBackgroundGeolocation.stop();
            };
        };

        this.onError =
            function (error) {
                console.log('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
            };

    });
    app.controller('EtollGeoLocationController', function ($scope, $timeout, $cordovaGeolocation) {
        //var posOptions = {timeout: 1, enableHighAccuracy: false};
        //$cordovaGeolocation
        //    .getCurrentPosition(posOptions)
        //    .then(function (position) {
        //        var lat = position.coords.latitude;
        //        var long = position.coords.longitude;
        //        alert(lat);
        //
        //        console.log(lat + "long" + long);
        //    }, function (err) {
        //        // error
        //        alert(err);
        //    });
        //

    });

})();