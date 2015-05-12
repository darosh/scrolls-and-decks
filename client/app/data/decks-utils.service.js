(function () {
    'use strict';

    function DecksUtils() {
        return {
            deckParams: deckParams
        };

        function deckParams(deck) {
            return {
                types: deck.types.join(','),
                deck: deck.deck,
                author: deck.author,
                origin: deck.origin
            };
        }
    }

    angular.module('app.data').factory('DecksUtils', DecksUtils);
})();
