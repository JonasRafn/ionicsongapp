angular.module('songhop', ['ionic', 'songhop.controllers'])

    .run(function ($ionicPlatform, $rootScope, $state, User) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


        });
    })


    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('splash', {
                url: '/',
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl',
                onEnter: function ($state, User) {
                    User.checkSession().then(function (hasSession) {
                        if (hasSession) $state.go('tab.discover');
                    });
                }
            })

            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabsCtrl',
                // don't load the state until we've populated our User, if necessary.
                resolve: {
                    populateSession: function (User) {
                        return User.checkSession();
                    }
                },
                onEnter: function ($state, User) {
                    User.checkSession().then(function (hasSession) {
                        if (!hasSession) $state.go('splash');
                    });
                }
            })

            .state('tab.discover', {
                url: '/discover',
                views: {
                    'tab-discover': {
                        templateUrl: 'templates/discover.html',
                        controller: 'DiscoverCtrl'
                    }
                }
            })

            .state('tab.favorites', {
                url: '/favorites',
                views: {
                    'tab-favorites': {
                        templateUrl: 'templates/favorites.html',
                        controller: 'FavoritesCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    })


    .constant('SERVER', {
        url: 'https://ionic-songhop.herokuapp.com'
    });