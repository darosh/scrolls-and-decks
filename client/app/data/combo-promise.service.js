(function () {
    'use strict';

    function ScrollsDecks(Scrolls, Decks, Utils) {
        return Utils.getComboPromise({Decks: Decks, Scrolls: Scrolls});
    }

    function CardsDecks(Cards, Decks, Utils) {
        return Utils.getComboPromise({Cards: Cards, Decks: Decks});
    }

    angular.module('app.data').factory('CardsDecks', CardsDecks);
    angular.module('app.data').factory('ScrollsDecks', ScrollsDecks);
})();
