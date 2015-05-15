(function () {
    'use strict';

    function DecksCtrl($scope, $timeout, $document,
                       $state, quickRepeatList,
                       Decks,
                       Status, Storage, FilterDecks, Settings, UtilsPaging, UtilsDecks, UtilsUi) {
        var vm = this;
        var params = {running: false, destroyed: false};
        var previousIndex = 0;
        var previousSort = null;

        vm.selectedIndex = 0;
        vm.selectedIndexCopy = 0;
        vm.selectedIndexChanged = UtilsUi.getTabDelay(vm, updated);
        vm.paging = paging;
        vm.settingsCopy = Settings.settingsCopy;
        vm.openDeck = openDeck;
        vm.addDeck = addDeck;
        vm.filter = FilterDecks;
        vm.myScrolls = Storage.cards;
        FilterDecks.items = null;
        FilterDecks.sorted = null;
        UtilsUi.setTitle('Decks');
        $scope.$on('$destroy', destroy);

        $timeout(function () {
            Status.fab = {class: 'mdi-plus', click: addDeck};
        }, 400);

        $timeout(function () {
            var el = $document[0].getElementById('page-content');
            el.focus();
        });

        $scope.$watch(function () {
            return Storage.decks;
        }, updated);

        $scope.$watch(function () {
            return FilterDecks.params;
        }, updated, true);

        $scope.$watch(function () {
            return FilterDecks.text.search;
        }, updated);

        FilterDecks.text.search = $state.params.search;

        function addDeck() {
            var id = ScrollsTypes.AddDeck({deck: 'New Deck'}, false, false, false, Storage.decks.length);
            Storage.decks.push(new ScrollsTypes.DeckExtended(ScrollsTypes._decks[id]));
            $state.go('deck.new', {id: id});
        }

        function destroy() {
            params.destroyed = true;
            Status.fab = null;
        }

        function openDeck(deck) {
            $state.go('deck.id', {id: deck.id});
        }

        function init() {
            params.limit = 35;
            vm.lazy = [];
        }

        function paging(si) {
            if (params.destroyed) {
                return;
            }

            if (!Decks[0]) {
                return;
            }

            if (angular.isUndefined(si) && !vm.lazy.length) {
                return;
            }

            if ((vm.selectedIndex !== previousIndex) || !FilterDecks.sorted) {
                if (previousSort) {
                    FilterDecks.sorted = UtilsDecks.sort(previousSort, Decks[vm.selectedIndex]);
                    FilterDecks.sorted = UtilsDecks.sort(FilterDecks.params.sort, FilterDecks.sorted);
                } else {
                    FilterDecks.sorted = UtilsDecks.sort(FilterDecks.params.sort, Decks[vm.selectedIndex]);
                }
            } else {
                FilterDecks.sorted = UtilsDecks.sort(FilterDecks.params.sort, FilterDecks.sorted);
            }

            FilterDecks.items = UtilsDecks.filter(FilterDecks.sorted, FilterDecks.params, FilterDecks.text);

            previousIndex = vm.selectedIndex;
            previousSort = FilterDecks.params.sort;
            params.si = si || vm.selectedIndex;
            FilterDecks.stats = Decks.stats[vm.selectedIndex];

            if (!UtilsPaging.setNext(vm, params, FilterDecks)) {
                return;
            }

            var iteration = UtilsPaging.getPagingIteration(vm, FilterDecks, params, quickRepeatList);

            if (!params.running) {
                iteration();
            }
        }

        function updated(newVal, oldVal) {
            if ((newVal === '' || newVal === null) && !oldVal) {
                return;
            }

            init();
            vm.paging(vm.selectedIndex);
        }
    }

    angular.module('app').controller('DecksCtrl', DecksCtrl);
})();
