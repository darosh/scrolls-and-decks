(function () {
    'use strict';

    function LeftCardBookmarksCtrl($rootScope,
                                   Bookmarks,
                                   Status) {
        this.related = Bookmarks.scrolls;
        this.look = Bookmarks.look;
        this.set = Bookmarks.set;
        this.status = Status;
        this.showResource = true;
        this.showCard = showCard;

        function showCard(c) {
            $rootScope.$emit('openCard', c);
        }
    }

    angular.module('app').controller('LeftCardBookmarksCtrl', LeftCardBookmarksCtrl);
})();
