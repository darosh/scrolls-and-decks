(function () {
    'use strict';

    function CardCtrl($rootScope, $timeout, $document,
                      $state, $mdSidenav,
                      ScrollsDecks, Scrolls,
                      FilterUtils, UtilsUi, FilterCards, Recent, Status, Config) {

        var vm = this;
        var sf = FilterUtils.setFilter(FilterCards);
        vm.settingsCopy = angular.copy(Config.settingsCardFull);
        vm.filter = FilterCards;
        vm.showCard = showCard;
        vm.openDeck = openDeck;
        vm.setFilter = setFilter;
        vm.filterParams = FilterUtils.filterParams;
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
            vm.showCard(card);
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
                    vm.c = Status.card = {s: c};
                    vm.decks = _.values(c.decks);
                    vm.related = ScrollsTypes.RelatedCards(new ScrollsTypes.Card(c), Scrolls);
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
