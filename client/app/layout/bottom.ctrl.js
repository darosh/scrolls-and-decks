(function () {
    'use strict';

    function BottomCtrl($mdBottomSheet) {
        var vm = this;

        vm.itemClick = function (target) {
            $mdBottomSheet.hide(target);
        };
    }

    angular.module('app').controller('BottomCtrl', BottomCtrl);
})();
