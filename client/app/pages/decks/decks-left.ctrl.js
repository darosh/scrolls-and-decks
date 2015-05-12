(function () {
    'use strict';

    function LeftDecksCtrl(FilterDecks) {
        this.filter = FilterDecks;
    }

    angular.module('app').controller('LeftDecksCtrl', LeftDecksCtrl);
})();
