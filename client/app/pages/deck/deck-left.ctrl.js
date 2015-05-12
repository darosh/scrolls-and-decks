(function () {
    'use strict';

    function LeftDeckCtrl($rootScope, $timeout,
                          $state,
                          Bookmarks, Cards,
                          FilterDeck, FilterCards, FilterUtils, UtilsUi, UtilsCards, Status) {
        var self = this;
        var allRelated;
        var running = false;
        var sf = FilterUtils.setFilter(FilterCards);
        var tabDelay = UtilsUi.getTabDelay(self, updated);
        var first = false;
        this.filter = FilterDeck;
        this.showResource = true;
        this.edit = true;
        this.status = Status;
        this.showCard = UtilsUi.showCard;
        this.selectedIndex = 0;
        this.selectedIndexCopy = 0;
        this.selectedIndexChanged = index;
        //noinspection JSUnusedGlobalSymbols
        this.deckPaging = deckPaging;
        this.setFilter = setFilter;
        this.addCard = addCard;
        this.filterParams = FilterUtils.filterParams;
        FilterDeck.querySearch = FilterUtils.query(FilterDeck, Cards[0].c, Cards[0].s);

        $rootScope.$watch(function () {
            return FilterDeck.params;
        }, filterParams, true);

        $rootScope.$watch(function () {
            return FilterDeck.text.search;
        }, filterText);

        if ($state.current.name === 'deck.new') {
            this.selectedIndex = 1;
            this.selectedIndexCopy = 1;
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
            self.selectedIndex = 1;
            Status.fab = null;
        }

        function index() {
            if (first) {
                $timeout(function () {
                    if (self.selectedIndex !== 1) {
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
                if (self.related && (i < 8) && (self.related.length < allRelated.length)) {
                    running = true;

                    $timeout(function () {
                        self.related.push(allRelated[self.related.length]);
                        i++;
                        iteration();
                    }, 20);
                } else {
                    running = false;
                }
            }

            if ((self.selectedIndexCopy === 1) && !running) {
                iteration();
            }
        }

        function updated() {
            self.filter.edit = self.selectedIndex === 1;
            allRelated = UtilsCards.filter(Cards[0].c, FilterDeck.params, FilterDeck.text, Bookmarks);
            self.related = _.take(allRelated, 15);
        }
    }

    angular.module('app').controller('LeftDeckCtrl', LeftDeckCtrl);
})
();
