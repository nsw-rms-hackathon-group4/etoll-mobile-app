angular.module('ionicApp', ['ionic'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/sign-in.html',
                controller: 'SignInCtrl'
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
            .state('tabs.contact', {
                url: '/contact',
                views: {
                    'contact-tab': {
                        templateUrl: 'templates/contact.html'
                    }
                }
            });


        $urlRouterProvider.otherwise('/sign-in');

    })

    .controller('SignInCtrl', function ($scope, $state) {

        $scope.signIn = function (user) {
            console.log('Sign-In', user);
            $state.go('tabs.home');
        };

    })
    .controller('repeatController', function ($scope) {
        var items = [{ "DateTime": "1/1/2015","Place":"Parramatta", "Lane":"M5","Toll":"$10" },
            { "DateTime": "1/2/2015", "Place": "Liverpool", "Lane": "M4", "Toll": "$11" },
            { "DateTime": "1/3/2015", "Place": "Westmead", "Lane": "M7", "Toll": "$12" }
        ];
        $scope.items = items;
    })
    .controller('HomeTabCtrl', function ($scope) {
        console.log('HomeTabCtrl');
    });
