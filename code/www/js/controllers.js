angular.module('songhop.controllers', ['ionic', 'songhop.services', 'ionic.contrib.ui.tinderCards'])

    .directive('noScroll', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $element.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })

    /*
     Controller for the discover page
     */
    .controller('DiscoverCtrl', function ($scope, $ionicLoading, $timeout, Recommendations, User) {

        var showLoading = function () {
            $ionicLoading.show({
                template: '<i class="ion-loading-c"></i>',
                noBackdrop: true
            });
        };

        var hideLoading = function () {
            $ionicLoading.hide();
        };

        showLoading();

        Recommendations.init()
            .then(function () {

                $scope.currentSong = Recommendations.queue[0];
                $scope.songs = Recommendations.queue;

                return Recommendations.playCurrentSong();

            })
            .then(function () {
                hideLoading();
                $scope.currentSong.loaded = true;
            });


        $scope.sendFeedback = function (bool) {

            if (bool) User.addSongToFavorites($scope.currentSong);

            $scope.currentSong.rated = bool;
            $scope.currentSong.hide = true;

            Recommendations.nextSong();

            $timeout(function () {
                $scope.currentSong = Recommendations.queue[0];
                $scope.songs = Recommendations.queue;
                $scope.currentSong.loaded = false;

            }, 250);

            Recommendations.playCurrentSong().then(function () {
                $scope.currentSong.loaded = true;

            });

        };


        $scope.nextAlbumImg = function () {
            if (Recommendations.queue.length > 1) {
                return Recommendations.queue[1].image_large;
            }

            return '';
        };

    })





    /*
     Controller for the favorites page
     */
    .controller('FavoritesCtrl', function ($scope, $window, User) {
        $scope.favorites = User.favorites;
        $scope.username = User.username;

        $scope.removeSong = function (song, index) {
            User.removeSongFromFavorites(song, index);
        };

        $scope.openSong = function (song) {
            $window.open(song.open_url, "_system");
        };

    })


    /*
     Controller for our tab bar
     */
    .controller('TabsCtrl', function ($scope, $window, User, Recommendations) {
        $scope.favCount = User.favoriteCount;

        $scope.enteringFavorites = function () {
            User.newFavorites = 0;
            Recommendations.haltAudio();
        };

        $scope.leavingFavorites = function () {
            Recommendations.init();
        };

        $scope.logout = function () {
            User.destroySession();

            $window.location.href = '/';
        };

    })


    /*
     Controller for the splash page
     */
    .controller('SplashCtrl', function ($scope, $state, User) {
        $scope.submitForm = function (username, signingUp) {
            User.auth(username, signingUp).then(function () {
                $state.go('tab.discover');

            }, function () {
                alert('Hmm... try another username.');

            });
        };

    });