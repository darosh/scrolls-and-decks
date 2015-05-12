/// <reference path="Global.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    function AddDecks(decks, isStarter, isInGame) {
        if (isStarter === void 0) { isStarter = false; }
        if (isInGame === void 0) { isInGame = false; }
        _.each(decks, function (d) {
            AddDeck(d, isStarter, isInGame);
        });
    }
    ScrollsTypes.AddDecks = AddDecks;
    function AddStoredDecks(decks) {
        _.each(decks, function (d) {
            AddDeck(d, false, false, false, d);
        });
    }
    ScrollsTypes.AddStoredDecks = AddStoredDecks;
    function GetDeckByHash(hash) {
        return _.find(ScrollsTypes._decks, function (v) {
            return v.hash === hash;
        });
    }
    ScrollsTypes.GetDeckByHash = GetDeckByHash;
    function AddDeck(deck, isStarter, isInGame, isClone, storageId) {
        if (isStarter === void 0) { isStarter = false; }
        if (isInGame === void 0) { isInGame = false; }
        if (isClone === void 0) { isClone = false; }
        if (storageId === void 0) { storageId = null; }
        var d = new ScrollsTypes.Deck(deck, isStarter, isInGame, storageId);
        if (isClone) {
            d.deck = 'Clone of ' + d.deck;
        }
        ScrollsTypes._decks.push(d);
        addDeckStats(d);
        return d.id;
    }
    ScrollsTypes.AddDeck = AddDeck;
    function addDeckStats(d) {
        ScrollsTypes._decksStats[0][d.code] = (ScrollsTypes._decksStats[0][d.code] || 0) + 1;
        if (d.have === d.types.length) {
            ScrollsTypes._decksStats[1][d.code] = (ScrollsTypes._decksStats[1][d.code] || 0) + 1;
            ScrollsTypes._decksCategorized[1].push(d);
        }
        else {
            ScrollsTypes._decksStats[2][d.code] = (ScrollsTypes._decksStats[2][d.code] || 0) + 1;
            ScrollsTypes._decksCategorized[2].push(d);
        }
    }
    ScrollsTypes.addDeckStats = addDeckStats;
    function RemoveDeck(deck) {
        ScrollsTypes._decks[deck.id] = null;
        deck.types.forEach(function (t) {
            var s = ScrollsTypes._scrolls.look[t];
            if (s) {
                delete s.decks[deck.id];
                s.updateDecksCount();
            }
        });
        removeDeckStats(deck);
        GetDecksStats();
    }
    ScrollsTypes.RemoveDeck = RemoveDeck;
    function removeDeckStats(deck) {
        ScrollsTypes._decksStats[0][deck.code]--;
        if (!ScrollsTypes._decksStats[0][deck.code]) {
            delete ScrollsTypes._decksStats[0][deck.code];
        }
        if (ScrollsTypes._decksStats[1][deck.code]) {
            ScrollsTypes._decksStats[1][deck.code]--;
            if (!ScrollsTypes._decksStats[1][deck.code]) {
                delete ScrollsTypes._decksStats[1][deck.code];
            }
            ScrollsTypes._decksCategorized[1].splice(ScrollsTypes._decksCategorized[1].indexOf(deck), 1);
        }
        else {
            ScrollsTypes._decksStats[2][deck.code]--;
            if (!ScrollsTypes._decksStats[2][deck.code]) {
                delete ScrollsTypes._decksStats[2][deck.code];
            }
            ScrollsTypes._decksCategorized[2].splice(ScrollsTypes._decksCategorized[2].indexOf(deck), 1);
        }
    }
    ScrollsTypes.removeDeckStats = removeDeckStats;
    function getStats(stats) {
        return _.sortBy(_.map(stats, function (v, k) {
            var val = parseInt(k, 10);
            /*jslint bitwise: true */
            /*tslint:disable:no-bitwise */
            return {
                count: v,
                val: val,
                g: val & 8,
                e: val & 4,
                o: val & 2,
                d: val & 1
            };
        }), 'count').reverse();
    }
    function GetDecksStats() {
        ScrollsTypes._allDecksStats[0] = getStats(ScrollsTypes._decksStats[0]);
        ScrollsTypes._allDecksStats[1] = getStats(ScrollsTypes._decksStats[1]);
        ScrollsTypes._allDecksStats[2] = getStats(ScrollsTypes._decksStats[2]);
        return ScrollsTypes._allDecksStats;
    }
    ScrollsTypes.GetDecksStats = GetDecksStats;
    function CountScrollsDecks() {
        _.each(ScrollsTypes._scrolls.look, function (s) {
            s.updateDecksCount();
        });
    }
    ScrollsTypes.CountScrollsDecks = CountScrollsDecks;
    function ResetDecks() {
        _.remove(ScrollsTypes._decksCategorized[0]);
        _.remove(ScrollsTypes._decksCategorized[1]);
        _.remove(ScrollsTypes._decksCategorized[2]);
    }
    ScrollsTypes.ResetDecks = ResetDecks;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Decks.js.map