(function () {
    'use strict';

    function LeftCardRecentCtrl($rootScope,
                                Recent, Status) {
        this.related = Recent.scrolls;
        this.showResource = true;
        this.showCard = showCard;
        this.status = Status;

        function showCard(c) {
            $rootScope.$emit('openCard', c);
        }
    }

    angular.module('app').controller('LeftCardRecentCtrl', LeftCardRecentCtrl);
})();
