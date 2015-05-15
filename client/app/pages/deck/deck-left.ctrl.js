(function () {
    'use strict';

    function LeftDeckCtrl($rootScope, $timeout,
                          $state,
                          Bookmarks, Cards,
                          FilterDeck, FilterCards, FilterUtils, UtilsUi, UtilsCards, Status) {
        var vm = this;
        var allRelated;
        var running = false;
        var sf = FilterUtils.setFilter(FilterCards);
        var tabDelay = UtilsUi.getTabDelay(vm, updated);
        var first = false;

        vm.filter = FilterDeck;
        vm.showResource = true;
        vm.edit = true;
        vm.status = Status;
        vm.showCard = UtilsUi.showCard;
        vm.selectedIndex = 0;
        vm.selectedIndexCopy = 0;
        vm.selectedIndexChanged = index;
        //noinspection JSUnusedGlobalSymbols
        vm.deckPaging = deckPaging;
        vm.setFilter = setFilter;
        vm.addCard = addCard;
        vm.filterParams = FilterUtils.filterParams;
        FilterDeck.querySearch = FilterUtils.query(FilterDeck, Cards[0].c, Cards[0].s);

        $rootScope.$watch(function () {
            return FilterDeck.params;
        }, filterParams, true);

        $rootScope.$watch(function () {
            return FilterDeck.text.search;
        }, filterText);

        if ($state.current.name === 'deck.new') {
            vm.selectedIndex = 1;
            vm.selectedIndexCopy = 1;
            updated();
        } else {
            $timeout(function () {
                Status.fab = {class: 'mdi-pencil', click: showEdit};
            }, 400);
        }

        function addCard(c) {
            $rootScope.$broadcast('addType', c.s.id);
        }

        function showEdit() {
            vm.selectedIndex = 1;
            Status.fab = null;
        }

        function index() {
            if (first) {
                $timeout(function () {
                    if (vm.selectedIndex !== 1) {
                        Status.fab = {class: 'mdi-pencil', click: showEdit};
                    } else {
                        Status.fab = null;
                    }
                });
            }

            first = true;

            tabDelay();
        }

        function setFilter(t, name, r) {
            sf(t, name, r);
            $state.go('cards');
        }

        function filterText(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            updated();
        }

        function filterParams(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            updated();
        }

        function deckPaging() {
            var i = 0;

            function iteration() {
                if (vm.related && (i < 8) && (vm.related.length < allRelated.length)) {
                    running = true;

                    $timeout(function () {
                        vm.related.push(allRelated[vm.related.length]);
                        i++;
                        iteration();
                    }, 20);
                } else {
                    running = false;
                }
            }

            if ((vm.selectedIndexCopy === 1) && !running) {
                iteration();
            }
        }

        function updated() {
            vm.filter.edit = vm.selectedIndex === 1;
            allRelated = UtilsCards.filter(Cards[0].c, FilterDeck.params, FilterDeck.text, Bookmarks);
            vm.related = _.take(allRelated, 15);
        }
    }

    angular.module('app').controller('LeftDeckCtrl', LeftDeckCtrl);
})();
