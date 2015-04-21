angular.module('eTollGeoLocation', ['ionic'])

    .controller('EtollGeoLocationController', function ($scope, $timeout) {
        $scope.onSuccess = function (position) {
            console.log('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
        };

        $scope.onError = function (error) {
            console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        };
        console.log(" I am here Ready");

        ionic.Platform.ready(function () {
            alert(" I am here Ready");
            navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError);
            var bgGeo = window.plugins.backgroundGeoLocation;
            alert(bgGeo);
          //  $scope.trackGeoLocation();
        });

        $scope.executeBackgroundTask = function () {
            var i = 0;
            alert(" I m here in Background")

        };
        document.addEventListener("deviceready", function () {
            navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError);
            var bgGeo = window.plugins.backgroundGeoLocation;
            alert(bgGeo);

        }, false);
        $scope.trackGeoLocation = function () {
            cordova.plugins.backgroundMode.setDefaults({text: 'Running Etoll Application in Background'});
            cordova.plugins.backgroundMode.enable();
            cordova.plugins.backgroundMode.onactivate = function () {
                $scope.executeBackgroundTask();
            }
        }

    });
