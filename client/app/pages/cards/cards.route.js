(function () {
    'use strict';

    function routes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/scrolls');
        //noinspection JSUnusedGlobalSymbols
        $stateProvider
            .state('cards', {
                url: '/scrolls',
                views: {
                    body: {
                        templateUrl: 'app/pages/cards/cards.html',
                        controller: 'CardsCtrl',
                        controllerAs: 'cardsCtrl',
                        resolve: {
                            CardsDecks: function (CardsDecks) {
                                return CardsDecks.promise;
                            }
                        }
                    },
                    side: {
                        templateUrl: 'app/pages/cards/cards-left.html',
                        controller: 'LeftCardsCtrl',
                        controllerAs: 'ct'
                    },
                    bar: {
                        templateUrl: 'app/layout/bar.html'
                    }
                },
                scroll: true,
                pinCard: true
            })
            .state('cards.filter', {
                url: '?resources&costs&star&search&kind&type&rarity&trait&set',
                scroll: true,
                pinCard: true
            })
            .state('cards.import', {
                url: '?types',
                scroll: true,
                pinCard: true
            });
    }

    angular.module('app').config(routes);
})();
