/// <reference path="CardsAndStats.ts" />
/// <reference path="Cards.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var CardsReport = (function () {
        function CardsReport(types, Scrolls) {
            this[0] = new ScrollsTypes.CardsAndStats(ScrollsTypes.ScrollsToCards(Scrolls.parsed));
            this[1] = new ScrollsTypes.CardsAndStats(ScrollsTypes.TypesToCards(types, Scrolls));
            this[2] = new ScrollsTypes.CardsAndStats(ScrollsTypes.MissingCards(this[1].c, Scrolls));
        }
        return CardsReport;
    })();
    ScrollsTypes.CardsReport = CardsReport;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=CardsReport.js.map