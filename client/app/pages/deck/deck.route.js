(function () {
    'use strict';

    function routes($stateProvider) {
        $stateProvider
            .state('deck', {
                url: '/deck',
                abstract: true,
                views: {
                    body: {
                        templateUrl: 'app/pages/deck/deck.html',
                        controller: 'DeckCtrl',
                        controllerAs: 'cardsCtrl',
                        resolve: {
                            Decks: function (Decks) {
                                return Decks.promise;
                            },
                            Cards: function (Cards) {
                                return Cards.promise;
                            }
                        }
                    },
                    side: {
                        templateUrl: 'app/pages/deck/deck-left.html',
                        controller: 'LeftDeckCtrl',
                        controllerAs: 'ct',
                        resolve: {
                            Scrolls: function (Scrolls) {
                                return Scrolls.promise;
                            },
                            Cards: function (Cards) {
                                return Cards.promise;
                            }
                        }
                    },
                    bar: {
                        templateUrl: 'app/layout/bar.html'
                    }
                },
                scroll: true,
                pinCard: true
            })
            .state('deck.import', {
                url: '?types&deck&author&origin&version',
                params: {
                    types: null, deck: null, author: null, origin: null, version: null
                },
                scroll: true,
                pinCard: true
            })
            .state('deck.id', {
                url: '/:id',
                scroll: true,
                pinCard: true
            })
            .state('deck.new', {
                url: '/:id',
                scroll: true,
                pinCard: true
            });
    }

    angular.module('app').config(routes);
})();
