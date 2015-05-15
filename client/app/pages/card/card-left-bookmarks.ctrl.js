(function () {
    'use strict';

    function LeftCardBookmarksCtrl($rootScope,
                                   Bookmarks,
                                   Status) {
        var vm = this;

        vm.related = Bookmarks.scrolls;
        vm.look = Bookmarks.look;
        vm.set = Bookmarks.set;
        vm.status = Status;
        vm.showResource = true;
        vm.showCard = showCard;

        function showCard(c) {
            $rootScope.$emit('openCard', c);
        }
    }

    angular.module('app').controller('LeftCardBookmarksCtrl', LeftCardBookmarksCtrl);
})();
