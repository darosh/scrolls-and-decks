(function () {
    'use strict';

    function DeckCtrl($scope, $q, $timeout, $window, $document,
                      $state, $mdDialog, quickRepeatList,
                      Decks, FilterDeck, Settings, UtilsPaging, UtilsUi, Storage) {
        var self = this;
        var deckCards;
        var params = {destroyed: false, running: false};
        //var previousIndex = 0;
        var deferred = $q.defer();

        this.settingsCopy = Settings.settingsCopy;
        this.paging = paging;
        this.showCard = UtilsUi.showCard;
        this.minus = minus;
        this.plus = plus;
        this.selectedIndex = $state.current.name === 'deck.new' ? 3 : 0;
        this.selectedIndexCopy = $state.current.name === 'deck.new' ? 3 : 0;
        this.selectedIndexChanged = UtilsUi.getTabDelay(self, updated);
        this.filter = FilterDeck;
        this.search = search;
        this.deleteDeck = deleteDeck;
        this.resetDeck = resetDeck;
        this.cloneDeck = cloneDeck;
        this.selectAll = selectAll;
        this.focusData = $state.current.name === 'deck.new';
        this.inputDeckChanged = inputDeckChanged;
        this.inputDataChanged = inputDataChanged;
        this.inputAuthorChanged = inputAuthorChanged;
        this.inputOriginChanged = inputOriginChanged;
        this.filter.error = {invalidJson: false};

        UtilsUi.setTitle('Deck');
        FilterDeck.sorted = null;
        FilterDeck.edit = false;
        $scope.$on('$destroy', destroy);
        //start();

        $scope.$on('$stateChangeSuccess', start);

        $scope.$on('addType', plus);

        function selectAll(event) {
            event.target.select();
        }

        function deleteDeck() {
            ScrollsTypes.RemoveDeck(self.deck);
            Storage.decks.splice(Storage.decks.indexOf(self.deck.storageId), 1);
            $state.go('decks');
        }

        function resetDeck() {
        }

        function cloneDeck() {
            if (self.cloning) {
                return;
            }

            self.cloning = true;

            $timeout(function () {
                var id = ScrollsTypes.AddDeck(self.deck, false, false, true, Storage.decks.length);
                ScrollsTypes.CountScrollsDecks();
                ScrollsTypes.GetDecksStats();
                self.selectedIndex = 0;
                self.selectedIndexCopy = 0;
                Storage.decks.push(new ScrollsTypes.DeckExtended(ScrollsTypes._decks[id]));
                $state.go('deck.id', {id: id});
            }, 0);
        }

        function confirmDialog() {
            var d = $mdDialog.confirm()
                .theme(Settings.settings.dark ? 'dark' : 'default')
                .title('Import deck')
                .content('Duplicated deck import detected, do you want to open existing or import anyway?')
                .cancel('Open')
                .ok('Import');

            delete d._options.template;
            d._options.templateUrl = 'app/shared/views/dialog.html';
            d._options.clickOutsideToClose = true;
            d._options.ariaLabel = d._options.title;

            return $mdDialog.show(d);
        }

        function importDeck(deck) {
            var id = ScrollsTypes.AddDeck(deck, false, false, false, Storage.decks.length);
            ScrollsTypes.CountScrollsDecks();
            ScrollsTypes.GetDecksStats();
            Storage.decks.push(new ScrollsTypes.DeckExtended(ScrollsTypes._decks[id]));
            $state.go('deck.id', {id: id});
        }

        function start() {
            self.cloning = false;

            if ($state.params.types) {
                // TODO(future) check bookmarklet version
                var deck = new ScrollsTypes.DeckExtended($state.params);

                var existing = ScrollsTypes.GetDeckByHash(deck.getDeckHash());

                if (existing) {
                    confirmDialog().then(function () {
                        importDeck();
                    }, function () {
                        $state.go('deck.id', {id: existing.id});
                    });
                } else {
                    importDeck(deck);
                }
            } else if ($state.params.id) {
                Decks.getDeck($state.params.id, function (existingDeck) {
                    if (existingDeck) {
                        self.deck = existingDeck;

                        if (self.deck.deck) {
                            UtilsUi.setTitle('Deck:', self.deck.deck);
                        }

                        setProperties();
                        initCards();
                        deferred.resolve();
                        updated();
                    }
                });
            }

            $timeout(function () {
                var el = $document[0].getElementById('page-content');
                el.focus();
            });
        }

        function inputDeckChanged() {
            setDeckPageTitle();
            metaUpdated();
        }

        function setDeckPageTitle() {
            UtilsUi.setTitle('Deck:', self.filter.deck.deck || '?');
        }

        function inputDataChanged() {
            try {
                var o = angular.fromJson(self.filter.json);
                self.filter.error.invalidJson = false;

                var d = new ScrollsTypes.DeckExtended(o);
                deckCards.replaceDeck(d);
                setDeckPageTitle();
                FilterDeck.stats = deckCards.cards[0].s;
            } catch (ign) {
                self.filter.error.invalidJson = true;
            }
        }

        function inputAuthorChanged() {
            metaUpdated();
        }

        function inputOriginChanged() {
            metaUpdated();
        }

        function metaUpdated() {
            setProperties();
            updateStoredDeck();
        }

        function search(s) {
            $state.go('decks', {search: s});
        }

        function setProperties() {
            self.filter.deck = self.deck;
            self.params = self.deck.toDeckSimple();
            self.filter.json = angular.toJson(self.params);
            self.params.origin = self.deck.origin;
            self.params.types = self.params.types.join(',');

            var url = angular.element('<a>')[0];
            url.href = $window.location.href;
            url.hash = $state.href('deck.import', self.params).replace(/%2C/g, ','); /*.replace(/%252F/g,'/').replace(/%3A/g,':')*/
            self.share = url.href;
        }

        function destroy() {
            params.destroyed = true;
        }

        function updateStoredDeck() {
            if (self.deck.storageId) {
                self.deck.storageId = Storage.decks[Storage.decks.indexOf(self.deck.storageId)] = new ScrollsTypes.DeckExtended(self.deck);
            }
        }

        function plus(event, id, c) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }

            var added = deckCards.addType(id);

            if (!added) {
                return;
            }

            updateStoredDeck();

            if (!c) {
                c = _.find(self.lazy, function (v) {
                    return v.s.id === id;
                });
            }

            if (c) {
                c.c++;
            } else {
                FilterDeck.items = FilterDeck.sorted = deckCards.cards[self.selectedIndex].c;
                self.lazy = _.take(self.filter.items, self.lazy.length + 1);
                $timeout(function () {
                    quickRepeatList.items(self.lazy);
                }, 0);
            }

            FilterDeck.stats = deckCards.cards[self.selectedIndex].s;
        }

        function minus(event, id, c) {
            event.stopPropagation();
            deckCards.removeType(id);
            c.c--;

            updateStoredDeck();

            if (c.c === 0) {
                FilterDeck.items = FilterDeck.sorted = deckCards.cards[self.selectedIndex].c;
                self.lazy = _.take(self.filter.items, self.lazy.length - 1);
                $timeout(function () {
                    quickRepeatList.items(self.lazy);
                }, 0);
            }

            FilterDeck.stats = deckCards.cards[self.selectedIndex].s;
        }

        //function deckAdded(id) {
        //    if (id) {
        //        $state.go('deck.id', {id: id});
        //    }
        //}

        function init() {
            params.limit = 35;
            self.lazy = [];
            FilterDeck.lazy = self.lazy;
        }

        function paging(si) {
            if (params.destroyed) {
                return;
            }

            if (!deckCards || !deckCards.cards || !deckCards.cards[0]) {
                return;
            }

            if (angular.isUndefined(si) && !self.lazy.length) {
                return;
            }

            FilterDeck.items = FilterDeck.sorted = deckCards.cards[self.selectedIndex].c;
            //previousIndex = self.selectedIndex;
            params.si = si || self.selectedIndex;
            FilterDeck.stats = deckCards.cards[self.selectedIndex].s;

            if (!UtilsPaging.setNext(self, params, FilterDeck)) {
                return;
            }

            var iteration = UtilsPaging.getPagingIteration(self, FilterDeck, params, quickRepeatList);

            if (!params.running) {
                iteration();
            }
        }

        function updated() {
            setProperties();

            if (self.selectedIndex > 2) {
                init();

                deferred.promise.then(function () {
                    FilterDeck.stats = deckCards.cards[0].s;
                });

                return;
            }

            deferred.promise.then(function () {
                init();
                FilterDeck.stats = deckCards.cards[self.selectedIndex].s;
                self.paging(self.selectedIndex);
            });
        }

        function initCards() {
            FilterDeck.deckCards = deckCards = new ScrollsTypes.DeckCards(self.deck);
        }
    }

    angular.module('app').controller('DeckCtrl', DeckCtrl);
})();
