/// <reference path="Global.ts" />
/// <reference path="Decks.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var DeckCards = (function () {
        function DeckCards(deck) {
            this.cards = [];
            this.deck = deck;
            this.update();
        }
        DeckCards.prototype.update = function () {
            var r = ScrollsTypes.TypesToCards(this.deck.types, ScrollsTypes._scrolls);
            var c = ScrollsTypes.HavingMissingRemainingCards(ScrollsTypes._cardsReport[1].c, r);
            this.cards[0] = new ScrollsTypes.CardsAndStats(c[0], true, true);
            this.cards[1] = new ScrollsTypes.CardsAndStats(c[1], true, true);
            this.cards[2] = new ScrollsTypes.CardsAndStats(c[2], true, true);
        };
        DeckCards.prototype.addType = function (type) {
            ScrollsTypes.removeDeckStats(this.deck);
            var added = this.deck.addType(type);
            this.update();
            ScrollsTypes.addDeckStats(this.deck);
            ScrollsTypes.GetDecksStats();
            return added;
        };
        DeckCards.prototype.removeType = function (type) {
            ScrollsTypes.removeDeckStats(this.deck);
            var removed = this.deck.removeType(type);
            this.update();
            ScrollsTypes.addDeckStats(this.deck);
            ScrollsTypes.GetDecksStats();
            return removed;
        };
        DeckCards.prototype.replaceDeck = function (deck) {
            // this.deck.setDeck(deck.deck);
            this.deck.deck = deck.deck;
            // this.deck.setAuthor(deck.author);
            this.deck.author = deck.author;
            this.deck.origin = deck.origin;
            this.replaceTypes(deck.types);
        };
        DeckCards.prototype.replaceTypes = function (types) {
            var _this = this;
            ScrollsTypes.removeDeckStats(this.deck);
            _.each(_.clone(this.deck.types), function (v) {
                _this.deck.removeType(v);
            });
            _.each(types, function (v) {
                _this.deck.types.push(v);
            });
            this.deck.update();
            this.update();
            ScrollsTypes.addDeckStats(this.deck);
            ScrollsTypes.GetDecksStats();
        };
        return DeckCards;
    })();
    ScrollsTypes.DeckCards = DeckCards;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=DeckCards.js.map