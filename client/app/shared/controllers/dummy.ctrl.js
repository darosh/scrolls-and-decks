(function () {
    'use strict';

    function DummyCtrl() {
        var vm = this;

        //noinspection JSUnusedGlobalSymbols
        vm.ct = {};
        //noinspection JSUnusedGlobalSymbols
        vm.toolbarCtrl = {};
        vm.leftCtrl = {};
        vm.cardsCtrl = {};
        vm.decksCtrl = {};
        vm.barCtrl = {};
        vm.filterParams = {};
        // TODO(refactor) remove globally?
        vm.setFilter = {};
    }

    angular.module('app.controllers').controller('DummyCtrl', DummyCtrl);
})();
