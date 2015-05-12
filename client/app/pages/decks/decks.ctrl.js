(function () {
    'use strict';

    function DecksCtrl($scope, $timeout, $document,
                       $state, quickRepeatList,
                       Decks,
                       Status, Storage, FilterDecks, Settings, UtilsPaging, UtilsDecks, UtilsUi) {
        var self = this;
        var params = {running: false, destroyed: false};
        var previousIndex = 0;
        var previousSort = null;
        this.selectedIndex = 0;
        this.selectedIndexCopy = 0;
        this.selectedIndexChanged = UtilsUi.getTabDelay(self, updated);
        this.paging = paging;
        this.settingsCopy = Settings.settingsCopy;
        this.openDeck = openDeck;
        this.addDeck = addDeck;
        this.filter = FilterDecks;
        this.myScrolls = Storage.cards;
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
            self.lazy = [];
        }

        function paging(si) {
            if (params.destroyed) {
                return;
            }

            if (!Decks[0]) {
                return;
            }

            if ((si === undefined) && !self.lazy.length) {
                return;
            }

            if ((self.selectedIndex !== previousIndex) || !FilterDecks.sorted) {
                if (previousSort) {
                    FilterDecks.sorted = UtilsDecks.sort(previousSort, Decks[self.selectedIndex]);
                    FilterDecks.sorted = UtilsDecks.sort(FilterDecks.params.sort, FilterDecks.sorted);
                } else {
                    FilterDecks.sorted = UtilsDecks.sort(FilterDecks.params.sort, Decks[self.selectedIndex]);
                }
            } else {
                FilterDecks.sorted = UtilsDecks.sort(FilterDecks.params.sort, FilterDecks.sorted);
            }

            FilterDecks.items = UtilsDecks.filter(FilterDecks.sorted, FilterDecks.params, FilterDecks.text);

            previousIndex = self.selectedIndex;
            previousSort = FilterDecks.params.sort;
            params.si = si || self.selectedIndex;
            FilterDecks.stats = Decks.stats[self.selectedIndex];

            if (!UtilsPaging.setNext(self, params, FilterDecks)) {
                return;
            }

            var iteration = UtilsPaging.getPagingIteration(self, FilterDecks, params, quickRepeatList);

            if (!params.running) {
                iteration();
            }
        }

        function updated(newVal, oldVal) {
            if ((newVal === '' || newVal === null) && !oldVal) {
                return;
            }

            init();
            self.paging(self.selectedIndex);
        }
    }

    angular.module('app').controller('DecksCtrl', DecksCtrl);
})();
