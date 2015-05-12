(function () {
    'use strict';

    function TabsCtrl(UtilsUi) {
        this.selectedIndex = 0;
        this.selectedIndexCopy = 0;
        this.selectedIndexChanged = UtilsUi.getTabDelay(this, angular.noop);
    }

    angular.module('app.controllers').controller('TabsCtrl', TabsCtrl);
})();
