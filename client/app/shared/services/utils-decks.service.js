(function () {
    'use strict';

    function UtilsDecks() {
        return {
            sort: sort,
            filter: filter
        };

        function sort(by, decks) {
            if (by === 'name') {
                return _.sortBy(decks, function (v) {
                    return v && v.deck;
                });
            } else if (by === 'author') {
                return _.sortBy(decks, function (v) {
                    return v && v.author;
                });
            } else if (by === 'resource') {
                return _.sortBy(decks, function (v) {
                    return v && v.sort;
                }).reverse();
            } else if (by === 'cards') {
                return _.sortBy(decks, function (v) {
                    return v && -v.havePercent;
                });
            } else if (by === 'price') {
                return _.sortBy(decks, function (v) {
                    return v && v.price;
                });
            }

            return decks;
        }

        function filter(decks, params, text) {
            var st = (text.search || '');
            var s = st.toLowerCase();

            return _.filter(decks, function (v) {
                if (!v) {
                    return false;
                }

                if (!v.types.length) {
                    return true;
                }

                if (!((params.g && v.g) || (params.e && v.e) || (params.o && v.o) || (params.d && v.d))) {
                    return false;
                }

                if (s) {
                    return (v.deckLowerCase.indexOf(s) > -1) || (v.authorLowerCase.indexOf(s) === 0);
                } else {
                    return true;
                }
            });
        }
    }

    angular.module('app.services').factory('UtilsDecks', UtilsDecks);
})();
