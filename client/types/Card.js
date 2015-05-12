/// <reference path="Scroll.ts" />
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var Card = (function () {
        function Card(scroll, count) {
            if (count === void 0) { count = 1; }
            this.s = scroll;
            this.c = count;
        }
        return Card;
    })();
    ScrollsTypes.Card = Card;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Card.js.map