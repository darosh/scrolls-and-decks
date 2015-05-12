(function () {
    'use strict';

    function UtilsUi($timeout, $rootScope,
                     $state,
                     Config) {
        return {
            getTabDelay: getTabDelay,
            setTitle: setTitle,
            showCard: showCard
        };

        function showCard(c, event) {
            if (event && (event.ctrlKey || event.altKey)) {
                $state.go('card.id', {id: c.s.id});
            } else {
                $rootScope.$emit('showCard', c);
            }
        }

        function getTabDelay(self, updated) {
            return function () {
                $timeout(function () {
                    if (self.selectedIndexCopy !== self.selectedIndex) {
                        self.selectedIndexCopy = self.selectedIndex;
                        updated();
                    }
                }, Config.tabDelay);
            };
        }

        function setTitle(title, subTitle) {
            $rootScope.title = title;
            $rootScope.subTitle = subTitle;
            $rootScope.mainTitle = title + (subTitle ? ' ' + subTitle : '') + ' | Scrolls & Decks';
        }
    }

    angular.module('app.services').factory('UtilsUi', UtilsUi);
})();
