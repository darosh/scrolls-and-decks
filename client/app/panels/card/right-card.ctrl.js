(function () {
    'use strict';

    function RightCardCtrl($rootScope, $timeout, $window, $document,
                           $state, $mdSidenav, $analytics,
                           Scrolls, Bookmarks, Recent,
                           FilterCards, FilterUtils, Status, Config) {
        var self = this;
        var allRelated, allDecks;
        var sf = FilterUtils.setFilter(FilterCards);
        this.settingsCopy = angular.copy(Config.settingsCard);
        this.filter = FilterCards;
        this.look = Bookmarks.look;
        this.set = Bookmarks.set;
        this.showCard = showCard;
        //noinspection JSUnusedGlobalSymbols
        this.deckPaging = deckPaging;
        this.openDeck = openDeck;
        this.setFilter = setFilter;
        this.filterParams = FilterUtils.filterParams;

        $rootScope.$on('showCard', showCardMsg);

        $rootScope.$on('$stateChangeSuccess', updateDeckId);

        function updateDeckId() {
            self.deckId = ($state.current.name === 'deck.id') ? $state.params.id : null;

            if (!$state.current.pinCard) {
                $mdSidenav('right-card').close();
            }
        }

        function setFilter(t, name, r) {
            $mdSidenav('right-card').close().then(function () {
                sf(t, name, r);
                $state.go('cards');
            });
        }

        function deckPaging() {
            if (self.c) {
                self.decks = allDecks;
                self.related = allRelated;
            }
        }

        function openDeck(deck) {
            $mdSidenav('right-card').close().then(function () {
                $state.go('deck.id', {id: deck.id});
            });
        }

        //noinspection JSUnusedLocalSymbols
        function showCardMsg(event, card) {
            showCard(card);
        }

        function showCard(card) {
            $timeout(function () {
                Status.card = card;
                self.c = card;
                allDecks = _.values(card.s.decks);
                self.decks = _.take(allDecks, 15);
                allRelated = ScrollsTypes.RelatedCards(card, Scrolls, 20);
                self.related = _.take(allRelated, 15);
                if ($document[0].activeElement) {
                    $document[0].activeElement.blur();
                }

                var ro = $mdSidenav('right-card');

                if (ro.isOpen()) {
                    $window.setTimeout(function () {
                        $document[0].getElementById('right-card-content').scrollTop = 0;
                        $timeout(function () {
                            Recent.add(card.s.id);
                        }, 333.333);
                    });
                } else {
                    $window.setTimeout(function () {
                        ro.open().then(function () {
                            $window.setTimeout(function () {
                                $document[0].getElementById('right-card-content').scrollTop = 0;
                                $timeout(function () {
                                    Recent.add(card.s.id);
                                }, 333.333);
                            });
                        });
                    }, 83.333);
                }
            });

            //noinspection JSUnresolvedFunction
            $analytics.eventTrack(card.s.name, {category: 'Card'});
        }
    }

    angular.module('app.panels').controller('RightCardCtrl', RightCardCtrl);
})();
