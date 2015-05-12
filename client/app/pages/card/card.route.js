(function () {
    'use strict';

    function routes($stateProvider) {
        //noinspection JSUnusedGlobalSymbols
        $stateProvider
            .state('card', {
                url: '/scroll',
                views: {
                    body: {
                        templateUrl: 'app/pages/card/card.html',
                        controller: 'CardCtrl',
                        controllerAs: 'ct',
                        resolve: {
                            ScrollsDecks: function (ScrollsDecks) {
                                return ScrollsDecks.promise;
                            },
                            Cards: function (Cards) {
                                return Cards.promise;
                            }
                        }
                    },
                    side: {
                        templateUrl: 'app/pages/card/card-left.html'
                    },
                    bar: {
                        templateUrl: 'app/pages/card/card-bar.html',
                        controller: 'LeftCardBookmarksCtrl',
                        controllerAs: 'barCtrl'
                    }
                }
            })
            .state('card.id', {
                url: '/:id'
            });
    }

    angular.module('app').config(routes);
})();
