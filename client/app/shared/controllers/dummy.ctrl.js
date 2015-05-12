(function () {
    'use strict';

    function DummyCtrl() {
        //noinspection JSUnusedGlobalSymbols
        this.ct = {};
        //noinspection JSUnusedGlobalSymbols
        this.toolbarCtrl = {};
        this.leftCtrl = {};
        this.cardsCtrl = {};
        this.decksCtrl = {};
        this.barCtrl = {};
        this.filterParams = {};
        // TODO(refactor) remove globally?
        this.setFilter = {};
    }

    angular.module('app.controllers').controller('DummyCtrl', DummyCtrl);
})();
