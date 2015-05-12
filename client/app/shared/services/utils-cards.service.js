(function () {
    'use strict';

    function UtilsCards() {
        var service = {
            sort: sort,
            filterPoints: filterPoints,
            filter: filter
        };

        return service;

        function sort(by, cards) {
            if (by === 'name') {
                return _.sortBy(cards, function (v) {
                    return v.s.nameLowerCase;
                });
            } else if (by === 'cost') {
                return _.sortBy(cards, function (v) {
                    return v.s.cost;
                });
            } else if (by === 'resource') {
                return _.sortBy(cards, function (v) {
                    return v.s.ri;
                });
            } else if (by === 'kind') {
                return _.sortBy(cards, function (v) {
                    return v.s.kind;
                });
            } else if (by === 'type') {
                return _.sortBy(cards, function (v) {
                    return v.s.kind + v.s.types;
                });
            } else if (by === 'decks') {
                return _.sortBy(cards, function (v) {
                    return -v.s.decksCount;
                });
            } else if (by === 'cards') {
                return _.sortBy(cards, function (v) {
                    return -v.c;
                });
            } else if (by === 'price') {
                return _.sortBy(cards, function (v) {
                    return v.s.price;
                });
            }

            return cards;
        }

        function filterPoints(src, tgt) {
            var tri = _.trim(src);
            var num = parseInt(tri);

            if ((tri === '-') || (tri === '\u2014')) {
                num = '\u2014';
            }

            var mod = _.last(tri);

            if (mod === '+') {
                return num <= tgt;
            } else if (mod === '-') {
                return num >= tgt;
            } else if (mod === '?') {
                return true;
            } else {
                return num === tgt;
            }
        }

        function filter(cards, params, text, Bookmarks) {
            var st = (text.search || '');
            var s = st.toLowerCase();
            var i = params.selectedItem || '';
            var ps;

            i = (i.name === st) ? i : null;

            return _.filter(cards, function (v) {
                if (!(params[v.s.cost] && params[v.s.r])) {
                    return false;
                }

                if ((params.star === 2) && Bookmarks.look[v.s.id]) {
                    return false;
                } else if ((params.star === 1) && !Bookmarks.look[v.s.id]) {
                    return false;
                }

                if (i) {
                    if (i.kind) {
                        return v.s.kind === i.name;
                    }

                    if (i.rarity) {
                        return v.s.rarityText === i.name;
                    }

                    if (i.type) {
                        return v.s.typesArr.indexOf(i.name) > -1;
                    }

                    if (i.trait) {
                        return v.s.traits.indexOf(i.name) > -1;
                    }

                    if (i.card) {
                        return v.s === i.card.s;
                    }

                    if (i.set) {
                        return v.s.set === i.set;
                    }
                } else if (s) {
                    var pr = /^[^\/]*\/[^\/]*\/[^\/]*$/g;

                    if (v.s.p && pr.test(s)) {
                        ps = s.split('/');
                        return service.filterPoints(ps[0], v.s.ap) &&
                            service.filterPoints(ps[1], v.s.ac) &&
                            service.filterPoints(ps[2], v.s.hp);
                    } else {
                        return v.s.nameLowerCase.indexOf(s) > -1 || v.s.id.toString() === s;
                    }
                } else {
                    return true;
                }
            });
        }
    }

    angular.module('app.services').factory('UtilsCards', UtilsCards);
})();
