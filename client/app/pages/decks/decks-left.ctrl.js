(function () {
    'use strict';

    function LeftDecksCtrl(FilterDecks) {
        var vm = this;
        vm.filter = FilterDecks;
    }

    angular.module('app').controller('LeftDecksCtrl', LeftDecksCtrl);
})();
