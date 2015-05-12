(function () {
    'use strict';

    function routes($stateProvider) {
        $stateProvider
            .state('decks', {
                url: '/decks',
                views: {
                    body: {
                        templateUrl: 'app/pages/decks/decks.html',
                        controller: 'DecksCtrl',
                        controllerAs: 'decksCtrl',
                        resolve: {
                            Decks: function (Decks) {
                                return Decks.promise;
                            }
                        }
                    },
                    side: {
                        templateUrl: 'app/pages/decks/decks-left.html',
                        controller: 'LeftDecksCtrl',
                        controllerAs: 'leftCtrl'
                    },
                    bar: {
                        templateUrl: 'app/layout/bar.html'
                    }
                },
                params: {search: null},
                scroll: true
            });
    }

    angular.module('app').config(routes);
})();
