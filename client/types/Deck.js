/// <reference path="Global.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScrollsTypes;
(function (ScrollsTypes) {
    'use strict';
    var DeckSimple = (function () {
        function DeckSimple(d) {
            var _this = this;
            if (d) {
                this.deck = d.deck;
                this.author = d.author;
                if (_.isString(d.types)) {
                    this.types = [];
                    var s = d.types.toString().split(',');
                    _.each(s, function (v) {
                        _this.types.push(parseInt(v, 10));
                    });
                }
                else {
                    this.types = d.types;
                }
            }
        }
        DeckSimple.prototype.getDeckHash = function () {
            return _.sortBy(this.types).join(',');
        };
        return DeckSimple;
    })();
    ScrollsTypes.DeckSimple = DeckSimple;
    var DeckExtended = (function (_super) {
        __extends(DeckExtended, _super);
        function DeckExtended(d) {
            if (d) {
                _super.call(this, d);
                this.origin = d.origin;
            }
        }
        return DeckExtended;
    })(DeckSimple);
    ScrollsTypes.DeckExtended = DeckExtended;
    var Deck = (function (_super) {
        __extends(Deck, _super);
        function Deck(d, starter, scrollsCom, storageId) {
            if (storageId === void 0) { storageId = null; }
            _super.call(this);
            this.origin = d.origin || (scrollsCom ? 'http://scrolls.com' : '');
            // this.setAuthor(d.author);
            this.author = d.author;
            // this.setDeck(d.deck);
            this.deck = d.deck;
            this.types = d.types || [];
            this.starter = starter;
            this.id = ScrollsTypes._decks.length;
            this.storageId = storageId;
            this.update();
            // this.hash = this.getDeckHash();
        }
        Object.defineProperty(Deck.prototype, "hash", {
            get: function () {
                return this.getDeckHash();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deck.prototype, "deck", {
            get: function () {
                return this._deck;
            },
            /*tslint:disable:typedef */
            set: function (value) {
                this._deck = value || '?';
                this.deckLowerCase = this._deck.toLowerCase();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deck.prototype, "author", {
            // setDeck(deck:string):void {
            //    this.deck = deck || '?';
            //    this.deckLowerCase = this.deck.toLowerCase();
            // }
            get: function () {
                return this._author;
            },
            /*tslint:disable:typedef */
            set: function (value) {
                this._author = value || '?';
                this.authorLowerCase = this._author.toLowerCase();
            },
            enumerable: true,
            configurable: true
        });
        // setAuthor(author:string):void {
        //    this.author = author || '?';
        //    this.authorLowerCase = this.author.toLowerCase();
        // }
        Deck.prototype.update = function () {
            this.countTypes();
            this.updatePricing();
            this.updateSortString();
            this.updateResourcePercents();
            this.updateResourceFlags();
            this.updateCode();
            this.updateStats();
        };
        Deck.prototype.toDeckSimple = function () {
            return new DeckSimple(this);
        };
        Deck.prototype.toDeckExtended = function () {
            return new DeckExtended(this);
        };
        Deck.prototype.addType = function (type) {
            var l = this.counts[type] || 0;
            if (l < 3) {
                this.types.push(type);
                this.counts[type] = l + 1;
                this.update();
                return 1;
            }
            return 0;
        };
        Deck.prototype.removeType = function (type) {
            var l = this.counts[type] || 0;
            if (l > 1) {
                this.counts[type] = l - 1;
                this.types.splice(this.types.indexOf(type), 1);
                this.update();
                return 1;
            }
            else if (l > 0) {
                delete this.counts[type];
                this.types.splice(this.types.indexOf(type), 1);
                this.update();
                return 1;
            }
            return 0;
        };
        Deck.prototype.countTypes = function () {
            var _this = this;
            this.counts = {};
            this.growth = 0;
            this.order = 0;
            this.energy = 0;
            this.decay = 0;
            this.types.forEach(function (t) {
                var s = ScrollsTypes._scrolls.look[t];
                if (s) {
                    _this.growth += !!s.growth ? 1 : 0;
                    _this.energy += !!s.energy ? 1 : 0;
                    _this.decay += !!s.decay ? 1 : 0;
                    _this.order += !!s.order ? 1 : 0;
                    s.decks[_this.id] = _this;
                }
                _this.counts[t] = (_this.counts[t] || 0) + 1;
            });
        };
        Deck.prototype.updatePricing = function () {
            var have = 0;
            var price = 0;
            var priceTotal = 0;
            _.each(this.counts, function (c, t) {
                var mt = ScrollsTypes._typesCounts.items[t] || 0;
                have += (mt >= c) ? c : mt;
                var p = ScrollsTypes._scrolls.look[t] ? ScrollsTypes._scrolls.look[t].price : 0;
                priceTotal += c * p;
                if (mt < c) {
                    price += (c - mt) * p;
                }
            });
            this.havePercent = Math.floor((have / (this.types.length || 1)) * 100);
            this.have = have;
            this.price = price;
            this.priceTotal = priceTotal;
        };
        Deck.prototype.updateResourcePercents = function () {
            this.growthPercent = (this.growth / (this.types.length || 1)) * 100;
            this.energyPercent = (this.energy / (this.types.length || 1)) * 100;
            this.decayPercent = (this.decay / (this.types.length || 1)) * 100;
            this.orderPercent = (this.order / (this.types.length || 1)) * 100;
        };
        Deck.prototype.updateSortString = function () {
            function num(n) {
                return (n < 10 ? '00' : (n < 100 ? '0' : '')) + n;
            }
            this.sort = num(this.growth) + num(this.energy) + num(this.order) + num(this.decay);
        };
        Deck.prototype.updateResourceFlags = function () {
            this.g = this.growth > 0;
            this.e = this.energy > 0;
            this.o = this.order > 0;
            this.d = this.decay > 0;
        };
        Deck.prototype.updateCode = function () {
            this.code = (this.g ? 8 : 0) + (this.e ? 4 : 0) + (this.o ? 2 : 0) + (this.d ? 1 : 0);
        };
        Deck.prototype.updateStats = function () {
            var cards = [];
            _.each(this.counts, function (v, k) {
                cards.push(new ScrollsTypes.Card(ScrollsTypes._scrolls.look[k], v));
            });
            this.stats = new ScrollsTypes.Stats(cards, true, true);
        };
        return Deck;
    })(DeckExtended);
    ScrollsTypes.Deck = Deck;
})(ScrollsTypes || (ScrollsTypes = {}));
//# sourceMappingURL=Deck.js.map