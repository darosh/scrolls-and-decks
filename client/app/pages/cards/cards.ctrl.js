(function () {
    'use strict';

    function CardsCtrl($scope, $timeout, $location, $document,
                       $mdDialog, $analytics, quickRepeatList,
                       CardsDecks, Bookmarks, Scrolls,
                       FilterCards, Storage, Status, Settings, UtilsUi, UtilsCards, UtilsPaging) {
        var vm = this;
        var params = {destroyed: false, running: false};
        var previousIndex = 0;
        var previousSort = null;
        var tabDelay = UtilsUi.getTabDelay(vm, updated);

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
                if ((vm.selectedIndex > 0) && (vm.selectedIndex < 3)) {
                    Status.fab = {class: 'mdi-pencil', click: vm.showProperties};
                } else {
                    Status.fab = null;
                }
            });

            tabDelay();
        }

        function start() {
            vm.filter = FilterCards;
            vm.selectedIndex = 0;
            vm.selectedIndexCopy = 0;
            vm.selectedIndexChanged = index;
            vm.paging = paging;
            vm.settingsCopy = Settings.settingsCopy;
            vm.showCard = UtilsUi.showCard;
            vm.showProperties = showProperties;
            vm.setAllCards = setAllCards;
            vm.resetCards = resetCards;
            vm.cardsParams = {types: ''};
            vm.input = {cards: angular.toJson(Storage.cards)};
            vm.inputCards = inputCards;
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

                confirmDialog().then(function () {
                    vm.input.cards = angular.toJson({types: t});
                });
            }

            $timeout(function () {
                var el = $document[0].getElementById('page-content');
                el.focus();
            });
        }

        function confirmDialog() {
            var d = $mdDialog.confirm()
                .theme(Settings.settings.dark ? 'dark' : 'default')
                .title('Import scrolls collection')
                .content('A scrolls collection has been shared with you, do you want to import?' +
                '<br />' +
                'Your current <em>My scrolls</em>  collection will be replaced.')
                .cancel('Cancel')
                .ok('Import');

            /*eslint-disable no-underscore-dangle */
            delete d._options.template;
            d._options.templateUrl = 'app/shared/views/dialog.html';
            d._options.clickOutsideToClose = true;
            d._options.ariaLabel = d._options.title;
            /*eslint-enable no-underscore-dangle */

            return $mdDialog.show(d);
        }

        function inputCards(noStorage) {
            if (!vm.input.cards) {
                return;
            }

            try {
                var o = angular.fromJson(vm.input.cards);

                if (!noStorage) {
                    Storage.set('cards', o);
                }

                vm.cardsParams.types = o.types.join(',');
            } catch (ign) {
                // TODO(improve) add input error message
            }
        }

        function resetCards() {
            vm.input.cards = angular.toJson({types: []});
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

                vm.input.cards = angular.toJson({types: arr});
                inputCards();
            });
        }

        function showProperties() {
            vm.selectedIndex = 3;
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
            vm.lazy = [];
        }

        function paging(si) {
            if (params.destroyed) {
                return;
            }

            if (!CardsDecks.Cards[0]) {
                return;
            }

            if (angular.isUndefined(si) && !vm.lazy.length) {
                return;
            }

            if (vm.selectedIndex > 2) {
                previousIndex = vm.selectedIndex;
                return;
            }

            if ((vm.selectedIndex !== previousIndex) || !FilterCards.sorted) {
                if (previousSort) {
                    FilterCards.sorted = UtilsCards.sort(previousSort, CardsDecks.Cards[vm.selectedIndex].c);
                    FilterCards.sorted = UtilsCards.sort(FilterCards.params.sort, FilterCards.sorted);
                } else {
                    FilterCards.sorted = UtilsCards.sort(FilterCards.params.sort, CardsDecks.Cards[vm.selectedIndex].c);
                }
            } else {
                FilterCards.sorted = UtilsCards.sort(FilterCards.params.sort, FilterCards.sorted);
            }

            FilterCards.items = UtilsCards.filter(FilterCards.sorted, FilterCards.params, FilterCards.text, Bookmarks);

            previousIndex = vm.selectedIndex;
            previousSort = FilterCards.params.sort;
            params.si = si || vm.selectedIndex;
            FilterCards.stats = CardsDecks.Cards[vm.selectedIndex].s;

            if ((vm.lazy.length < (params.limit - 5)) && vm.lazy.length) {
                return;
            }

            params.limit += 25;
            params.limit = (params.limit > FilterCards.items.length) ? FilterCards.items.length : params.limit;

            var iteration = UtilsPaging.getPagingIteration(vm, FilterCards, params, quickRepeatList);

            if (!params.running) {
                iteration();
            }
        }

        function updated() {
            init();
            vm.paging(vm.selectedIndex);

            if ((vm.selectedIndex < 3) && (FilterCards.items.length !== FilterCards.sorted.length)) {
                UtilsUi.setTitle('Scrolls:', FilterCards.items.length + ' of ' + FilterCards.sorted.length);
            } else {
                UtilsUi.setTitle('Scrolls');
            }
        }
    }

    angular.module('app').controller('CardsCtrl', CardsCtrl);
})();
