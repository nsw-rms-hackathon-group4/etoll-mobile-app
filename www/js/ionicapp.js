"use strict";
var ionicApp = angular.module('ionicApp', ['ionic', 'eTollGeoLocation']);
ionicApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/sign-in.html',
            controller: 'SignInCtrl'
        }).state('tollgates', {
            url: '/tollgates',
            templateUrl: 'templates/toll-gates.html',
            controller: 'EtollGeoLocationController'
        })
        .state('forgotpassword', {
            url: '/forgot-password',
            templateUrl: 'templates/forgot-password.html'
        })
        .state('Register', {
            url: '/Register',
            templateUrl: 'templates/Register.html',
            controller: 'SignInCtrl'
        })
        .state('forgotpasswordEmail', {
            url: '/forgot-passwordEmail',
            templateUrl: 'templates/forgot-passwordEmail.html'
        })
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('tabs.home', {
            url: '/home',
            views: {
                'home-tab': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeTabCtrl'
                }
            }
        })
        .state('tabs.facts', {
            url: '/facts',
            views: {
                'home-tab': {
                    templateUrl: 'templates/facts.html'
                }
            }
        })
        .state('tabs.facts2', {
            url: '/facts2',
            views: {
                'home-tab': {
                    templateUrl: 'templates/facts2.html'
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
        })
        .state('tabs.navstack', {
            url: '/navstack',
            views: {
                'about-tab': {
                    templateUrl: 'templates/nav-stack.html'
                }
            }
        })
        .state('search', {
            url: '/search',
            templateUrl: 'search.html'
        })
         .state('settings', {
             url: '/settings',
             templateUrl: 'settings.html'
         })
        .state('tabs.contact', {
            url: '/contact',
            views: {
                'contact-tab': {
                    templateUrl: 'templates/contact.html'
                }
            }
        });


    $urlRouterProvider.otherwise('/sign-in');

});

ionicApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);


ionicApp.controller('SignInCtrl', function ($scope, $state) {

    $scope.signIn = function (user) {
        console.log('Sign-In', user);
        $state.go('tabs.home');
    };
});
ionicApp.controller('repeatController', function ($scope, tollLinkService) {
    console.log('Repeat Controller');
    
    tollLinkService.getTollHistoryForUser(12345).then(function (data) {
        $scope.items = data;        
    });
    //$scope.items = [{ road: 'Road1' }, {road: 'Road2'}];
});
ionicApp.controller('HomeTabCtrl', function ($scope, tollLinkService) {
    console.log('HomeTabCtrl');
    $scope.items = {};
    $scope.init = function(){
        $scope.items =tollLinkService.getTollHistoryForUser(12345);
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

