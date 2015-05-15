(function () {
    'use strict';

    function LeftCardsCtrl($scope, $location, $timeout,
                           $mdSidenav,
                           FilterCards, FilterUtils) {
        var vm = this;

        var sf = FilterUtils.setFilter(FilterCards);
        vm.filter = FilterCards;
        vm.setFilter = setFilter;
        vm.filterParams = FilterUtils.filterParams;

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
