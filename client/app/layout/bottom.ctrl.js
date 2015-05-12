(function () {
    'use strict';

    function BottomCtrl($mdBottomSheet) {
        this.itemClick = function (target) {
            $mdBottomSheet.hide(target);
        };
    }

    angular.module('app').controller('BottomCtrl', BottomCtrl);
})();
