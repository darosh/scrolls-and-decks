/// <reference path="Card.ts" />
/// <reference path="Stats.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var CardsAndStats = (function () {
        function CardsAndStats(cards, all, full) {
            if (all === void 0) { all = false; }
            if (full === void 0) { full = false; }
            this.c = cards;
            this.s = new ScrollsTypes.Stats(cards, all, full);
        }
        return CardsAndStats;
    })();
    ScrollsTypes.CardsAndStats = CardsAndStats;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=CardsAndStats.js.map