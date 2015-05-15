(function () {
    'use strict';

    function DeckCtrl($scope, $q, $timeout, $window, $document,
                      $state, $mdDialog, quickRepeatList,
                      Decks, FilterDeck, Settings, UtilsPaging, UtilsUi, Storage) {
        var vm = this;
        var deckCards;
        var params = {destroyed: false, running: false};
        //var previousIndex = 0;
        var deferred = $q.defer();

        vm.settingsCopy = Settings.settingsCopy;
        vm.paging = paging;
        vm.showCard = UtilsUi.showCard;
        vm.minus = minus;
        vm.plus = plus;
        vm.selectedIndex = $state.current.name === 'deck.new' ? 3 : 0;
        vm.selectedIndexCopy = $state.current.name === 'deck.new' ? 3 : 0;
        vm.selectedIndexChanged = UtilsUi.getTabDelay(vm, updated);
        vm.filter = FilterDeck;
        vm.search = search;
        vm.deleteDeck = deleteDeck;
        vm.resetDeck = resetDeck;
        vm.cloneDeck = cloneDeck;
        vm.selectAll = selectAll;
        vm.focusData = $state.current.name === 'deck.new';
        vm.inputDeckChanged = inputDeckChanged;
        vm.inputDataChanged = inputDataChanged;
        vm.inputAuthorChanged = inputAuthorChanged;
        vm.inputOriginChanged = inputOriginChanged;
        vm.filter.error = {invalidJson: false};

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
            ScrollsTypes.RemoveDeck(vm.deck);
            Storage.decks.splice(Storage.decks.indexOf(vm.deck.storageId), 1);
            $state.go('decks');
        }

        function resetDeck() {
        }

        function cloneDeck() {
            if (vm.cloning) {
                return;
            }

            vm.cloning = true;

            $timeout(function () {
                var id = ScrollsTypes.AddDeck(vm.deck, false, false, true, Storage.decks.length);
                ScrollsTypes.CountScrollsDecks();
                ScrollsTypes.GetDecksStats();
                vm.selectedIndex = 0;
                vm.selectedIndexCopy = 0;
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
            vm.cloning = false;

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
                        vm.deck = existingDeck;

                        if (vm.deck.deck) {
                            UtilsUi.setTitle('Deck:', vm.deck.deck);
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
            UtilsUi.setTitle('Deck:', vm.filter.deck.deck || '?');
        }

        function inputDataChanged() {
            try {
                var o = angular.fromJson(vm.filter.json);
                vm.filter.error.invalidJson = false;

                var d = new ScrollsTypes.DeckExtended(o);
                deckCards.replaceDeck(d);
                setDeckPageTitle();
                FilterDeck.stats = deckCards.cards[0].s;
            } catch (ign) {
                vm.filter.error.invalidJson = true;
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
            vm.filter.deck = vm.deck;
            vm.params = vm.deck.toDeckSimple();
            vm.filter.json = angular.toJson(vm.params);
            vm.params.origin = vm.deck.origin;
            vm.params.types = vm.params.types.join(',');

            var url = angular.element('<a>')[0];
            url.href = $window.location.href;
            url.hash = $state.href('deck.import', vm.params).replace(/%2C/g, ','); /*.replace(/%252F/g,'/').replace(/%3A/g,':')*/
            vm.share = url.href;
        }

        function destroy() {
            params.destroyed = true;
        }

        function updateStoredDeck() {
            if (vm.deck.storageId) {
                vm.deck.storageId = Storage.decks[Storage.decks.indexOf(vm.deck.storageId)] = new ScrollsTypes.DeckExtended(vm.deck);
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
                c = _.find(vm.lazy, function (v) {
                    return v.s.id === id;
                });
            }

            if (c) {
                c.c++;
            } else {
                FilterDeck.items = FilterDeck.sorted = deckCards.cards[vm.selectedIndex].c;
                vm.lazy = _.take(vm.filter.items, vm.lazy.length + 1);
                $timeout(function () {
                    quickRepeatList.items(vm.lazy);
                }, 0);
            }

            FilterDeck.stats = deckCards.cards[vm.selectedIndex].s;
        }

        function minus(event, id, c) {
            event.stopPropagation();
            deckCards.removeType(id);
            c.c--;

            updateStoredDeck();

            if (c.c === 0) {
                FilterDeck.items = FilterDeck.sorted = deckCards.cards[vm.selectedIndex].c;
                vm.lazy = _.take(vm.filter.items, vm.lazy.length - 1);
                $timeout(function () {
                    quickRepeatList.items(vm.lazy);
                }, 0);
            }

            FilterDeck.stats = deckCards.cards[vm.selectedIndex].s;
        }

        //function deckAdded(id) {
        //    if (id) {
        //        $state.go('deck.id', {id: id});
        //    }
        //}

        function init() {
            params.limit = 35;
            vm.lazy = [];
            FilterDeck.lazy = vm.lazy;
        }

        function paging(si) {
            if (params.destroyed) {
                return;
            }

            if (!deckCards || !deckCards.cards || !deckCards.cards[0]) {
                return;
            }

            if (angular.isUndefined(si) && !vm.lazy.length) {
                return;
            }

            FilterDeck.items = FilterDeck.sorted = deckCards.cards[vm.selectedIndex].c;
            //previousIndex = self.selectedIndex;
            params.si = si || vm.selectedIndex;
            FilterDeck.stats = deckCards.cards[vm.selectedIndex].s;

            if (!UtilsPaging.setNext(vm, params, FilterDeck)) {
                return;
            }

            var iteration = UtilsPaging.getPagingIteration(vm, FilterDeck, params, quickRepeatList);

            if (!params.running) {
                iteration();
            }
        }

        function updated() {
            setProperties();

            if (vm.selectedIndex > 2) {
                init();

                deferred.promise.then(function () {
                    FilterDeck.stats = deckCards.cards[0].s;
                });

                return;
            }

            deferred.promise.then(function () {
                init();
                FilterDeck.stats = deckCards.cards[vm.selectedIndex].s;
                vm.paging(vm.selectedIndex);
            });
        }

        function initCards() {
            FilterDeck.deckCards = deckCards = new ScrollsTypes.DeckCards(vm.deck);
        }
    }

    angular.module('app').controller('DeckCtrl', DeckCtrl);
})();
