(function () {
    'use strict';

    function CardCtrl($rootScope, $timeout, $document,
                      $state, $mdSidenav,
                      ScrollsDecks, Scrolls,
                      FilterUtils, UtilsUi, FilterCards, Recent, Status, Config) {

        var self = this;
        var sf = FilterUtils.setFilter(FilterCards);
        this.settingsCopy = angular.copy(Config.settingsCardFull);
        this.filter = FilterCards;
        this.showCard = showCard;
        this.openDeck = openDeck;
        this.setFilter = setFilter;
        this.filterParams = FilterUtils.filterParams;
        Status.fab = null;
        $rootScope.$on('openCard', openCard);
        $rootScope.$on('$stateChangeSuccess', update);
        $mdSidenav('right-card').close();
        UtilsUi.setTitle('Scroll');
        update();

        function setFilter(t, name, r) {
            sf(t, name, r);
            $state.go('cards');
        }

        //noinspection JSUnusedLocalSymbols
        function openCard(event, card) {
            self.showCard(card);
        }

        function openDeck(deck) {
            $state.go('deck.id', {id: deck.id});
        }

        function showCard(card) {
            $state.go('card.id', {id: card.s.id});
            $timeout(function () {
                Recent.add(card.s.id);
            }, 50);
        }

        function update() {
            if ($state.params.id) {
                var c = ScrollsDecks.Scrolls.look[$state.params.id];

                if (c) {
                    self.c = Status.card = {s: c};
                    self.decks = _.values(c.decks);
                    self.related = ScrollsTypes.RelatedCards(new ScrollsTypes.Card(c), Scrolls);
                    UtilsUi.setTitle('Scroll:', '#' + $state.params.id);

                    $timeout(function () {
                        var el = $document[0].getElementById('page-content');
                        el.scrollTop = 0;
                        el.focus();
                        Recent.add(c.id);
                    });
                }
            }
        }
    }

    angular.module('app').controller('CardCtrl', CardCtrl);
})();
