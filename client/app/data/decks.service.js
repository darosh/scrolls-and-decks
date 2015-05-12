(function () {
    'use strict';

    function Decks($q, $rootScope,
                   Storage, DecksResource, Scrolls, Cards) {
        var deferred = $q.defer();

        deferred.getDeck = getDeck;
        deferred.removeDeck = removeDeck;

        $q.all([Scrolls.promise, Cards.promise, DecksResource.$promise]).then(init);

        return deferred;

        function init() {
            $rootScope.$watch(function () {
                return Cards[1].c;
            }, function () {
                angular.extend(deferred, ScrollsTypes._decksCategorized);
                deferred.decks = ScrollsTypes._decks;

                ScrollsTypes.ResetDecks();

                //noinspection JSUnresolvedVariable
                ScrollsTypes.AddDecks(DecksResource.starters, true, true);
                //noinspection JSUnresolvedVariable
                ScrollsTypes.AddDecks(DecksResource.preconstructed, true, true);
                ScrollsTypes.AddDecks(DecksResource.users, true);
                ScrollsTypes.AddDecks(DecksResource.test);
                ScrollsTypes.AddStoredDecks(Storage.decks);

                ScrollsTypes.CountScrollsDecks();

                deferred.stats = ScrollsTypes.GetDecksStats();
                deferred.resolve(deferred);
            });
        }

        function getDeck(id, cb) {
            deferred.promise.then(function () {
                cb(deferred.decks[id]);
            });
        }

        function removeDeck(deck) {
            ScrollsTypes.RemoveDeck(deck);
            deferred.stats = ScrollsTypes.GetDecksStats();
        }
    }

    angular.module('app.data').factory('Decks', Decks);
})();
