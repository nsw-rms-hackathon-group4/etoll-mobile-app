"use strict";
var ionicApp = angular.module('ionicApp', ['ionic', 'eTollGeoLocation']);
ionicApp.constant('USER_ID', 12345);
ionicApp.constant('_',window._);
ionicApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('tabs.home', {
            url: '/home',
            views: {
                'home-tab': {
                    templateUrl: 'templates/home.html'
                }
            }
        }).state('tabs.tollgates', {
            url: '/tollgates',
            views: {
                'tollgates': {
                    templateUrl: 'templates/toll-gates.html'
                }
            }
        })
        .state('tabs.about', {
            url: '/about',
            views: {
                'about-tab': {
                    templateUrl: 'templates/about.html'
                }
            }
        });
    $urlRouterProvider.otherwise("/tab/home");

});

ionicApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);


ionicApp.controller('SignInCtrl', function ($scope, $state) {

    $scope.signIn = function (user) {
        console.log('Sign-In', user);

    };
});

ionicApp.controller('HomeTabCtrl', function ($scope, tollLinkService, USER_ID,_) {
    console.log('HomeTabCtrl');
    $scope.userId=USER_ID;
    $scope.items = [];
    $scope.init = function () {
         tollLinkService.getTollHistoryForUser(USER_ID).then(function(data){
             $scope.items = _.sortByOrder(data,['entryTime'],false);

         });
    };
    $scope.refresh =function(){
        $scope.init();
    };
    $scope.init();
});
ionicApp.controller('NavCtrl', function ($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
});

