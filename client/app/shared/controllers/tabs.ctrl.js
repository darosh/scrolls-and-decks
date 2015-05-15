(function () {
    'use strict';

    function TabsCtrl(UtilsUi) {
        var vm = this;

        vm.selectedIndex = 0;
        vm.selectedIndexCopy = 0;
        vm.selectedIndexChanged = UtilsUi.getTabDelay(vm, angular.noop);
    }

    angular.module('app.controllers').controller('TabsCtrl', TabsCtrl);
})();
