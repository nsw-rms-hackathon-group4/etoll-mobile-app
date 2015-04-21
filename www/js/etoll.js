angular.module('eTollTask1', ['ionic'])

    .controller('TodoCtrl', function ($scope) {
        $scope.onSuccess = function (position) {
            alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
        };

     $scope.onError = function (error) {
            alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        };
        console.log(" I am here Ready");

        ionic.Platform.ready(function () {
            console.log(" I am here Ready");
            navigator.geolocation.getCurrentPosition(onSuccess, onError);

        })

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    });