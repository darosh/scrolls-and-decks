(function () {
    'use strict';

    function LeftCardRecentCtrl($rootScope,
                                Recent, Status) {
        var vm = this;

        vm.related = Recent.scrolls;
        vm.showResource = true;
        vm.showCard = showCard;
        vm.status = Status;

        function showCard(c) {
            $rootScope.$emit('openCard', c);
        }
    }

    angular.module('app').controller('LeftCardRecentCtrl', LeftCardRecentCtrl);
})();
