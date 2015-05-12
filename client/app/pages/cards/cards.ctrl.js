(function () {
    'use strict';

    function CardsCtrl($scope, $timeout, $location, $document,
                       $mdDialog, $analytics, quickRepeatList,
                       CardsDecks, Bookmarks, Scrolls,
                       FilterCards, Storage, Status, Settings, UtilsUi, UtilsCards, UtilsPaging) {
        var self = this;
        var params = {destroyed: false, running: false};
        var previousIndex = 0;
        var previousSort = null;
        var tabDelay = UtilsUi.getTabDelay(self, updated);

        start();
        Status.fab = null;
        $scope.$on('$destroy', destroyed);
        CardsDecks.Cards.promise.then(updated);

        //$scope.$watch(function () {
        //    return self.input.cards;
        //}, inputCards);

        $scope.$watch(function () {
            return Storage.cards;
        }, updated);

        $scope.$watch(function () {
            return FilterCards.params;
        }, filterParams, true);

        $scope.$watch(function () {
            return FilterCards.text.search;
        }, filterText);

        function index() {
            $timeout(function () {
                if ((self.selectedIndex > 0) && (self.selectedIndex < 3)) {
                    Status.fab = {class: 'mdi-pencil', click: self.showProperties};
                } else {
                    Status.fab = null;
                }
            });

            tabDelay();
        }

        function start() {
            self.filter = FilterCards;
            self.selectedIndex = 0;
            self.selectedIndexCopy = 0;
            self.selectedIndexChanged = index;
            self.paging = paging;
            self.settingsCopy = Settings.settingsCopy;
            self.showCard = UtilsUi.showCard;
            self.showProperties = showProperties;
            self.setAllCards = setAllCards;
            self.resetCards = resetCards;
            self.cardsParams = {types: ''};
            self.input = {cards: angular.toJson(Storage.cards)};
            self.inputCards = inputCards;
            UtilsUi.setTitle('Scrolls');
            FilterCards.items = null;
            FilterCards.sorted = null;
            inputCards(true);

            //noinspection JSCheckFunctionSignatures
            var s = $location.search();

            if (s.types) {
                var t = s.types.split(',');
                angular.forEach(t, function (v, k) {
                    t[k] = parseInt(v);
                });

                confirm().then(function () {
                    self.input.cards = angular.toJson({types: t});
                });
            }

            $timeout(function () {
                var el = $document[0].getElementById('page-content');
                el.focus();
            });
        }

        function confirm() {
            var d = $mdDialog.confirm()
                .theme(Settings.settings.dark ? 'dark' : 'default')
                .title('Import scrolls collection')
                .content('A scrolls collection has been shared with you, do you want to import?' +
                '<br />' +
                'Your current <em>My scrolls</em>  collection will be replaced.')
                .cancel('Cancel')
                .ok('Import');

            delete d._options.template;
            d._options.templateUrl = 'app/shared/views/dialog.html';
            d._options.clickOutsideToClose = true;
            d._options.ariaLabel = d._options.title;

            return $mdDialog.show(d);
        }

        function inputCards(noStorage) {
            if (!self.input.cards) {
                return;
            }

            try {
                var o = angular.fromJson(self.input.cards);

                if (!noStorage) {
                    Storage.set('cards', o);
                }

                self.cardsParams.types = o.types.join(',');
            } catch (ign) {
                // TODO(improve) add input error message
            }
        }

        function resetCards() {
            self.input.cards = angular.toJson({types: []});
            inputCards();
        }

        function setAllCards() {
            Scrolls.promise.then(function () {
                var arr = [];

                angular.forEach(Scrolls.parsed, function (v) {
                    arr.push(v.id);
                    arr.push(v.id);
                    arr.push(v.id);
                });

                self.input.cards = angular.toJson({types: arr});
                inputCards();
            });
        }

        function showProperties() {
            self.selectedIndex = 3;
        }

        function filterText(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            updated();
            //noinspection JSUnresolvedFunction
            $analytics.eventTrack('Cards', {category: 'Search'});
        }

        function filterParams(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            updated();
            //noinspection JSUnresolvedFunction
            $analytics.eventTrack('Cards', {category: 'Filter'});
        }

        function destroyed() {
            params.destroyed = true;
        }

        function init() {
            params.limit = 35;
            self.lazy = [];
        }

        function paging(si) {
            if (params.destroyed) {
                return;
            }

            if (!CardsDecks.Cards[0]) {
                return;
            }

            if ((si === undefined) && !self.lazy.length) {
                return;
            }

            if (self.selectedIndex > 2) {
                previousIndex = self.selectedIndex;
                return;
            }

            if ((self.selectedIndex !== previousIndex) || !FilterCards.sorted) {
                if (previousSort) {
                    FilterCards.sorted = UtilsCards.sort(previousSort, CardsDecks.Cards[self.selectedIndex].c);
                    FilterCards.sorted = UtilsCards.sort(FilterCards.params.sort, FilterCards.sorted);
                } else {
                    FilterCards.sorted = UtilsCards.sort(FilterCards.params.sort, CardsDecks.Cards[self.selectedIndex].c);
                }
            } else {
                FilterCards.sorted = UtilsCards.sort(FilterCards.params.sort, FilterCards.sorted);
            }

            FilterCards.items = UtilsCards.filter(FilterCards.sorted, FilterCards.params, FilterCards.text, Bookmarks);

            previousIndex = self.selectedIndex;
            previousSort = FilterCards.params.sort;
            params.si = si || self.selectedIndex;
            FilterCards.stats = CardsDecks.Cards[self.selectedIndex].s;

            if ((self.lazy.length < (params.limit - 5)) && self.lazy.length) {
                return;
            }

            params.limit += 25;
            params.limit = (params.limit > FilterCards.items.length) ? FilterCards.items.length : params.limit;

            var iteration = UtilsPaging.getPagingIteration(self, FilterCards, params, quickRepeatList);

            if (!params.running) {
                iteration();
            }
        }

        function updated() {
            init();
            self.paging(self.selectedIndex);

            if ((self.selectedIndex < 3) && (FilterCards.items.length !== FilterCards.sorted.length)) {
                UtilsUi.setTitle('Scrolls:', FilterCards.items.length + ' of ' + FilterCards.sorted.length);
            } else {
                UtilsUi.setTitle('Scrolls');
            }
        }
    }

    angular.module('app').controller('CardsCtrl', CardsCtrl);
})();
