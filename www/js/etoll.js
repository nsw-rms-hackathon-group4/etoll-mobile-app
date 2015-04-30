(function () {
    "use strict";
    var app = angular.module('eTollGeoLocation', ['ionic', 'ngCordova']);

    app.constant('ENV', {
        url: 'https://mobile-toll-api.herokuapp.com'
    });
    app.constant('_', window._);
    app.run(function ($ionicPlatform, backgroundGeolocationService) {
        $ionicPlatform.ready(function () {
            backgroundGeolocationService.configureBackgroundTask();

        });
    });

    function roundTo2Decimal(number) {
        return Math.round(number * 100) / 100
    }

    app.service("tollLinkService", function ($rootScope, ENV, $q, $http) {

        var self = this;
        var isTollLinkLoaded = false;
        var tolls = null;
        var tollItems = [];

        function createTollInfo(item, road) {
            return {
                long: item.longtitude,
                lat: item.latitude,
                place: item.name,
                road: road

            };
        }

        this.loadTollLinks = function () {
            return $q(function (resolve, reject) {
                var url = ENV.url + '/toll-gates';
                if (isTollLinkLoaded) {
                    return resolve(self.tolls);
                }
                $http.get(url).success(function (data, status, headers, config) {
                    self.tolls = data;
                    _.forEach(self.tolls, function (toll) {
                        console.log("Road is ", toll.road);
                        _.forEach(toll.gates, function (gate) {
                            tollItems.push(createTollInfo(gate, toll.road));
                        });
                    });

                    console.log("lat pair %s", tollItems);
                    console.log(tollItems);
                    isTollLinkLoaded = true;
                    return resolve(tolls);

                }).error(function (data, status, headers, config) {
                    return reject(data);

                });
            });
        };
        this.loadTollLinks().then(function (result) {
            console.log("result");
        });


        this.isCurrentLocationinToll = function (lat, long) {
            var roundedLat = roundTo2Decimal(lat);
            var roundedLong = roundTo2Decimal(long);
            var currentToll = null;
            _.forEach(tollItems, function (item) {
                var roundedItemLat = roundTo2Decimal(item.lat);
                var roundedItemLong = roundTo2Decimal(item.long);
                var diffLat = Math.abs(roundedItemLat - roundedLat);
                var diffLong = Math.abs(roundedItemLong - roundedLong);
                console.log("Item lat is %s long is %s current lat is %s long is % ", item.lat, item.long, lat, long);
                console.log(" Diff lat is  %s long is % ", diffLat, diffLong);
                if (diffLat <= 1&& diffLong <= 1) {
                    currentToll = item;
                }
            });
            return currentToll;

        };
        this.isToll = function (latObj) {
            return $q(function (resolve) {
                self.loadTollLinks().then(function (result) {
                    var toll = self.isCurrentLocationinToll(latObj.lat, latObj.long);
                    if (!_.isEmpty(toll)) {
                        resolve({isToll: true, lat: latObj.lat, long: latObj.long, place: toll.place, road: toll.road});
                    } else {
                        resolve({isToll: false, lat: latObj.lat, long: latObj.long});
                    }

                });
            });

        };

        this.createUserEntry = function (userTollObj) {

            return $http({method: "POST", url: ENV.url + "/add-entry", data: userTollObj});

        };

        this.createUserExit = function (userTollObj) {
            return $http({method: "POST", url: ENV.url + "/add-exit", data: userTollObj});
        };

        this.getTollCharge = function (userTollObj) {
          return $http({method: "POST", url: ENV.url + "/toll-charge", data: userTollObj});

        };

        this.getTollHistoryForUser = function (userId) {
            return $q(function (resolve, reject) {
                var url = ENV.url + '/toll-usage/' + userId;
                $http.get(url).success(function (data, status, headers, config) {
                    return resolve(data);

                }).error(function (data, status, headers, config) {
                    return reject(data);

                });
            });
        };

    });


    app.service('backgroundGeolocationService', function ($timeout, $window, $interval, $cordovaLocalNotification, $cordovaGeolocation,
                                                          tollLinkService, $rootScope, $q, _) {
        var notification = 1000;
        var posOptions = {timeout: 40000, enableHighAccuracy: true};
        var USER_ID = 12345;
        var self = this;
        self.userDetails = {};
        self.userDetails.isEnteredToll = false;
        self.userDetails.entry = null;

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

        this.addNotification = function (message,file) {
            $cordovaLocalNotification.add({
                id: notification,
                message: message,
                sound:file

            });
            notification++;
        };

        this.isExit = function (currentLatObj) {
            if (!_.isEmpty(self.userDetails.entry)) {

                var diffLat = Math.abs(roundTo2Decimal(self.userDetails.entry.lat) - roundTo2Decimal(currentLatObj.lat));
                var diffLong = Math.abs(roundTo2Decimal(self.userDetails.entry.long) - roundTo2Decimal(currentLatObj.long));
                if (diffLat >= 0.01 && diffLong >= 0.01) {
                    return true;
                }
            }
            return false;
        };
        this.trackTollEntryExit = function (currentLatObj, isTollObj) {

            if (self.isExit(currentLatObj)) {
                var exitLocation = currentLatObj.lat + ":" + currentLatObj.long;
                tollLinkService.createUserExit({
                    userId: USER_ID,
                    road: isTollObj.road,
                    exitPoint: exitLocation,
                    exitTime: new Date()
                }).then(function (exitResult) {
                    console.log("User Exit Registered Successfully.");
                    var tollChargeObj= exitResult.data;
                    tollChargeObj.userId =USER_ID;
                    tollLinkService.getTollCharge(tollChargeObj)
                        .then(function (result) {
                            self.addNotification("Exiting Toll .." + exitLocation,
                                "file://sound/toll-exit.mp3");
                            self.userDetails.entry = null;
                        }, function (error) {
                            console.error("Cannot charge failed ");
                        });


                }, function (error) {
                    console.error("An unexpected error occurred - no data was received %s", error);
                });


            } else if (_.isEmpty(self.userDetails.entry) && isTollObj.isToll) {
                console.log("Received Entering Latitude %s,longitude %s", isTollObj.lat, isTollObj.long);
                self.userDetails.entry = currentLatObj;
                tollLinkService.createUserEntry({
                    userId: USER_ID,
                    road: isTollObj.road,
                    entryPoint: isTollObj.place,
                    entryTime: new Date()
                }).then(function (tollResult) {
                    console.log("User Entry Registered Successfully.");
                    self.addNotification("Entering Toll .." + isTollObj.road + "-" + isTollObj.place,
                        "file://sound/toll-entry.mp3");
                }, function (error) {
                    console.error("An unexpected error occurred - no data was received %s", error);

                });
            }
            console.log("Cannot send notification now... Its not in toll");
        };
        this.startTracking = function () {
            var currentLatObj = null;
            self.getCurrentGeoLocation().then(function (latObj) {
                currentLatObj = latObj;
                console.log(currentLatObj);
                return tollLinkService.isToll(latObj)
            }, function (error) {
                $q.reject(error);
            }).then(function (isTollObj) {
                self.trackTollEntryExit(currentLatObj, isTollObj);
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
            tollLinkService.loadTollLinks().then(function (data) {
                console.log(data);
                $scope.toll.tolls = data;
            });
        };
        $scope.loadTolls();
    });
})();
