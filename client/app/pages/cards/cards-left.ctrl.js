(function () {
    'use strict';

    function LeftCardsCtrl($scope, $location, $timeout,
                           $mdSidenav,
                           FilterCards, FilterUtils) {
        var sf = FilterUtils.setFilter(FilterCards);
        this.filter = FilterCards;
        this.setFilter = setFilter;
        this.filterParams = FilterUtils.filterParams;

        $scope.$on('$stateChangeSuccess', stateChanged);

        function stateChanged() {
            FilterCards.disabled = true;

            //noinspection JSCheckFunctionSignatures
            var s = $location.search();

            delete s.types;

            FilterUtils.fromParams(s, FilterCards);
            $mdSidenav('right-card').close().then(function () {
                $timeout(function () {
                    $timeout(function () {
                        FilterCards.disabled = false;
                    });
                });
            });
        }

        function setFilter(t, name, r) {
            sf(t, name, r);
        }
    }

    angular.module('app').controller('LeftCardsCtrl', LeftCardsCtrl);
})();
