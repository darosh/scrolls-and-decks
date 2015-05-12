/// <reference path="Card.ts" />
/// <reference path="Scrolls.ts" />
/// <reference path="Stats.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var TypesCounts = (function () {
        function TypesCounts(cards) {
            var _this = this;
            this.items = {};
            _.each(cards, function (v) {
                _this.items[v.s.id] = v.c;
            });
        }
        return TypesCounts;
    })();
    ScrollsTypes.TypesCounts = TypesCounts;
    function TypesToCards(types, scrolls) {
        var list = [];
        var d = {};
        _.each(types, function (v) {
            if (!scrolls.look[v]) {
                return;
            }
            if (!d[v]) {
                d[v] = new ScrollsTypes.Card(scrolls.look[v], 1);
                list.push(d[v]);
            }
            else {
                d[v].c++;
            }
        });
        return list;
    }
    ScrollsTypes.TypesToCards = TypesToCards;
    function ScrollsToCards(scrollsParsed) {
        var list = [];
        scrollsParsed.forEach(function (v) {
            list.push(new ScrollsTypes.Card(v, 1));
        });
        return list;
    }
    ScrollsTypes.ScrollsToCards = ScrollsToCards;
    function MissingCards(havingCards, Scrolls) {
        var cards = [];
        var d = {};
        havingCards.forEach(function (v) {
            d[v.s.id] = new ScrollsTypes.Card(v.s, 3 - v.c);
            if (d[v.s.id].c) {
                cards.push(d[v.s.id]);
            }
        });
        _.each(Scrolls.look, function (v, t) {
            if (!d[t]) {
                cards.push(new ScrollsTypes.Card(v, 3));
            }
        });
        return cards;
    }
    ScrollsTypes.MissingCards = MissingCards;
    function RelatedCards(card, Scrolls, max) {
        if (max === void 0) { max = 25; }
        var related = [];
        function testAndAdd(tm) {
            if ((related.length < max) && (tm !== card.s) && !_.find(related, function (v) {
                return v.s === tm;
            })) {
                related.push(new ScrollsTypes.Card(tm));
            }
        }
        _.each(_.clone(card.s.typesArr).reverse(), function (t) {
            _.each(Scrolls.types[card.s.r][t], testAndAdd);
        });
        if (!related.length) {
            _.each(Scrolls.kinds[card.s.r][card.s.kind], testAndAdd);
        }
        return related;
    }
    ScrollsTypes.RelatedCards = RelatedCards;
    function HavingMissingRemainingCards(myCards, deckCards) {
        var havingCards = [];
        var missingCards = [];
        var myRemainingCards = [];
        var d = {};
        _.each(myCards, function (v) {
            var n = new ScrollsTypes.Card(v.s, v.c);
            myRemainingCards.push(n);
            d[v.s.id] = n;
        });
        _.each(deckCards, function (v) {
            var my = d[v.s.id] ? d[v.s.id].c : 0;
            var de = v.c;
            var re;
            if (my >= de) {
                havingCards.push({ c: de, s: v.s });
                // 0 missingCards;
                re = my - de;
                if (re > 0) {
                    myRemainingCards.push({ c: re, s: v.s });
                }
            }
            else if (my === 0) {
                // 0 havingCards.push({c: de, s: v.s});
                missingCards.push({ c: de, s: v.s });
            }
            else {
                havingCards.push({ c: my, s: v.s });
                missingCards.push({ c: de - my, s: v.s });
            }
        });
        return [deckCards, havingCards, missingCards, myRemainingCards];
    }
    ScrollsTypes.HavingMissingRemainingCards = HavingMissingRemainingCards;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Cards.js.map