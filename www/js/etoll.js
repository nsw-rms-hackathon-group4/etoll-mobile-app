(function () {
    "use strict";
    var app = angular.module('eTollGeoLocation', ['ionic', 'ngCordova']);

    app.run(function ($ionicPlatform, backgroundGeolocationService) {
        $ionicPlatform.ready(function () {

            backgroundGeolocationService.configureBackgroundTask();
        });
    });

    app.service('backgroundGeolocationService', function ($timeout, $window, $interval, $cordovaLocalNotification, $cordovaGeolocation) {
            var notification = 1000;
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            var self = this;

            this.getCurrentPosition = function () {
                return $cordovaGeolocation
                    .getCurrentPosition(posOptions);

            }

            this.addNotification = function (message) {
                $cordovaLocalNotification.add({
                    id: notification,
                    message: message
                });
                notification++;
            };

            this.startTracking = function () {
                alert(" I am trying to track...");
                return self.getCurrentPosition().then(function (position) {
                    (function () {
                        "use strict";
                        var app = angular.module('eTollGeoLocation', ['ionic', 'ngCordova']);

                        app.run(function ($ionicPlatform, backgroundGeolocationService) {
                            $ionicPlatform.ready(function () {

                                backgroundGeolocationService.configureBackgroundTask();
                            });
                        });

                        app.service('backgroundGeolocationService', function ($timeout, $window, $interval, $cordovaLocalNotification, $cordovaGeolocation) {
                                var notification = 1000;
                                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                                var self = this;

                                this.getCurrentGeoLocation = function () {
                                    console.log("Geo location %s",  $cordovaGeolocation
                                        .getCurrentPosition(posOptions));
                                     $cordovaGeolocation
                                        .getCurrentPosition(posOptions).then(function(position){
                                             var lat = position.coords.latitude;
                                             var long = position.coords.longitude;
                                             console.log("Position is :" + position);
                                             self.addNotification(lat + long);
                                         },function(error){

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
                                    alert(" I am trying to tracksss...");
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

                                this.onError =
                                    function (error) {
                                        console.log('code: ' + error.code + '\n' +
                                        'message: ' + error.message + '\n');
                                    };

                            }
                        )
                        ;
                        app.controller('EtollGeoLocationController', function ($scope, $timeout, $cordovaBackgroundGeolocation,
                                                                               $cordovaLocalNotification) {
                            var options = {

                                desiredAccuracy: 10,
                                stationaryRadius: 20,
                                distanceFilter: 30,
                                notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
                                notificationText: 'ENABLED', // <-- android only, customize the text of the notification
                                activityType: 'AutomotiveNavigation',
                                debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
                                stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
                            };

                            // `configure` calls `start` internally
                            //$cordovaBackgroundGeolocation.configure(options)
                            //    .then(
                            //    null, // Background never resolves
                            //    function (err) { // error callback
                            //        console.error(err);
                            //    },
                            //    function (location) { // notify callback
                            //        console.log(location);
                            //        $cordovaLocalNotification.add({
                            //            id: '1',
                            //            message: "Push!!" + i + location,
                            //        });
                            //    });
                        });

                    })
                    ();
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    self.addNotification(lat + long);
                }, function (error) {

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

            this.onError =
                function (error) {
                    console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
                };

        }
    )
    ;
    app.controller('EtollGeoLocationController', function ($scope, $timeout, $cordovaBackgroundGeolocation,
                                                           $cordovaLocalNotification) {
        var options = {

            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
            notificationText: 'ENABLED', // <-- android only, customize the text of the notification
            activityType: 'AutomotiveNavigation',
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
        };

        // `configure` calls `start` internally
        //$cordovaBackgroundGeolocation.configure(options)
        //    .then(
        //    null, // Background never resolves
        //    function (err) { // error callback
        //        console.error(err);
        //    },
        //    function (location) { // notify callback
        //        console.log(location);
        //        $cordovaLocalNotification.add({
        //            id: '1',
        //            message: "Push!!" + i + location,
        //        });
        //    });
    });

})
();